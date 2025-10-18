import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

type TokenRecord = {
  token: string;
  creator: string;
  createdAt: bigint;
};

task("task:factory-address", "Prints the ConfidentialTokenFactory address").setAction(async (_, hre) => {
  const { deployments } = hre;
  const deployment = await deployments.get("ConfidentialTokenFactory");
  console.log(`ConfidentialTokenFactory address: ${deployment.address}`);
});

task("task:create-token", "Creates a confidential token")
  .addParam("name", "Token name")
  .addParam("symbol", "Token symbol")
  .setAction(async (taskArgs: TaskArguments, hre) => {
    const { ethers, deployments } = hre;

    const deployment = await deployments.get("ConfidentialTokenFactory");
    const [signer] = await ethers.getSigners();

    const factory = await ethers.getContractAt("ConfidentialTokenFactory", deployment.address, signer);

    const tx = await factory.createConfidentialToken(taskArgs.name as string, taskArgs.symbol as string);
    console.log(`tx hash: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`status: ${receipt?.status}`);
  });

task("task:list-tokens", "Lists tokens created through the factory").setAction(async (_, hre) => {
  const { deployments, ethers } = hre;
  const deployment = await deployments.get("ConfidentialTokenFactory");
  const factory = await ethers.getContractAt("ConfidentialTokenFactory", deployment.address);

  const records = (await factory.getTokenRecords()) as TokenRecord[];
  if (records.length === 0) {
    console.log("No confidential tokens created yet.");
    return;
  }

  records.forEach((record, index) => {
    console.log(`Token #${index}`);
    console.log(`  address : ${record.token}`);
    console.log(`  creator : ${record.creator}`);
    console.log(`  created : ${new Date(Number(record.createdAt) * 1000).toISOString()}`);
  });
});

task("task:freemint", "Calls freemint on a confidential token")
  .addParam("token", "Token address")
  .setAction(async (taskArgs: TaskArguments, hre) => {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();
    const token = await ethers.getContractAt("LaunchpadConfidentialToken", taskArgs.token as string, signer);

    const tx = await token.freemint();
    console.log(`tx hash: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`status: ${receipt?.status}`);
  });
