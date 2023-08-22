// Packages
import * as fs from "fs";
import * as path from "path";
import { ethers, network } from "hardhat";

// Functions
import { log, verify } from "../../helper-functions";

// Data
import {
  developmentChains,
  INITIAL_SUPPLY,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../../helper-hardhat-config";

// Types
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MultisigWallet, MultisigWallet__factory } from "../../typechain-types";

/**
 * Type of the deployed contract that will be stored in deployed-contracts.json file
 *
 * example:
 *  {
 *    "hardhat": {
 *      "contractName": "contractAddress"
 *    }
 *  }
 */
type DeployedContracts = {
  [key: string]: {
    [key: string]: string;
  };
};

/**
 * Deploy SimpleStorage Contract
 *
 * @param chainId the Id of the network we will deploy on it
 * @returns the deployed contract
 */
async function deployOurToken(chainId: number) {
  const [deployer, owner1, owner2, owner3]: SignerWithAddress[] =
    await ethers.getSigners();

  const ownersAddresses: [string, string, string] = [
    owner1.address,
    owner2.address,
    owner3.address,
  ];

  if (developmentChains.includes(network.name)) {
    // Deploy MOCKS if existed
    // You will use chainId to get info of the chain from hardhat-helper-config file
  } else {
    // Do additional thing in case its not a testnet
  }

  // Deploying The Contract
  log(`Deploying contract with the account: ${deployer.address}`);
  const multisigWalletFactory: MultisigWallet__factory =
    await ethers.getContractFactory("MultisigWallet", deployer);
  log("Deploying Contract...");
  console.log(ownersAddresses);
  const multisigWallet: MultisigWallet = await multisigWalletFactory.deploy(
    ownersAddresses,
    2
  );
  await multisigWallet.deployed();

  log(`MultisigWaller deployed to: ${multisigWallet.address}`);
  log("", "separator");

  if (!developmentChains.includes(network.name)) {
    // Verify Contract if it isnt in a development chain
    log("Verifying Contract", "title");
    await multisigWallet.deployTransaction.wait(
      VERIFICATION_BLOCK_CONFIRMATIONS
    );
    await verify(multisigWallet.address, [INITIAL_SUPPLY]);
    log("verified successfully");
  }

  // Storing contract address to connect to it later
  log("Storing contract address", "title");
  const parentDir: string = path.resolve(__dirname, "../../");
  const deployedContractsPath: string = path.join(
    parentDir,
    "deployed-contracts.json"
  );
  const oldContracts: DeployedContracts = JSON.parse(
    fs.readFileSync(deployedContractsPath, "utf8")
  );

  // Add the contract to the network we are deploying on it
  oldContracts[network.name] = {
    MultisigWallet: multisigWallet.address,
  };

  // Save data in our deployed-contracts file
  fs.writeFileSync(
    deployedContractsPath,
    JSON.stringify(oldContracts, null, 2)
  );
  log("Stored Succesfully");
  log("", "separator");
  return multisigWallet;
}

export default deployOurToken;
