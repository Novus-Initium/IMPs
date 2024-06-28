import { ethers } from 'ethers';
const { getABI, getNetworkName } = require('../../../hardhat/scripts/utils');

const fetchRoundCreatedEvents = async (provider: any) => {
    const roundFactory = getABI(await getNetworkName(provider), 'RoundFactory');
    const roundFactoryABI = roundFactory.abi;
    console.log('ABI', roundFactoryABI);
    const roundFactoryAddress = roundFactory.address
    const contract = new ethers.Contract(roundFactoryAddress, roundFactoryABI, provider);
  
    // Define the event filter
    const filter = contract.filters.RoundCreated();
  
    // Fetch the events
    const events = await contract.queryFilter(filter);
  
    return events;
  };


export default fetchRoundCreatedEvents;