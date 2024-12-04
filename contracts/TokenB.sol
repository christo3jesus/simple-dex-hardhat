// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title TokenB
/// @notice Un simple contrato ERC-20 para el token B.
contract TokenB is ERC20 {
    constructor() ERC20("TokenB", "TKB") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}
