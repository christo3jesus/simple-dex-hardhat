import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { getEnvironmentVariable } from "./scripts/envHelper";

const INFURA_API_KEY = getEnvironmentVariable("INFURA_API_KEY");
const SEPOLIA_PRIVATE_KEY = getEnvironmentVariable("SEPOLIA_PRIVATE_KEY");
const ETHERSCAN_API_KEY = getEnvironmentVariable("ETHERSCAN_API_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
};

export default config;
