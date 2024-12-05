import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const SimpleDEXModule = buildModule("SimpleDEX", (m) => {
  const TOKEN_A_ADDRESS = process.env.TOKEN_A_ADDRESS;
  const TOKEN_B_ADDRESS = process.env.TOKEN_B_ADDRESS;

  if (
    !ethers.isAddress(TOKEN_A_ADDRESS) ||
    !ethers.isAddress(TOKEN_B_ADDRESS)
  ) {
    throw new Error("Invalid token addresses provided.");
  }

  const simpleDEX = m.contract("SimpleDEX", [TOKEN_A_ADDRESS, TOKEN_B_ADDRESS]);

  return { simpleDEX };
});

export default SimpleDEXModule;
