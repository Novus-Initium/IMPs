//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

error AccessDenied();
error NotFound();
error AlreadyRevoked();
error Irrevocable();


// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";
// Events: a way to emit log statements from smart contract that can be listened to by external parties
// Constructor: Called once on contract deployment
// Check packages/hardhat/deploy/00_deploy_your_contract.ts

contract Attesting {
    uint256 constant EMPTY_UID = 0;
    uint64 constant NO_EXPIRATION_TIME = 0;
	address public immutable owner;

    /// @notice Emitted when an attestation has been made.
    /// @param recipient The recipient of the attestation.
    /// @param attester The attesting account.
    /// @param uid The UID the revoked attestation.

    event Attested(address indexed attester, string indexed recipient, uint256 uid);

    /// @notice Emitted when an attestation has been revoked.
    /// @param recipient The recipient of the attestation.
    /// @param attester The attesting account.
    /// @param uid The UID the revoked attestation.
    event Revoked(string indexed recipient, address indexed attester, uint256 uid);

    struct Attestation {
        uint256 uid; // A unique identifier of the attestation.
        uint256 time; // The time when the attestation was created (Unix timestamp).
        uint256 revocationTime; // The time when the attestation was revoked (Unix timestamp).
        string recipient; // The recipient of the attestation.
        address attester; // The attester/sender of the attestation.
        bool revocable; // Whether the attestation is revocable.
        string data; // Custom attestation data.
        uint256 rating; // Rating of the attestation (1-5 stars)
    }

    // The global mapping between attestations and their UIDs.
    uint256 private lastUid = 1;

    // mapping(uint256 uid => Attestation attestation) private _db;
    mapping(uint256 => Attestation) private _db;

    /// @dev Creates a new SolAttest instance.
    constructor(address _owner) {
	owner = _owner;
	}

    /// @notice Attests to a specific schema.
    /// @param recipient The recipient of the attestation.
    /// @param revocable Whether the attestation is revocable.
    /// @param data The custom attestation data.
    /// @return The UID of the new attestation.
    function attest(string memory recipient, bool revocable, string calldata data, uint256 rating) external returns (uint256) {
        uint256 _uid = lastUid++;
        Attestation memory _attestation;

        _attestation.uid = _uid;
        _attestation.attester = msg.sender;
        _attestation.recipient = recipient;
        _attestation.rating = rating;
        _attestation.data = data;
        _attestation.time = block.timestamp;
        _attestation.revocable = revocable;

        _db[_uid] = _attestation;

        emit Attested(msg.sender, recipient, _uid);

        return _uid;
    }

        // Function to attest with token backing, sending tokens to a specified address
    function attestWithToken(
        string memory recipient, 
        bool revocable, 
        string calldata data, 
        address tokenAddress, 
        uint256 tokenAmount, 
        address payable destinationAddress // Address to send the tokens to
    ) external returns (uint256) {
        // Token transfer logic
        require(
            IERC20(tokenAddress).transferFrom(msg.sender, destinationAddress, tokenAmount), 
            "Token transfer failed"
        );

        // Attestation logic
        uint256 _uid = lastUid++;
        Attestation memory _attestation;

        _attestation.uid = _uid;
        _attestation.attester = msg.sender;
        _attestation.recipient = recipient;
        _attestation.data = data;
        _attestation.time = block.timestamp;
        _attestation.revocable = revocable;

        _db[_uid] = _attestation;

        emit Attested(msg.sender, recipient, _uid);

        return _uid;
    }


    function revoke(uint256 uid) external {
        Attestation storage attestation = _db[uid];

        if (attestation.uid == 0) {
            revert NotFound();
        }

        if (attestation.attester != msg.sender) {
            revert AccessDenied();
        }

        if (attestation.revocationTime != 0) {
            revert AlreadyRevoked();
        }

        if (!attestation.revocable) {
            revert Irrevocable();
        }

        attestation.revocationTime = block.timestamp;
    }

    /// @notice Returns an existing attestation by UID.
    /// @param uid The UID of the attestation to retrieve.
    /// @return The attestation data members.
    function getAttestation(uint256 uid) external view returns (Attestation memory) {
        if (uid > lastUid) {
            revert NotFound();
        }
        return _db[uid];
    }

    function attestationsByRecipient(string memory recipient) external view returns (Attestation[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < lastUid; i++) {
            if (keccak256(abi.encodePacked(_db[i].recipient)) == keccak256(abi.encodePacked(recipient))) {
                count++;
            }
        }

        Attestation[] memory result = new Attestation[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < lastUid; i++) {
            if (keccak256(abi.encodePacked(_db[i].recipient)) == keccak256(abi.encodePacked(recipient))) {
                result[index] = _db[i];
                index++;
            }
        }

        return result;
    }

    function attestationsByAttester(address attester) external view returns (Attestation[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < lastUid; i++) {
            if (_db[i].attester == attester) {
                count++;
            }
        }

        Attestation[] memory result = new Attestation[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < lastUid; i++) {
            if (_db[i].attester == attester) {
                result[index] = _db[i];
                index++;
            }
        }

        return result;
    }
    

}
