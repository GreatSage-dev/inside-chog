/**
 * Inside Chog: The Asymmetric On-Chain Vault Heist Protocol on Monad
 * Core Type Definitions
 */

export interface ChogTraits {
  background: string;
  fur?: string;
  eyes: string;
  mouth: string;
  head: string;
  clothes?: string;
}

export interface ChogNFT {
  tokenId: number | string;
  name: string;
  ownerAddress: string;
  traits: ChogTraits;
}

export type HazardType =
  | 'LASER_BEAM'          // Eyes: Laser Eyes
  | 'SWINGING_ANCHOR'     // Head: Pirate Hat
  | 'ROYAL_SENTRY'        // Head: Crown
  | 'POISON_SLIME'        // Background: Toxic Slime
  | 'ELECTRIC_BARRIER'    // Mouth: Gold Teeth
  | 'BOUNCE_TRAMPOLINE'   // Mouth: Tongue Out
  | 'ROTATING_SAW';       // Default kinetic hazard

export interface Hazard {
  id: string;
  type: HazardType;
  x: number;
  y: number;
  width: number;
  height: number;
  cycleDurationMs: number;
  damage: number;
  orientation: 'HORIZONTAL' | 'VERTICAL' | 'CIRCULAR';
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  isBouncy?: boolean;
}

export interface DungeonLayout {
  chogId: string | number;
  seedHash: string;
  theme: string;
  gridWidth: number;
  gridHeight: number;
  spawnPoint: { x: number; y: number };
  vaultPoint: { x: number; y: number };
  vaultLootAmount: number;
  hazards: Hazard[];
  platforms: Platform[];
  isClearChecked: boolean;
  shortestPathSteps: number;
  parTimeSeconds: number;
}

export interface RaidReceipt {
  receiptId: string;
  chogId: string | number;
  raiderAddress: string;
  timestamp: string;
  durationMs: number;
  success: boolean;
  stars: number;
  lootClaimed: number;
  replayHash: string;
  monadStateProof: string;
}
