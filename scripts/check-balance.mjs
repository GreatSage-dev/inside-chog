import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, "..", ".env");

if (!fs.existsSync(envPath)) {
  console.error("No .env found. Run generate-wallet first.");
  process.exit(1);
}

const content = fs.readFileSync(envPath, "utf-8");
const matchAddr = content.match(/MONAD_DEPLOYER_ADDRESS=(0x[a-fA-F0-9]{40})/);
const address = matchAddr ? matchAddr[1] : null;

if (!address) {
  console.error("No MONAD_DEPLOYER_ADDRESS in .env");
  process.exit(1);
}

const rpcUrl = "https://testnet-rpc.monad.xyz";
const provider = new ethers.JsonRpcProvider(rpcUrl);

async function check() {
  try {
    const balWei = await provider.getBalance(address);
    const balMon = ethers.formatEther(balWei);
    console.log(`WALLET: ${address}`);
    console.log(`BALANCE: ${balMon} MON`);
  } catch (err) {
    console.error("RPC Error:", err.message);
  }
}

check();
