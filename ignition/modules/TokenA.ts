import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenAModule = buildModule("TokenA", (m) => {
  const tokenA = m.contract("TokenA");

  return { tokenA };
});

export default TokenAModule;