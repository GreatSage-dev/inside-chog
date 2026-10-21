// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title InsideChogVault
 * @notice Inside Chog: Executable NFT Arcade Vault Protocol on Monad Testnet (10143)
 * @dev 40% of every challenger's raid toll routes immediately to the Chog NFT landlord,
 *      50% swells the vault bounty pool, and 10% burns.
 */
contract InsideChogVault {
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    uint256 public constant RAID_TOLL = 0.05 ether; // 0.05 MON

    struct VaultCartridge {
        uint256 tokenId;
        string name;
        string imageUri;
        bytes32 romHash;
        uint8 defaultEngine; // 0: Heist, 1: Wave, 2: Flappy
        address landlord;
        uint256 jackpot;
        uint256 totalRaids;
        uint256 totalDeaths;
        uint256 totalYieldPaid;
        bool exists;
    }

    mapping(uint256 => VaultCartridge) public cartridges;
    uint256[] public cartridgeIds;
    address public owner;

    event CartridgeCompiled(
        uint256 indexed tokenId,
        string name,
        bytes32 romHash,
        uint8 defaultEngine,
        address indexed landlord,
        uint256 initialJackpot
    );

    event RaidAttempt(
        uint256 indexed tokenId,
        address indexed raider,
        uint256 toll,
        uint256 landlordCut,
        uint256 newJackpot
    );

    event VaultHyped(
        uint256 indexed tokenId,
        address indexed sponsor,
        uint256 tipAmount,
        uint256 newJackpot
    );

    event JackpotClaimed(
        uint256 indexed tokenId,
        address indexed victor,
        uint256 payout
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerCartridge(
        uint256 tokenId,
        string calldata name,
        string calldata imageUri,
        bytes32 romHash,
        uint8 defaultEngine,
        address landlord
    ) external payable {
        require(!cartridges[tokenId].exists, "Cartridge already exists");
        require(landlord != address(0), "Invalid landlord");

        cartridges[tokenId] = VaultCartridge({
            tokenId: tokenId,
            name: name,
            imageUri: imageUri,
            romHash: romHash,
            defaultEngine: defaultEngine,
            landlord: landlord,
            jackpot: msg.value,
            totalRaids: 0,
            totalDeaths: 0,
            totalYieldPaid: 0,
            exists: true
        });

        cartridgeIds.push(tokenId);

        emit CartridgeCompiled(
            tokenId,
            name,
            romHash,
            defaultEngine,
            landlord,
            msg.value
        );
    }

    function raidVault(uint256 tokenId) external payable {
        VaultCartridge storage cart = cartridges[tokenId];
        require(cart.exists, "Cartridge not found");
        require(msg.value == RAID_TOLL, "Toll must be exactly 0.05 MON");

        cart.totalRaids++;

        // 40% Landlord cut: 0.02 MON
        uint256 landlordCut = (msg.value * 40) / 100;
        // 50% Bounty swell: 0.025 MON
        uint256 bountySwell = (msg.value * 50) / 100;
        // 10% Burn: 0.005 MON
        uint256 burnAmount = msg.value - landlordCut - bountySwell;

        cart.jackpot += bountySwell;
        cart.totalYieldPaid += landlordCut;

        // Payouts
        (bool sentLandlord, ) = cart.landlord.call{value: landlordCut}("");
        require(sentLandlord, "Landlord transfer failed");

        (bool sentBurn, ) = BURN_ADDRESS.call{value: burnAmount}("");
        require(sentBurn, "Burn transfer failed");

        emit RaidAttempt(tokenId, msg.sender, msg.value, landlordCut, cart.jackpot);
    }

    function hypeVault(uint256 tokenId) external payable {
        VaultCartridge storage cart = cartridges[tokenId];
        require(cart.exists, "Cartridge not found");
        require(msg.value > 0, "Tip must be > 0");

        cart.jackpot += msg.value;

        emit VaultHyped(tokenId, msg.sender, msg.value, cart.jackpot);
    }

    function recordRaidDeath(uint256 tokenId) external {
        VaultCartridge storage cart = cartridges[tokenId];
        require(cart.exists, "Cartridge not found");
        cart.totalDeaths++;
    }

    function claimJackpot(uint256 tokenId) external {
        VaultCartridge storage cart = cartridges[tokenId];
        require(cart.exists, "Cartridge not found");
        require(cart.jackpot > 0, "No jackpot to claim");

        uint256 payout = cart.jackpot;
        cart.jackpot = 0;

        (bool sentVictor, ) = msg.sender.call{value: payout}("");
        require(sentVictor, "Victor payout failed");

        emit JackpotClaimed(tokenId, msg.sender, payout);
    }

    function getCartridge(uint256 tokenId) external view returns (VaultCartridge memory) {
        require(cartridges[tokenId].exists, "Cartridge not found");
        return cartridges[tokenId];
    }

    function getCartridgeCount() external view returns (uint256) {
        return cartridgeIds.length;
    }

    receive() external payable {}
}
