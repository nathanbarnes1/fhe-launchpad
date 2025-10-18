// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {ConfidentialFungibleToken} from "new-confidential-contracts/token/ConfidentialFungibleToken.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";

contract LaunchpadConfidentialToken is ConfidentialFungibleToken, SepoliaConfig {
    uint64 public constant FREE_MINT_BASE_UNITS = 10_000_000;
    address public immutable creator;

    event FreeMint(address indexed minter, euint64 amount);

    constructor(string memory tokenName, string memory tokenSymbol, address creatorAddress)
        ConfidentialFungibleToken(tokenName, tokenSymbol, "")
    {
        creator = creatorAddress;
    }

    function freemint() external {
        euint64 amount = FHE.asEuint64(FREE_MINT_BASE_UNITS);
        euint64 minted = _mint(msg.sender, amount);
        emit FreeMint(msg.sender, minted);
    }

    function freemintAmount() external pure returns (uint64) {
        return FREE_MINT_BASE_UNITS;
    }
}

contract ConfidentialTokenFactory is SepoliaConfig {
    struct TokenRecord {
        address token;
        address creator;
        uint256 createdAt;
    }

    TokenRecord[] private _tokens;
    mapping(address => uint256[]) private _creatorTokenIndexes;

    event TokenCreated(address indexed creator, address indexed token, string name, string symbol);

    function createConfidentialToken(string memory tokenName, string memory tokenSymbol) external returns (address) {
        require(bytes(tokenName).length > 0, "name required");
        require(bytes(tokenSymbol).length > 0, "symbol required");

        LaunchpadConfidentialToken token = new LaunchpadConfidentialToken(tokenName, tokenSymbol, msg.sender);
        address tokenAddress = address(token);

        _tokens.push(TokenRecord({token: tokenAddress, creator: msg.sender, createdAt: block.timestamp}));
        _creatorTokenIndexes[msg.sender].push(_tokens.length - 1);

        emit TokenCreated(msg.sender, tokenAddress, tokenName, tokenSymbol);

        return tokenAddress;
    }

    function getTokenCount() external view returns (uint256) {
        return _tokens.length;
    }

    function getTokenInfo(uint256 index)
        external
        view
        returns (address token, address creator, uint256 createdAt)
    {
        require(index < _tokens.length, "index out of range");
        TokenRecord storage record = _tokens[index];
        return (record.token, record.creator, record.createdAt);
    }

    function getTokenRecords() external view returns (TokenRecord[] memory records) {
        uint256 length = _tokens.length;
        records = new TokenRecord[](length);
        for (uint256 i = 0; i < length; i++) {
            records[i] = _tokens[i];
        }
    }

    function getAllTokens() external view returns (address[] memory tokens) {
        tokens = new address[](_tokens.length);
        for (uint256 i = 0; i < _tokens.length; i++) {
            tokens[i] = _tokens[i].token;
        }
    }

    function getTokensByCreator(address creator) external view returns (address[] memory tokens) {
        uint256[] storage indexes = _creatorTokenIndexes[creator];
        tokens = new address[](indexes.length);
        for (uint256 i = 0; i < indexes.length; i++) {
            tokens[i] = _tokens[indexes[i]].token;
        }
    }
}
