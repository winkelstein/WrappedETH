import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/9777398aecef400aadd67a3a6acf9d13",
      accounts: [process.env.GOERLI_PRIVATE_KEY as string],
    },
  },

  etherscan: {
    apiKey: {
      goerli: process.env.GOERLISCAN_API_KEY as string,
    },
  },
};

export default config;
