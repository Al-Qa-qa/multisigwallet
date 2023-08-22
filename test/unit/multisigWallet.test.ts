import { expect, assert } from "chai";
import { ethers, network } from "hardhat";
import { MultisigWallet, MultisigWallet__factory } from "../../typechain-types";

// Function
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

// Data
import { developmentChains } from "../../helper-hardhat-config";

// Types
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

// ------------

describe("MultisigWallet", function () {
  const REQUIRED: BigNumber = ethers.utils.parseUnits("2");
  beforeEach(async () => {
    if (!developmentChains.includes(network.name)) {
      throw new Error(
        "You need to be on a development chain to run unit tests"
      );
    }
  });

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  type DeployFixture = {
    notOwner: SignerWithAddress;
    multisigWallet: MultisigWallet;
    owners: SignerWithAddress[];
  };
  async function deployMultisigWalletFixture(): Promise<DeployFixture> {
    const [notOwner, owner1, owner2, owner3]: SignerWithAddress[] =
      await ethers.getSigners();

    const multisigWalletFactory: MultisigWallet__factory =
      await ethers.getContractFactory("MultisigWallet", notOwner);
    const multisigWallet: MultisigWallet = await multisigWalletFactory.deploy(
      [owner1.address, owner2.address, owner3.address],
      2
    );
    await multisigWallet.deployed();
    return { notOwner, multisigWallet, owners: [owner1, owner2, owner3] };
  }

  /**
   * Sumbit a tx before testing for approval, since we will need a tx to be sumbitted in our test
   *
   * @returns same values in deployFixutes
   */
  async function submitTx(): Promise<DeployFixture> {
    const { notOwner, multisigWallet, owners } = await loadFixture(
      deployMultisigWalletFixture
    );
    await multisigWallet
      .connect(owners[0])
      .submit(ethers.constants.AddressZero, ethers.utils.parseEther("2"), []);
    return { notOwner, multisigWallet, owners };
  }

  /**
   * Sumbit a tx, approve it by two owners, to be ready to be executed
   *
   * @returns same values in deployFixutes
   */
  async function submitAndApproveTx(): Promise<DeployFixture> {
    const { notOwner, multisigWallet, owners } = await loadFixture(
      deployMultisigWalletFixture
    );

    // Funding the wallet with 2 ETH
    await owners[0].sendTransaction({
      to: multisigWallet.address,
      value: ethers.utils.parseEther("2"),
    });

    // Submit a transaction
    await multisigWallet
      .connect(owners[0])
      .submit(notOwner.address, ethers.utils.parseEther("2"), []);

    // Approve the tx my 2 addresses
    await multisigWallet.connect(owners[0]).approve(0);
    await multisigWallet.connect(owners[1]).approve(0);

    return { notOwner, multisigWallet, owners };
  }

  describe("Constructor", function () {
    it("should set add owners to `owners` array", async () => {
      const { multisigWallet, owners } = await loadFixture(
        deployMultisigWalletFixture
      );
      const owners1: string = await multisigWallet.owners(0);
      const owners2: string = await multisigWallet.owners(1);
      const owners3: string = await multisigWallet.owners(2);

      assert.equal(owners1, owners[0].address);
      assert.equal(owners2, owners[1].address);
      assert.equal(owners3, owners[2].address);
    });

    it("should add the owners to `isOwner` mapping", async () => {
      const { multisigWallet, owners } = await loadFixture(
        deployMultisigWalletFixture
      );

      const checkOwner1: boolean = await multisigWallet.isOwner(
        owners[0].address
      );
      const checkOwner2: boolean = await multisigWallet.isOwner(
        owners[1].address
      );
      const checkOwner3: boolean = await multisigWallet.isOwner(
        owners[2].address
      );

      const allChecks = checkOwner1 && checkOwner2 && checkOwner3;

      assert(allChecks);
    });

    it("should set `required` variable to 2", async () => {
      const { multisigWallet } = await loadFixture(deployMultisigWalletFixture);

      const required: BigNumber = await multisigWallet.required();

      expect(REQUIRED.eq(required));
    });

    it("reverts if no owners passed", async () => {
      const [notOwner, owner1, owner2, owner3]: SignerWithAddress[] =
        await ethers.getSigners();

      const multisigWalletFactory: MultisigWallet__factory =
        await ethers.getContractFactory("MultisigWallet", notOwner);

      await expect(multisigWalletFactory.deploy([], 0)).to.revertedWith(
        /Owners required/
      );
    });

    it("reverts if required param is greater than owners length", async () => {
      const [notOwner, owner1, owner2, owner3]: SignerWithAddress[] =
        await ethers.getSigners();

      const multisigWalletFactory: MultisigWallet__factory =
        await ethers.getContractFactory("MultisigWallet", notOwner);

      await expect(
        multisigWalletFactory.deploy(
          [owner1.address, owner2.address, owner3.address],
          4
        )
      ).to.revertedWith(/Invalid required number of owners/);
    });

    it("reverts if one of the `owners` is AddressZero", async () => {
      const [notOwner, owner1, owner2, owner3]: SignerWithAddress[] =
        await ethers.getSigners();

      const multisigWalletFactory: MultisigWallet__factory =
        await ethers.getContractFactory("MultisigWallet", notOwner);

      await expect(
        multisigWalletFactory.deploy(
          [owner1.address, owner2.address, ethers.constants.AddressZero],
          2
        )
      ).to.revertedWith(/Invalid owner/);
    });

    it("reverts if there is a duplicate owner address", async () => {
      const [notOwner, owner1, owner2, owner3]: SignerWithAddress[] =
        await ethers.getSigners();

      const multisigWalletFactory: MultisigWallet__factory =
        await ethers.getContractFactory("MultisigWallet", notOwner);

      await expect(
        multisigWalletFactory.deploy(
          [owner1.address, owner2.address, owner2.address],
          2
        )
      ).to.revertedWith(/owner is not unique/);
    });
  });

  describe("#submit", function () {
    it("should revert if not the owner is trying to access", async function () {
      const { notOwner, multisigWallet } = await loadFixture(
        deployMultisigWalletFixture
      );

      await expect(
        multisigWallet
          .connect(notOwner)
          .submit(
            ethers.constants.AddressZero,
            ethers.utils.parseEther("2"),
            []
          )
      ).to.rejectedWith(/You are not owner/);
    });

    it("should add new transaction object into `transactions` array", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        deployMultisigWalletFixture
      );

      await multisigWallet
        .connect(owners[0])
        .submit(ethers.constants.AddressZero, ethers.utils.parseEther("2"), []);

      const transaction = await multisigWallet.transactions(0);

      console.log(transaction);
      expect(transaction);
    });

    it("should emit `Submit` event", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        deployMultisigWalletFixture
      );

      await expect(
        multisigWallet
          .connect(owners[0])
          .submit(
            ethers.constants.AddressZero,
            ethers.utils.parseEther("2"),
            []
          )
      )
        .to.emit(multisigWallet, "Submit")
        .withArgs(0);
    });
  });

  describe("#approve", function () {
    it("should make emit `Approve` event if there is no errors", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(submitTx);

      await expect(multisigWallet.connect(owners[0]).approve(0))
        .to.emit(multisigWallet, "Approve")
        .withArgs(owners[0].address, 0);
    });

    it("should fail if not the owner is trying to access", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(submitTx);

      await expect(multisigWallet.connect(notOwner).approve(0)).to.revertedWith(
        /You are not owner/
      );
    });

    it("should fail if txId is not existed", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(submitTx);

      // We submitted only one tx so of id = 0, we will pass 1
      await expect(
        multisigWallet.connect(owners[0]).approve(1)
      ).to.revertedWith(/tx does not existed/);
    });

    it("should fail if the tx was approved", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(submitTx);

      // Approve the tx
      await multisigWallet.connect(owners[0]).approve(0);

      // trying to approve the tx again
      await expect(
        multisigWallet.connect(owners[0]).approve(0)
      ).to.revertedWith(/tx already approved/);
    });

    it("should fail if the tx was executed", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(submitTx);

      // Approve the transaction
      await multisigWallet.connect(owners[0]).approve(0);
      await multisigWallet.connect(owners[1]).approve(0);

      // Funding the wallet with 2 ETH (we added 2 ETH as value, so our multisig wallet should have at lease 2 ETH to send)
      await owners[0].sendTransaction({
        to: multisigWallet.address,
        value: ethers.utils.parseEther("2"),
      });

      // execute the transaction
      await multisigWallet.connect(owners[0]).execute(0);

      await expect(
        multisigWallet.connect(owners[2]).approve(0)
      ).to.revertedWith(/tx already executed/);
    });
  });

  describe("#execute", function () {
    it("should emit `Execute` event on successful execut", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        submitAndApproveTx
      );

      await expect(multisigWallet.connect(owners[0]).execute(0))
        .to.emit(multisigWallet, "Execute")
        .withArgs(0);
    });

    it("should make execute field of the tx equal to true", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        submitAndApproveTx
      );

      await multisigWallet.connect(owners[0]).execute(0);

      const transaction = await multisigWallet
        .connect(owners[1])
        .transactions(0);

      expect(transaction.executed);
    });

    it("should increases the value of the receiver address by 2 ETH", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        submitAndApproveTx
      );

      const receiverBalanceBefore: BigNumber = await ethers.provider.getBalance(
        notOwner.address
      );

      // execute the transaction
      await multisigWallet.connect(owners[0]).execute(0);

      // Balance should increase by 2 ETH
      const receiverBalanceAfter: BigNumber = await ethers.provider.getBalance(
        notOwner.address
      );

      expect(
        receiverBalanceAfter.eq(receiverBalanceBefore.add(BigNumber.from(2)))
      );
    });

    it("reverts if the transaction is not existed", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        submitAndApproveTx
      );

      await expect(
        multisigWallet.connect(owners[0]).execute(1)
      ).to.revertedWith(/tx does not existed/);
    });

    it("reverts if the transaction was already existed", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        submitAndApproveTx
      );

      const transaction = await multisigWallet.transactions(0);
      await multisigWallet.connect(owners[0]).execute(0);
      await expect(
        multisigWallet.connect(owners[0]).execute(0)
      ).to.revertedWith(/tx already executed/);
    });

    it("reverts if the number of approvals is less than required", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        deployMultisigWalletFixture
      );

      await multisigWallet
        .connect(owners[0])
        .submit(notOwner.address, BigNumber.from(1), []);

      await multisigWallet.connect(owners[0]).approve(0);

      await expect(
        multisigWallet.connect(owners[0]).execute(0)
      ).to.revertedWith(/approvals < required/);
    });

    it("reverts if there is not enough balance in our wallet", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        submitAndApproveTx
      );

      // execute the transaction
      await multisigWallet.connect(owners[0]).execute(0);

      // Now our wallet has no ETH
      // We will submit another tx and it should fail because there is no ETH
      await multisigWallet
        .connect(owners[0])
        .submit(notOwner.address, BigNumber.from(1), []);
      await multisigWallet.connect(owners[0]).approve(1);
      await multisigWallet.connect(owners[1]).approve(1);

      await expect(multisigWallet.execute(1)).to.be.revertedWith(
        /Transaction failed/
      );
    });
  });

  describe("#revoke", function () {
    it("should emit `Revoke` event on successful revoke", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        submitAndApproveTx
      );

      await expect(multisigWallet.connect(owners[0]).revoke(0))
        .to.emit(multisigWallet, "Revoke")
        .withArgs(owners[0].address, 0);
    });

    it("should emit set approved mapping of this `txId` and `address` to `false`", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        submitAndApproveTx
      );

      const approvedPrev: boolean = await multisigWallet.approved(
        0,
        owners[0].address
      ); // approved[0][address]

      await multisigWallet.connect(owners[0]).revoke(0);

      const approved: boolean = await multisigWallet.approved(
        0,
        owners[0].address
      ); // approved[0][address]

      // Check that is was approved then its changed to be not approved
      assert.equal(approvedPrev, !approved);
    });

    it("reverts if not the owner is trying to access", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        submitAndApproveTx
      );

      await expect(multisigWallet.connect(notOwner).revoke(0)).to.revertedWith(
        /You are not owner/
      );
    });

    it("reverts if the transaction is not existed", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        submitAndApproveTx
      );

      await expect(multisigWallet.connect(owners[0]).revoke(1)).to.revertedWith(
        /tx does not existed/
      );
    });

    it("reverts if the transaction was already executed", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        submitAndApproveTx
      );
      await multisigWallet.connect(owners[0]).execute(0);
      await expect(multisigWallet.connect(owners[0]).revoke(0)).to.revertedWith(
        /tx already executed/
      );
    });

    it("reverts if not approved owner is trying to revoke", async function () {
      const { notOwner, multisigWallet, owners } = await loadFixture(
        submitAndApproveTx
      );

      // NOTE: owner[0] and owner[1] just approved the tx and not owner[2]
      await expect(multisigWallet.connect(owners[2]).revoke(0)).to.revertedWith(
        /tx not approved/
      );
    });
  });

  describe("#Additions", function () {
    it("should emit `Deposite` event when the multisig wallet receives ETH", async function () {
      const { notOwner, multisigWallet } = await loadFixture(
        deployMultisigWalletFixture
      );

      const value: BigNumber = BigNumber.from(1);

      await expect(
        notOwner.sendTransaction({ to: multisigWallet.address, value })
      )
        .to.emit(multisigWallet, "Deposit")
        .withArgs(notOwner.address, value);
    });
  });
});
