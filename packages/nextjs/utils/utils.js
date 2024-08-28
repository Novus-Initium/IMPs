const { AbiCoder, getAddress, parseUnits } = require("ethers");

/**
 * Encodes the parameters for the ProgramFactory.create() function.
 *
 * @param params
 * @returns {string}
 */
const encodeProgramParameters = (params) => {
  const abiCoder = new AbiCoder();
  return abiCoder.encode(
    ["tuple(uint256 protocol, string pointer)", "address[]", "address[]"],
    params
  );
}

/**
 * Encodes the parameters for the RoundFactory.create() function.
 *
 * @param params
 * @returns {string}
 */

  const encodeRoundParameters = (params) => {
    const abiCoder = new AbiCoder();
    return abiCoder.encode(
      [
        "tuple(address votingStrategyFactory, address payoutStrategyFactory)",
        "tuple(uint256 applicationsStartTime, uint256 applicationsEndTime, uint256 roundStartTime, uint256 roundEndTime)",
        "uint256",
        "address",
        "uint32",
        "address",
        "tuple(tuple(uint256 protocol, string pointer) roundMetaPtr, tuple(uint256 protocol, string pointer) applicationMetaPtr)",
        "tuple(address[] adminRoles, address[] roundOperators)"
      ],
      params
    );
  }

  const encodedVotes = (params) => {
    const abiCoder = new AbiCoder();
    return abiCoder.encode(
      [
        "address",
        "uint256",
        "address",
        "bytes32",
        "uint256",
      ],
      params
    );
  }


  function encodeQFVotes(donationToken, donations) {
    const abiCoder = new AbiCoder();

    return donations.map((donation) => {
      const vote = [
        getAddress(donationToken.address),
        parseUnits(donation.amount, donationToken.decimals),
        getAddress(donation.recipient),
        donation.projectRegistryId,
        BigInt(donation.applicationIndex),
      ];
  
      return abiCoder.encode(
        ["address", "uint256", "address", "bytes32", "uint256"],
        vote
      );
    });
  }

/**
 * Encodes the parameters for the MerklePayoutStrategy.updateDistribution() function.
 *
 * @param params
 * @returns {string}
 */
const encodeMerkleUpdateDistributionParameters = (params) => {
  const abiCoder = new AbiCoder();
  return abiCoder.encode(
    [
      "bytes32",
      "tuple(uint256 protocol, string pointer)"
    ],
    params
  );
}

/**
 * Asserts that environment variables are set as expected.
 */

const getABI = (networkName, contractName) => {
  try {
    const abiFile = require(`../deployments/${networkName}/${contractName}.json`);
    console.log(abiFile)
    if (!abiFile.address) {
      throw new Error(`Address not found for ${contractName} on network ${networkName}`);
    }
    return { abi: abiFile.abi, address: abiFile.address };
  } catch (error) {
    throw new Error(`ABI for ${contractName} on network ${networkName} not found`);
  }
};

const chainIdToNetworkName = {
  "1": "mainnet",
  "4": "rinkeby",
  "42": "kovan",
  "137": "polygon",
  "31337": "localhost",
  "11155111": "sepolia"
};

const getNetworkName = async (provider) => {
  try {
    const network = await provider.getNetwork();
    const chainId = network.chainId.toString();
    const networkName = chainIdToNetworkName[chainId] || "localhost";
    if (!networkName) throw new Error(`Network name for chain ID ${chainId} not found`);
    return networkName;
  } catch (error) {
    console.error(`Failed to get network name: ${error.message}`);
    throw error;
  }
};

module.exports = {
  encodeProgramParameters,
  encodeRoundParameters,
  encodeMerkleUpdateDistributionParameters,
  getABI,
  getNetworkName,
  encodedVotes,
  encodeQFVotes
};