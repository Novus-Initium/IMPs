import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployProgramFactory: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  // Deploy the ProgramFactory contract
  const programFactoryDeployment = await deploy("ProgramFactory", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  console.log("✅ Deployed ProgramFactory.");

  // Get the address of the deployed ProgramImplementation
  const programImplementation = await get("ProgramImplementation");

  // Initialize the ProgramFactory contract
  const programFactory = await ethers.getContractAt("ProgramFactory", programFactoryDeployment.address);
  const tx = await programFactory.initialize();
  await tx.wait();

  // Update the ProgramFactory with the ProgramImplementation address
  const updateTx = await programFactory.updateProgramContract(programImplementation.address);
  await updateTx.wait();
};

export default deployProgramFactory;

deployProgramFactory.tags = ["ProgramFactory"];
