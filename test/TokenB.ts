import { expect } from "chai";
import hre from "hardhat";

describe("TokenB", () => {
  let TokenB: any;
  let token: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async () => {
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    TokenB = await hre.ethers.getContractFactory("TokenB");
    token = await TokenB.deploy();
  });

  describe("Deployment", () => {
    it("Should have the correct name and symbol", async () => {
      expect(await token.name()).to.equal("TokenB");
      expect(await token.symbol()).to.equal("TKB");
    });

    it("Should mint the initial supply to the owner", async () => {
      const ownerBalance = await token.balanceOf(owner.address);
      const initialSupply = hre.ethers.parseUnits(
        "1000000",
        await token.decimals()
      );
      expect(ownerBalance).to.equal(initialSupply);
    });
  });

  describe("Transactions", () => {
    it("Should transfer tokens between accounts", async () => {
      const amount = hre.ethers.parseUnits("100", await token.decimals());

      await token.transfer(addr1.address, amount);

      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(amount);

      const ownerBalance = await token.balanceOf(owner.address);
      expect(ownerBalance).to.equal(
        hre.ethers.parseUnits("1000000", await token.decimals()) - amount
      );
    });

    it("Should fail if sender doesn't have enough tokens", async () => {
      const amount = hre.ethers.parseUnits("1000000", await token.decimals());

      await expect(
        token.connect(addr1).transfer(owner.address, amount)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });
  });

  describe("Approval and allowance", () => {
    it("Should approve tokens for spending by another account", async () => {
      const amount = hre.ethers.parseUnits("100", await token.decimals());

      await token.approve(addr1.address, amount);

      const allowance = await token.allowance(owner.address, addr1.address);
      expect(allowance).to.equal(amount);
    });

    it("Should allow a spender to transfer tokens from the owner's account", async () => {
      const amount = hre.ethers.parseUnits("100", await token.decimals());

      await token.approve(addr1.address, amount);

      await token
        .connect(addr1)
        .transferFrom(owner.address, addr2.address, amount);

      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(amount);

      const ownerBalance = await token.balanceOf(owner.address);
      expect(ownerBalance).to.equal(
        hre.ethers.parseUnits("1000000", await token.decimals()) - amount
      );
    });

    it("Should fail if spender doesn't have enough allowance", async () => {
      const amount = hre.ethers.parseUnits("100", await token.decimals());

      await expect(
        token.connect(addr2).transferFrom(owner.address, addr1.address, amount)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
    });
  });
});
