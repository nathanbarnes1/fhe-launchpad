import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { ConfidentialTokenFactory, ConfidentialTokenFactory__factory, LaunchpadConfidentialToken } from "../types";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

describe("ConfidentialTokenFactory", function () {
  let signers: Signers;
  let factory: ConfidentialTokenFactory;

  before(async function () {
    const ethSigners = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn("This test suite requires the local fhEVM mock environment");
      this.skip();
    }

    const factoryFactory = (await ethers.getContractFactory(
      "ConfidentialTokenFactory",
    )) as ConfidentialTokenFactory__factory;
    factory = await factoryFactory.deploy();
  });

  it("creates confidential tokens with metadata", async function () {
    const tx = await factory.connect(signers.alice).createConfidentialToken("Ocean Dollar", "OCD");
    await tx.wait();

    const count = await factory.getTokenCount();
    expect(count).to.equal(1n);

    const info = await factory.getTokenInfo(0);
    expect(info.creator).to.equal(signers.alice.address);

    const tokenAddresses = await factory.getAllTokens();
    expect(tokenAddresses.length).to.equal(1);
    expect(tokenAddresses[0]).to.equal(info.token);

    const aliceTokens = await factory.getTokensByCreator(signers.alice.address);
    expect(aliceTokens.length).to.equal(1);
    expect(aliceTokens[0]).to.equal(info.token);

    const records = await factory.getTokenRecords();
    expect(records.length).to.equal(1);
    expect(records[0].token).to.equal(info.token);
    expect(records[0].creator).to.equal(signers.alice.address);
  });

  it("mints free tokens that can be decrypted", async function () {
    const createTx = await factory
      .connect(signers.alice)
      .createConfidentialToken("Nebula Credit", "NBL");
    const receipt = await createTx.wait();

    expect(receipt?.status).to.equal(1);

    const tokenAddress = (await factory.getAllTokens())[0];
    const token = (await ethers.getContractAt(
      "LaunchpadConfidentialToken",
      tokenAddress,
    )) as LaunchpadConfidentialToken;

    const mintTx = await token.connect(signers.alice).freemint();
    await mintTx.wait();

    const encryptedBalance = await token.confidentialBalanceOf(signers.alice.address);
    expect(encryptedBalance).to.not.equal(ethers.ZeroHash);

    const decryptedBalance = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedBalance,
      tokenAddress,
      signers.alice,
    );

    const freeAmount = await token.freemintAmount();
    expect(decryptedBalance).to.equal(BigInt(freeAmount));

  });
});
