import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SimpleDEX", () => {
  async function deploySimpleDEXFixture() {
    const [owner, trader] = await ethers.getSigners();

    // Deploy tokenA and tokenB
    const TokenA = await ethers.getContractFactory("TokenA");
    const TokenB = await ethers.getContractFactory("TokenB");

    const tokenA = await TokenA.deploy();
    const tokenB = await TokenB.deploy();

    // Deploy SimpleDEX
    const SimpleDEX = await ethers.getContractFactory("SimpleDEX");
    const dex = await SimpleDEX.deploy(
      tokenA.getAddress(),
      tokenB.getAddress()
    );

    // Approve DEX to spend tokens for the owner
    await tokenA
      .connect(owner)
      .approve(dex.getAddress(), ethers.parseEther("10000"));
    await tokenB
      .connect(owner)
      .approve(dex.getAddress(), ethers.parseEther("10000"));

    return { dex, tokenA, tokenB, owner, trader };
  }

  describe("addLiquidity", () => {
    it("Should add liquidity and update reserves", async () => {
      const { dex, tokenA, tokenB, owner } = await loadFixture(
        deploySimpleDEXFixture
      );

      const amountA = ethers.parseEther("100");
      const amountB = ethers.parseEther("200");

      await expect(dex.addLiquidity(amountA, amountB))
        .to.emit(dex, "LiquidityAdded")
        .withArgs(owner.address, amountA, amountB);

      const reserveA = await dex.reserveA();
      const reserveB = await dex.reserveB();

      expect(reserveA).to.equal(amountA);
      expect(reserveB).to.equal(amountB);
    });

    it("Should revert if amounts are zero", async () => {
      const { dex } = await loadFixture(deploySimpleDEXFixture);

      await expect(dex.addLiquidity(0, 0)).to.be.revertedWith(
        "Amounts must be greater than 0"
      );
    });
  });

  describe("swapAforB", () => {
    it("Should swap TokenA for TokenB", async () => {
      const { dex, tokenA, tokenB, owner, trader } = await loadFixture(
        deploySimpleDEXFixture
      );

      // Add liquidity
      const amountA = ethers.parseEther("100");
      const amountB = ethers.parseEther("200");
      await dex.addLiquidity(amountA, amountB);

      // Approve dex for trader
      const swapAmountA = ethers.parseEther("10");
      await tokenA.connect(trader).approve(dex.getAddress(), swapAmountA);

      // Transfer TokenA to trader
      await tokenA.transfer(trader.address, swapAmountA);

      // Calcular el precio esperado con la fórmula del contrato
      const reserveA = await dex.reserveA();
      const reserveB = await dex.reserveB();
      const amountInWithFee = swapAmountA * BigInt(997);
      const numerator = amountInWithFee * reserveB;
      const denominator = reserveA * BigInt(1000) + amountInWithFee;
      const expectedAmountB = numerator / denominator;

      await expect(dex.connect(trader).swapAforB(swapAmountA))
        .to.emit(dex, "TokensSwapped")
        .withArgs(
          trader.address,
          tokenA.getAddress(),
          swapAmountA,
          tokenB.getAddress(),
          expectedAmountB
        );

      // Verify balances
      expect(await tokenB.balanceOf(trader.address)).to.equal(expectedAmountB);
      expect(await tokenA.balanceOf(dex.getAddress())).to.equal(
        amountA + swapAmountA
      );
      expect(await tokenB.balanceOf(dex.getAddress())).to.equal(
        amountB - expectedAmountB
      );
    });

    it("Should revert if swap amount is zero", async () => {
      const { dex } = await loadFixture(deploySimpleDEXFixture);

      await expect(dex.swapAforB(0)).to.be.revertedWith(
        "Amount must be greater than 0"
      );
    });

    it("Should revert if output amount is insufficient", async () => {
      const { dex } = await loadFixture(deploySimpleDEXFixture);

      const amountA = 1;
      const amountB = 1;

      await dex.addLiquidity(amountA, amountB);

      const invalidSwapAmountA = ethers.parseEther("1000"); // Too high for liquidity

      await expect(dex.swapAforB(invalidSwapAmountA)).to.be.revertedWith(
        "Insufficient output amount"
      );
    });
  });

  describe("swapBforA", () => {
    it("Should swap TokenB for TokenA", async () => {
      const { dex, tokenA, tokenB, owner, trader } = await loadFixture(
        deploySimpleDEXFixture
      );

      // Add liquidity
      const amountA = ethers.parseEther("100");
      const amountB = ethers.parseEther("200");
      await dex.addLiquidity(amountA, amountB);

      // Approve dex for trader
      const swapAmountB = ethers.parseEther("10");
      await tokenB.connect(trader).approve(dex.getAddress(), swapAmountB);

      // Transfer TokenB to trader
      await tokenB.transfer(trader.address, swapAmountB);

      // Calcular el precio esperado con la fórmula del contrato
      const reserveA = await dex.reserveA();
      const reserveB = await dex.reserveB();
      const amountInWithFee = swapAmountB * BigInt(997);
      const numerator = amountInWithFee * reserveA;
      const denominator = reserveB * BigInt(1000) + amountInWithFee;
      const expectedAmountA = numerator / denominator;

      await expect(dex.connect(trader).swapBforA(swapAmountB))
        .to.emit(dex, "TokensSwapped")
        .withArgs(
          trader.address,
          tokenB.getAddress(),
          swapAmountB,
          tokenA.getAddress(),
          expectedAmountA
        );

      // Verify balances
      expect(await tokenA.balanceOf(trader.address)).to.equal(expectedAmountA);
      expect(await tokenB.balanceOf(dex.getAddress())).to.equal(
        amountB + swapAmountB
      );
      expect(await tokenA.balanceOf(dex.getAddress())).to.equal(
        amountA - expectedAmountA
      );
    });

    it("Should revert if swap amount is zero", async () => {
      const { dex } = await loadFixture(deploySimpleDEXFixture);

      await expect(dex.swapBforA(0)).to.be.revertedWith(
        "Amount must be greater than 0"
      );
    });

    it("Should revert if output amount is insufficient", async () => {
      const { dex } = await loadFixture(deploySimpleDEXFixture);

      const amountA = 1;
      const amountB = 1;

      await dex.addLiquidity(amountA, amountB);

      const invalidSwapAmountB = ethers.parseEther("1000"); // Too high for liquidity

      await expect(dex.swapBforA(invalidSwapAmountB)).to.be.revertedWith(
        "Insufficient output amount"
      );
    });
  });

  describe("removeLiquidity", () => {
    it("Should remove liquidity and update reserves", async () => {
      const { dex, tokenA, tokenB, owner } = await loadFixture(
        deploySimpleDEXFixture
      );

      const amountA = ethers.parseEther("100");
      const amountB = ethers.parseEther("200");

      await dex.addLiquidity(amountA, amountB);

      await expect(dex.removeLiquidity(amountA, amountB))
        .to.emit(dex, "LiquidityRemoved")
        .withArgs(owner.address, amountA, amountB);

      expect(await dex.reserveA()).to.equal(0);
      expect(await dex.reserveB()).to.equal(0);
    });

    it("Should revert if not enough liquidity", async () => {
      const { dex } = await loadFixture(deploySimpleDEXFixture);

      const amountA = ethers.parseEther("100");
      const amountB = ethers.parseEther("200");

      await dex.addLiquidity(amountA, amountB);

      const invalidAmountA = ethers.parseEther("200"); // Exceeds reserve
      const invalidAmountB = ethers.parseEther("400"); // Exceeds reserve

      await expect(
        dex.removeLiquidity(invalidAmountA, invalidAmountB)
      ).to.be.revertedWith("Not enough liquidity");
    });
  });

  describe("getPrice", () => {
    it("Should return correct price for TokenA and TokenB", async () => {
      const { dex, tokenA, tokenB } = await loadFixture(deploySimpleDEXFixture);

      const amountA = ethers.parseEther("100");
      const amountB = ethers.parseEther("200");

      await dex.addLiquidity(amountA, amountB);

      const priceA = await dex.getPrice(tokenA.getAddress());
      const priceB = await dex.getPrice(tokenB.getAddress());

      expect(priceA).to.equal((amountB * ethers.parseEther("1")) / amountA);
      expect(priceB).to.equal((amountA * ethers.parseEther("1")) / amountB);
    });
  });
});
