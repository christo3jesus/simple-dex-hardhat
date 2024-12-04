import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenBModule = buildModule("TokenB", (m) => {
  const tokenB = m.contract("TokenB");

  return { tokenB };
});

export default TokenBModule;
