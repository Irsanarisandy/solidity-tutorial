import { expect } from "chai";
import { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";

describe("ZombieOwnership", () => {
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const ZombieOwnership = await ethers.getContractFactory("ZombieOwnership");
    const zombieContract = await ZombieOwnership.deploy();

    return { zombieContract, owner, otherAccount };
  }

  describe("ZombieFactory", () => {
    describe("createRandomZombie function", () => {
      it("Should emit 'NewZombie' event first time executed", async () => {
        const { zombieContract } = await loadFixture(deployFixture);

        await expect(zombieContract.createRandomZombie("test"))
          .to.emit(zombieContract, "NewZombie")
          .withArgs(0, "test", anyValue);
      });

      it("Should revert if executed more than once", async () => {
        const { zombieContract } = await loadFixture(deployFixture);

        await zombieContract.createRandomZombie("test");
        await expect(
          zombieContract.createRandomZombie("test")
        ).to.be.revertedWith("You already have 1 or more zombies!");
      });
    });
  });

  describe("ZombieHelper", () => {
    describe("getLevelUpFee function", () => {
      it("Should return levelUpFee value", async () => {
        const { zombieContract } = await loadFixture(deployFixture);

        expect(await zombieContract.getLevelUpFee()).to.equal(1000000000000000);
      });
    });
  });
});
