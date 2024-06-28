const { ethers } = require("ethers");
const { getABI, getNetworkName } = require("./utils");

const ApplicationStatus = {
  PENDING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
  CANCELED: 3,
};

function buildStatusRow(currentStatuses, updates) {
  for (const { index, status } of updates) {
    const shift = BigInt(index * 2);
    const mask = BigInt(3) << shift;
    currentStatuses = (currentStatuses & ~mask) | (BigInt(status) << shift);
  }
  return currentStatuses;
}

async function setApplicationStatuses(provider, roundAddress, statuses, applicationStatusBitMapIndex = 0) {
  try {
    const signer = await provider.getSigner();
    const networkName = await getNetworkName(provider);
    const roundImplementationABI = getABI(networkName, "RoundImplementation").abi;
    const contract = new ethers.Contract(roundAddress, roundImplementationABI, signer);

    const currentStatuses = await contract.applicationStatusesBitMap(applicationStatusBitMapIndex);
    const newState = buildStatusRow(BigInt(currentStatuses.toString()), statuses);

    const applicationStatus = {
      index: applicationStatusBitMapIndex,
      statusRow: newState,
    };

    const updateTx = await contract.setApplicationStatuses([applicationStatus]);
    await updateTx.wait();

    console.log("✅ Application statuses updated: ", updateTx.hash);
  } catch (error) {
    console.error("Failed to set application statuses:", error);
    throw error;
  }
}

module.exports = {
  ApplicationStatus,
  setApplicationStatuses
};
