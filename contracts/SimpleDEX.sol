// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title SimpleDEX
/// @notice Un contrato para intercambio de tokens basado en la fórmula del producto constante.
contract SimpleDEX is Ownable {
    IERC20 public tokenA;
    IERC20 public tokenB;
    uint256 public reserveA;
    uint256 public reserveB;

    /// @notice Evento emitido cuando se añade liquidez.
    event LiquidityAdded(
        address indexed provider,
        uint256 amountA,
        uint256 amountB
    );

    /// @notice Evento emitido cuando se retira liquidez.
    event LiquidityRemoved(
        address indexed provider,
        uint256 amountA,
        uint256 amountB
    );

    /// @notice Evento emitido cuando se realiza un intercambio.
    event TokensSwapped(
        address indexed trader,
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 amountOut
    );

    /// @dev Constructor que inicializa los tokens del DEX.
    /// @param _tokenA Dirección del contrato del TokenA.
    /// @param _tokenB Dirección del contrato del TokenB.
    constructor(address _tokenA, address _tokenB) Ownable(msg.sender) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    /// @notice Añadir liquidez al pool.
    /// @param amountA Cantidad de TokenA a añadir.
    /// @param amountB Cantidad de TokenB a añadir.
    function addLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than 0");

        // Transferir los tokens desde el owner al contrato.
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        // Actualizar reservas.
        reserveA += amountA;
        reserveB += amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    /// @notice Intercambiar TokenA por TokenB.
    /// @param amountAIn Cantidad de TokenA a intercambiar.
    function swapAforB(uint256 amountAIn) external {
        require(amountAIn > 0, "Amount must be greater than 0");

        uint256 amountBOut = getAmountOut(amountAIn, reserveA, reserveB);

        require(amountBOut > 0, "Insufficient output amount");
        require(reserveB >= amountBOut, "Insufficient liquidity for TokenB");

        // Actualizar reservas.
        reserveA += amountAIn;
        reserveB -= amountBOut;

        emit TokensSwapped(
            msg.sender,
            address(tokenA),
            amountAIn,
            address(tokenB),
            amountBOut
        );

        // Transferir TokenA al contrato.
        tokenA.transferFrom(msg.sender, address(this), amountAIn);

        // Transferir TokenB al usuario.
        tokenB.transfer(msg.sender, amountBOut);
    }

    /// @notice Intercambiar TokenB por TokenA.
    /// @param amountBIn Cantidad de TokenB a intercambiar.
    function swapBforA(uint256 amountBIn) external {
        require(amountBIn > 0, "Amount must be greater than 0");

        uint256 amountAOut = getAmountOut(amountBIn, reserveB, reserveA);

        require(amountAOut > 0, "Insufficient output amount");
        require(reserveA >= amountAOut, "Insufficient liquidity for TokenA");

        // Actualizar reservas.
        reserveB += amountBIn;
        reserveA -= amountAOut;

        emit TokensSwapped(
            msg.sender,
            address(tokenB),
            amountBIn,
            address(tokenA),
            amountAOut
        );

        // Transferir TokenB al contrato.
        tokenB.transferFrom(msg.sender, address(this), amountBIn);

        // Transferir TokenA al usuario.
        tokenA.transfer(msg.sender, amountAOut);
    }

    /// @notice Retirar liquidez del pool.
    /// @param amountA Cantidad de TokenA a retirar.
    /// @param amountB Cantidad de TokenB a retirar.
    function removeLiquidity(
        uint256 amountA,
        uint256 amountB
    ) external onlyOwner {
        require(
            amountA <= reserveA && amountB <= reserveB,
            "Not enough liquidity"
        );

        // Actualizar reservas.
        reserveA -= amountA;
        reserveB -= amountB;

        emit LiquidityRemoved(msg.sender, amountA, amountB);

        // Transferir tokens al owner.
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);
    }

    /// @notice Obtener el precio de intercambio de un token.
    /// @param _token Dirección del token para el cual se quiere el precio.
    /// @return El precio basado en las reservas del pool.
    function getPrice(address _token) external view returns (uint256) {
        if (_token == address(tokenA)) {
            return (reserveB * 1e18) / reserveA; // Precio de TokenA en términos de TokenB.
        } else if (_token == address(tokenB)) {
            return (reserveA * 1e18) / reserveB; // Precio de TokenB en términos de TokenA.
        } else {
            revert("Invalid token address");
        }
    }

    /// @dev Calcular la cantidad de salida usando la fórmula del producto constante.
    /// @param amountIn Cantidad de token de entrada.
    /// @param reserveIn Reservas del token de entrada.
    /// @param reserveOut Reservas del token de salida.
    /// @return amountOut Cantidad de token de salida.
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256) {
        require(reserveIn > 0 && reserveOut > 0, "Insufficient liquidity");
        uint256 amountInWithFee = amountIn * 997; // Se aplica un fee del 0.3%.
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * 1000) + amountInWithFee;
        return numerator / denominator;
    }
}
