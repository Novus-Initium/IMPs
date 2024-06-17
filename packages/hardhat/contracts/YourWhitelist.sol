// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// A practice contract to demonstrate the differences between contracts, and how to interact with them in the deployment scripts
// This contract is meant to be a basic whitelisted contract that allows anyone to sign up and be added to the whitelist
// The owner of the contract can add and remove users from the whitelist
// Although arrays are not always the most efficient way to store data, they are used here for simplicity

contract Whitelist {
    // Contract variables and state
    address public owner;
    address[] public whitelist;
    
    // Constructor that sets the owner of the contract
    constructor() {
        owner = msg.sender;
    }

    // Contract functions that allow to be whitelisted
    function signUp() public {
        whitelist.push(msg.sender);
    }

    // Contract functions that allow the owner to add or remove users from the whitelist
    function addToWhitelist(address _user) public {
        require(msg.sender == owner, "Only the owner can add to the whitelist");
        whitelist.push(_user);
    }

    function removeFromWhitelist(address _user) public {
        require(msg.sender == owner, "Only the owner can remove from the whitelist");
        for (uint i = 0; i < whitelist.length; i++) {
            if (whitelist[i] == _user) {
                delete whitelist[i];
            }
        }
    }

    // Contract functions that allow to check if an address is whitelisted
    function isWhitelisted(address _user) public view returns (bool) {
        for (uint i = 0; i < whitelist.length; i++) {
            if (whitelist[i] == _user) {
                return true;
            }
        }
        return false;
    }

    // Contract functions that allow to get the number of users in the whitelist
    function getWhitelistCount() public view returns (uint) {
        return whitelist.length;
    }

    // Contract functions that allow to get the list of users in the whitelist
    function getWhitelist() public view returns (address[] memory) {
        return whitelist;
    }
    
}