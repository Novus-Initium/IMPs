// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// A practice contract to demonstrate the differences between contracts, and how to interact with them in the deployment scripts
// This contract is meant to be a basic minting contract that allows any whitelisted address to mint tokens from YourWhitelist.sol
// This contract will inherit the whitelist contract and use it to check if the address is whitelisted before minting
// Although arrays are not always the most efficient way to store data, they are used here for simplicity
// In this contract, whitelisted addresses can mint 1 million tokens, and the owner can mint an unlimited amount. There is no fixed supply.

import "./YourWhitelist.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YourMint is YourWhitelist, ERC20 {
    constructor() ERC20("YourMint", "YM") { //We can also define the parameters of a constructor in our deployment script
        // Initialize your token parameters

    }

    function mint(address to, uint256 amount) external onlyWhitelisted {
        _mint(to, amount);
    }
}