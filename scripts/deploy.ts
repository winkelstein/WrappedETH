import { ethers } from "hardhat";

async function main() {
  const WrappedETH = await ethers.getContractFactory("WrappedETH");
  const weth = await WrappedETH.deploy();

  await weth.deployed();

  console.log(`Wrapped ETH deployed to ${weth.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
