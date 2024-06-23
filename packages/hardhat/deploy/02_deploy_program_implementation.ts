import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployProgramImplementation: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("ProgramImplementation", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  console.log("✅ Deployed ProgramImplementation.");


};

export default deployProgramImplementation;

deployProgramImplementation.tags = ["ProgramImplementation"];
