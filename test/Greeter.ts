import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";

describe("WrappedETH", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const WrappedETH = await ethers.getContractFactory("WrappedETH");
    const weth = await WrappedETH.deploy();

    return { weth, owner, otherAccount };
  }

  async function deployAndDepositFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const WrappedETH = await ethers.getContractFactory("WrappedETH");
    const weth = await WrappedETH.deploy();
    await weth.deposit({ value: "1000000000000" });

    return { weth, owner, otherAccount };
  }

  describe("WETH", function () {
    it("Deposit", async function () {
      const { weth, owner, otherAccount } = await loadFixture(deployFixture);

      const depositValue = ethers.utils.parseEther("1");
      await expect(weth.deposit({ value: depositValue }))
        .to.emit(weth, "Deposit")
        .withArgs(owner.address, depositValue);

      expect(await weth.balanceOf(owner.address)).to.equal(depositValue);
    });

    it("Withdraw", async function () {
      const { weth, owner, otherAccount } = await loadFixture(
        deployAndDepositFixture
      );

      const initialBalance = await owner.getBalance();
      expect(await weth.balanceOf(owner.address)).to.equal("1000000000000");
      let tx = undefined;
      await expect((tx = weth.withdraw("1000000000000")))
        .to.emit(weth, "Withdraw")
        .withArgs(owner.address, "1000000000000");
      tx = await tx;
      if (tx) {
        const { gasUsed } = await tx.wait();
        expect(await weth.balanceOf(owner.address)).to.equal(0);

        if (tx.gasPrice) {
          const gasInEth = tx.gasPrice?.mul(gasUsed);
          expect(await owner.getBalance()).to.equal(
            initialBalance.sub(gasInEth).add("1000000000000")
          );
        } else assert(false, "Unable to estimate gas price");
      } else assert(false);
    });
  });

  describe("ERC20", function () {
    describe("Transfer", function () {
      it("transfer from owner to otherAccount", async function () {
        const { weth, owner, otherAccount } = await loadFixture(
          deployAndDepositFixture
        );

        expect(await weth.balanceOf(owner.address)).to.equal("1000000000000");

        await weth.transfer(otherAccount.address, 10000);
        expect(await weth.balanceOf(otherAccount.address)).to.equal(10000);
        expect(await weth.balanceOf(owner.address)).to.not.equal(
          "1000000000000"
        );
      });

      it("transfer from otherAccount to owner", async function () {
        const { weth, owner, otherAccount } = await loadFixture(
          deployAndDepositFixture
        );
        await weth.connect(otherAccount).deposit({ value: 10000 });

        expect(await weth.balanceOf(otherAccount.address)).to.equal(10000);

        await weth.connect(otherAccount).transfer(owner.address, 10000);
        expect(await weth.balanceOf(otherAccount.address)).to.equal(0);
        expect(await weth.balanceOf(owner.address)).to.equal("1000000010000");
      });
    });

    describe("TransferFrom", function () {
      it("transferFrom from owner to otherAccount", async function () {
        const { weth, owner, otherAccount } = await loadFixture(
          deployAndDepositFixture
        );

        expect(await weth.balanceOf(owner.address)).to.equal("1000000000000");

        await weth.approve(otherAccount.address, 10000);
        expect(
          await weth.allowance(owner.address, otherAccount.address)
        ).to.equal(10000);

        await weth
          .connect(otherAccount)
          .transferFrom(owner.address, otherAccount.address, 10000);
        expect(await weth.balanceOf(otherAccount.address)).to.equal(10000);
        expect(
          await weth.allowance(owner.address, otherAccount.address)
        ).to.equal(0);
        expect(await weth.balanceOf(owner.address)).to.not.equal(
          "1000000000000"
        );
      });
    });

    describe("Metadata", function () {
      it("symbol", async function () {
        const { weth, owner, otherAccount } = await loadFixture(deployFixture);

        expect(await weth.symbol()).to.equal("WETH");
      });

      it("name", async function () {
        const { weth, owner, otherAccount } = await loadFixture(deployFixture);

        expect(await weth.name()).to.eql("Wrapped ETH");
      });

      it("decimals", async function () {
        const { weth, owner, otherAccount } = await loadFixture(deployFixture);

        expect(await weth.decimals()).to.eql(18);
      });

      it("total supply", async function () {
        const { weth, owner, otherAccount } = await loadFixture(
          deployAndDepositFixture
        );

        expect(await weth.totalSupply()).to.equal("1000000000000");
      });
    });
  });
});
