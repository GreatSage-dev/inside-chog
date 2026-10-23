import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const envContent = fs.readFileSync(path.join(rootDir, ".env"), "utf-8");
const privateKey = envContent.match(/MONAD_DEPLOYER_PRIVATE_KEY=(0x[a-fA-F0-9]{64})/)[1];
const deployed = JSON.parse(fs.readFileSync(path.join(rootDir, "contracts", "deployed.json"), "utf-8"));
const artifact = JSON.parse(fs.readFileSync(path.join(rootDir, "contracts", "InsideChogVault.json"), "utf-8"));

const provider = new ethers.JsonRpcProvider(
  "https://testnet-rpc.monad.xyz",
  { chainId: 10143, name: "monad-testnet" },
  { staticNetwork: true }
);
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(deployed.contractAddress, artifact.abi, wallet);

const CARTRIDGES_TO_SEED = [
  { id: 8812, name: "Chog #8812 · Laser Overcharge", img: "chognice.jpg", engine: 1, pool: "0.1" },
  { id: 1049, name: "Chog #1049 · Bull Stampede", img: "chog5.jpg", engine: 0, pool: "0.1" },
  { id: 7731, name: "Chog #7731 · Parachute Drift", img: "chog6.jpg", engine: 2, pool: "0.1" },
  { id: 1,    name: "Chog #0001 · Genesis Badge", img: "chogbadge.jpg", engine: 1, pool: "0.15" },
  { id: 9999, name: "Chog #9999 · Mirror Revenge", img: "chogwow.jpg", engine: 0, pool: "0.1" }
];

async function run() {
  console.log("Checking contract:", deployed.contractAddress);
  const countBefore = await contract.getCartridgeCount();
  console.log("Cartridges registered before:", countBefore.toString());

  for (const c of CARTRIDGES_TO_SEED) {
    try {
      const existing = await contract.cartridges(c.id);
      if (existing && existing.exists) {
        console.log(`Cartridge #${c.id} already registered.`);
        continue;
      }
      const romHash = ethers.id(`MONAD_CHOG_ROM_${c.id}`);
      console.log(`Registering Chog #${c.id} (${c.name})...`);
      const tx = await contract.registerCartridge(
        c.id,
        c.name,
        c.img,
        romHash,
        c.engine,
        wallet.address,
        { value: ethers.parseEther(c.pool) }
      );
      await tx.wait();
      console.log(`  -> Registered #${c.id}! Tx: ${tx.hash}`);
    } catch (e) {
      console.warn(`  -> Skip #${c.id}:`, e.shortMessage || e.message);
    }
  }

  console.log("Executing live raidVault(402) with 0.05 MON toll...");
  const raidTx = await contract.raidVault(402, { value: ethers.parseEther("0.05") });
  await raidTx.wait();
  console.log("  -> raidVault(402) confirmed! Tx:", raidTx.hash);

  console.log("Executing live hypeVault(8812) with 0.05 MON sponsor tip...");
  const hypeTx = await contract.hypeVault(8812, { value: ethers.parseEther("0.05") });
  await hypeTx.wait();
  console.log("  -> hypeVault(8812) confirmed! Tx:", hypeTx.hash);

  const countAfter = await contract.getCartridgeCount();
  const c402 = await contract.getCartridge(402);
  const balAfter = await provider.getBalance(wallet.address);
  console.log("Cartridges registered after:", countAfter.toString());
  console.log("Chog #402 on-chain jackpot:", ethers.formatEther(c402.jackpot), "MON | totalRaids:", c402.totalRaids.toString());
  console.log("Deployer balance remaining:", ethers.formatEther(balAfter), "MON");
}

run().catch(console.error);
