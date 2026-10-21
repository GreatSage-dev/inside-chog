/**
 * Inside Chog: The Asymmetric On-Chain Vault Heist Protocol on Monad
 * The Deterministic Trait-to-Dungeon Compiler
 *
 * Maps Chog NFT visual metadata into playable, fair, single-screen arcade vaults.
 * Guaranteed 100% deterministic: Same Chog Token ID = Identical dungeon layout.
 */
import { ChogNFT, DungeonLayout } from './types.js';
export declare function compileChogToDungeon(chog: ChogNFT): DungeonLayout;
