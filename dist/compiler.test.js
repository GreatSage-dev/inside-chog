import { describe, it } from 'node:test';
import assert from 'node:assert';
import { compileChogToDungeon } from './compiler.js';
describe('Inside Chog: Trait-to-Dungeon Compiler Tests', () => {
    // Test 1: Zero-Variance Determinism
    it('should compile identical layouts and seed hashes for the same Chog NFT', () => {
        const chog1 = {
            tokenId: 1,
            name: 'Chog #1 (Pirate Laser)',
            ownerAddress: '0x1111111111111111111111111111111111111111',
            traits: {
                background: 'Toxic Slime',
                eyes: 'Laser Eyes',
                mouth: 'Smirk',
                head: 'Pirate Hat'
            }
        };
        const runA = compileChogToDungeon(chog1);
        const runB = compileChogToDungeon(chog1);
        assert.strictEqual(runA.seedHash, runB.seedHash);
        assert.strictEqual(runA.theme, 'TOXIC_SEWER');
        assert.strictEqual(runA.hazards.length, runB.hazards.length);
        assert.strictEqual(runA.vaultLootAmount, runB.vaultLootAmount);
        assert.deepStrictEqual(runA.spawnPoint, runB.spawnPoint);
    });
    // Test 2: Trait Sensitivity & Dynamic Hazard Generation
    it('should generate distinctly different dungeon hazards based on NFT traits', () => {
        const chogLaserPirate = {
            tokenId: 101,
            name: 'Laser Pirate Chog',
            ownerAddress: '0x2222222222222222222222222222222222222222',
            traits: {
                background: 'Toxic Slime',
                eyes: 'Laser Eyes',
                mouth: 'Default',
                head: 'Pirate Hat'
            }
        };
        const chogRoyalGold = {
            tokenId: 202,
            name: 'Royal Gold Chog',
            ownerAddress: '0x3333333333333333333333333333333333333333',
            traits: {
                background: 'Cyber Void',
                eyes: 'VR Goggles',
                mouth: 'Gold Teeth',
                head: 'Crown'
            }
        };
        const dungeonA = compileChogToDungeon(chogLaserPirate);
        const dungeonB = compileChogToDungeon(chogRoyalGold);
        // Assert different seeds
        assert.notStrictEqual(dungeonA.seedHash, dungeonB.seedHash);
        // Dungeon A should have Laser Beams and Pirate Anchor
        assert.ok(dungeonA.hazards.some(h => h.type === 'LASER_BEAM'));
        assert.ok(dungeonA.hazards.some(h => h.type === 'SWINGING_ANCHOR'));
        assert.ok(dungeonA.hazards.some(h => h.type === 'POISON_SLIME'));
        // Dungeon B should have Royal Sentry and Electric Barrier
        assert.ok(dungeonB.hazards.some(h => h.type === 'ROYAL_SENTRY'));
        assert.ok(dungeonB.hazards.some(h => h.type === 'ELECTRIC_BARRIER'));
        // Dungeon B has Gold Teeth (2x bounty)
        assert.strictEqual(dungeonB.vaultLootAmount, 200);
        assert.strictEqual(dungeonA.vaultLootAmount, 100);
    });
    // Test 3: The Ablation / Kill Switch Mandate
    it('should REJECT compilation with ERR_EMPTY_CARTRIDGE if no Chog NFT is passed', () => {
        assert.throws(() => {
            compileChogToDungeon(null);
        }, /ERR_EMPTY_CARTRIDGE/);
        assert.throws(() => {
            compileChogToDungeon({});
        }, /ERR_EMPTY_CARTRIDGE/);
    });
    // Test 4: Clear-Check Beatability Proof (ZeptoLab Invariant)
    it('should verify that all compiled dungeons satisfy clear-check traversability', () => {
        const chog = {
            tokenId: 777,
            name: 'Speedy Chog',
            ownerAddress: '0x4444444444444444444444444444444444444444',
            traits: {
                background: 'Golden Treasury',
                eyes: 'Laser Eyes',
                mouth: 'Tongue Out',
                head: 'Crown'
            }
        };
        const dungeon = compileChogToDungeon(chog);
        assert.strictEqual(dungeon.isClearChecked, true);
        assert.ok(dungeon.shortestPathSteps > 0);
        assert.strictEqual(dungeon.parTimeSeconds, 30);
        assert.ok(dungeon.platforms.length >= 7);
    });
    // Test 5: Real Chog Fixture Verification
    it('should compile real Chog fixtures from inspected traits', () => {
        const realChog5 = {
            tokenId: 5,
            name: 'Chog #5',
            ownerAddress: '0x5555555555555555555555555555555555555555',
            traits: {
                background: 'Toxic Green Slime',
                eyes: 'Laser',
                mouth: 'Gold Teeth',
                head: 'Pirate Hat'
            }
        };
        const layout = compileChogToDungeon(realChog5);
        assert.strictEqual(layout.chogId, 5);
        assert.strictEqual(layout.vaultLootAmount, 200);
        assert.strictEqual(layout.seedHash.length, 64);
    });
});
//# sourceMappingURL=compiler.test.js.map