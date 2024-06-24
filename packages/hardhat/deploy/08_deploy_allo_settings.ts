import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

const deployAlloSettings: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Define your network-specific parameters
  const AlloSettingsParams: { [key: string]: { protocolFeePercentage: number; protocolTreasury: string; } } = {
    mainnet: {
      protocolFeePercentage: 100, // Example: 1%
      protocolTreasury: process.env.MAINNET_TREASURY_ADDRESS || "0x891D071510EdAC606519237f88C2a9F531fbFAbE"
    },
    sepolia: {
      protocolFeePercentage: 50, // Example: 0.5%
      protocolTreasury: process.env.SEPOLIA_TREASURY_ADDRESS || "0x891D071510EdAC606519237f88C2a9F531fbFAbE"
    },
    localhost: {
        protocolFeePercentage: 50, // Example: 0.5%
        protocolTreasury: process.env.HARDHAT_TREASURY_ADDRESS || "0x891D071510EdAC606519237f88C2a9F531fbFAbE"
      }
  };

  const networkParams = AlloSettingsParams[hre.network.name];

  if (!networkParams) {
    throw new Error(`Invalid network ${hre.network.name}`);
  }

  const { protocolFeePercentage, protocolTreasury } = networkParams;

  // Deploy the AlloSettings contract
  const alloSettingsDeployment = await deploy("AlloSettings", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  console.log("✅ Deployed AlloSettings.");

  // Get the deployed contract instance
  const alloSettings = await ethers.getContractAt("AlloSettings", alloSettingsDeployment.address);
  const tx = await alloSettings.initialize();
  await tx.wait();

  // Verify deployer is the owner
  const owner = await alloSettings.owner();
  if (owner.toLowerCase() !== deployer.toLowerCase()) {
    throw new Error("Deployer is not the owner of the contract");
  }

  // Initialize the contract with protocol fee percentage and protocol treasury
  const initTx1 = await alloSettings.updateProtocolFeePercentage(protocolFeePercentage, { from: deployer });
  await initTx1.wait();
  console.log(`✅ Protocol Fee Percentage set to ${protocolFeePercentage}`);

  const initTx2 = await alloSettings.updateProtocolTreasury(protocolTreasury, { from: deployer });
  await initTx2.wait();
  console.log(`✅ Protocol Treasury set to ${protocolTreasury}`);
};

export default deployAlloSettings;

deployAlloSettings.tags = ["AlloSettings"];
