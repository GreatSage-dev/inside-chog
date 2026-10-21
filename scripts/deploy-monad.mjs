import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const envPath = path.join(rootDir, ".env");

if (!fs.existsSync(envPath)) {
  console.error("Missing .env. Run node scripts/generate-wallet.mjs first.");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const matchKey = envContent.match(/MONAD_DEPLOYER_PRIVATE_KEY=(0x[a-fA-F0-9]{64})/);
const privateKey = matchKey ? matchKey[1] : null;

if (!privateKey) {
  console.error("Missing MONAD_DEPLOYER_PRIVATE_KEY in .env");
  process.exit(1);
}

const rpcUrl = "https://testnet-rpc.monad.xyz";
const provider = new ethers.JsonRpcProvider(
  rpcUrl,
  { chainId: 10143, name: "monad-testnet" },
  { staticNetwork: true }
);
const wallet = new ethers.Wallet(privateKey, provider);

console.log("=================================================");
console.log("  INSIDE CHOG · MONAD TESTNET CONTRACT DEPLOYER  ");
console.log("=================================================");
console.log(`Deployer Address: ${wallet.address}`);

async function deploy() {
  const balanceWei = await provider.getBalance(wallet.address);
  const balanceMon = ethers.formatEther(balanceWei);
  console.log(`Current Balance:  ${balanceMon} MON`);

  if (balanceWei === 0n) {
    console.error("\n[ERROR] Deployer wallet has 0.0 MON!");
    console.error(`Please fund this address with testnet MON: ${wallet.address}`);
    console.error("Official Faucet: https://faucet.monad.xyz");
    process.exit(1);
  }

  const artifactPath = path.join(rootDir, "contracts", "InsideChogVault.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  console.log("\nBroadcasting deployment transaction to Monad Testnet (10143)...");
  const contract = await factory.deploy();
  console.log(`Deploy Tx Hash:   ${contract.deploymentTransaction().hash}`);
  console.log("Waiting for block finality...");

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("\n=================================================");
  console.log("  CONTRACT DEPLOYED SUCCESSFULLY ON MONAD TESTNET! ");
  console.log("=================================================");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Explorer Link:    https://testnet.monadexplorer.com/address/${contractAddress}`);

  console.log("\nSeeding initial Chog #402 Cartridge on-chain with 0.1 MON pool...");
  try {
    const txSeed = await contract.registerCartridge(
      402,
      "Chog #402 · Arcade Striker",
      "chog1.jpg",
      "0x9f4a8b12c402a7bbcb391e0892c90fa1b88e10c71a39f04128f6a91c0e3e81b0",
      0,
      wallet.address,
      { value: ethers.parseEther("0.1") }
    );
    await txSeed.wait();
    console.log(`Chog #402 registered on-chain! Tx: ${txSeed.hash}`);
  } catch (seedErr) {
    console.warn("Seeding note:", seedErr.message);
  }

  const deployedInfo = {
    network: "Monad Testnet",
    chainId: 10143,
    contractAddress: contractAddress,
    deployer: wallet.address,
    txHash: contract.deploymentTransaction().hash,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.join(rootDir, "contracts", "deployed.json"), JSON.stringify(deployedInfo, null, 2), "utf-8");
  console.log("Deployment info written to contracts/deployed.json");
}

deploy().catch(err => {
  console.error("\nDeployment failed:", err);
  process.exit(1);
});
