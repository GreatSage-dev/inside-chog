import solc from "solc";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const contractPath = path.join(rootDir, "contracts", "InsideChogVault.sol");
const source = fs.readFileSync(contractPath, "utf-8");

const input = {
  language: "Solidity",
  sources: {
    "InsideChogVault.sol": {
      content: source
    }
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"]
      }
    },
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};

console.log("Compiling InsideChogVault.sol with Solidity 0.8.20...");
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  let hasError = false;
  output.errors.forEach(err => {
    if (err.severity === "error") {
      console.error(err.formattedMessage);
      hasError = true;
    } else {
      console.warn(err.formattedMessage);
    }
  });
  if (hasError) {
    process.exit(1);
  }
}

const contract = output.contracts["InsideChogVault.sol"]["InsideChogVault"];
const artifact = {
  contractName: "InsideChogVault",
  abi: contract.abi,
  bytecode: contract.evm.bytecode.object
};

const artifactPath = path.join(rootDir, "contracts", "InsideChogVault.json");
fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2), "utf-8");

console.log("COMPILED_SUCCESSFULLY!");
console.log(`Bytecode length: ${artifact.bytecode.length} chars`);
console.log(`Artifact saved to: ${artifactPath}`);
