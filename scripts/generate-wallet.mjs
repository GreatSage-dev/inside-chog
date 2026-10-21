import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, "..", ".env");

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  const matchAddr = content.match(/MONAD_DEPLOYER_ADDRESS=(0x[a-fA-F0-9]{40})/);
  if (matchAddr) {
    console.log("EXISTING_WALLET_FOUND");
    console.log("ADDRESS:", matchAddr[1]);
    process.exit(0);
  }
}

const wallet = ethers.Wallet.createRandom();

const envContent = `# Monad Testnet Dedicated Deployer Key (Auto-generated)
MONAD_DEPLOYER_ADDRESS=${wallet.address}
MONAD_DEPLOYER_PRIVATE_KEY=${wallet.privateKey}
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
MONAD_CHAIN_ID=10143
`;

fs.writeFileSync(envPath, envContent, "utf-8");
console.log("NEW_WALLET_GENERATED");
console.log("ADDRESS:", wallet.address);
