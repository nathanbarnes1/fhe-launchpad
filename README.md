# FHE Launchpad

**A Privacy-Preserving Token Launchpad Powered by Fully Homomorphic Encryption**

FHE Launchpad is a cutting-edge Web3 application that enables users to create, deploy, and manage confidential cryptocurrency tokens using Zama's Fully Homomorphic Encryption (FHE) protocol. With FHE Launchpad, token balances remain completely encrypted on-chain, ensuring maximum privacy while maintaining full blockchain transparency and security.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Why FHE Launchpad?](#why-fhe-launchpad)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Smart Contract Deployment](#smart-contract-deployment)
  - [Frontend Development](#frontend-development)
- [Usage Guide](#usage-guide)
- [Smart Contracts](#smart-contracts)
- [Frontend Application](#frontend-application)
- [Security Considerations](#security-considerations)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Overview

FHE Launchpad revolutionizes token creation by introducing **privacy-by-default** for cryptocurrency tokens. Unlike traditional ERC-20 tokens where all balances and transfers are publicly visible on-chain, FHE Launchpad tokens keep balances **encrypted** using Fully Homomorphic Encryption technology from Zama.

### What Problems Does FHE Launchpad Solve?

1. **Privacy Leakage in Traditional Tokens**: Standard ERC-20 tokens expose all account balances and transaction amounts publicly, allowing anyone to track wealth distribution and financial activity.

2. **Regulatory Compliance**: Organizations requiring financial privacy for compliance reasons can use confidential tokens while maintaining blockchain auditability.

3. **Competitive Advantage**: Businesses can hide strategic treasury movements and token allocations from competitors.

4. **User Privacy**: Individual users can protect their financial privacy without sacrificing the benefits of blockchain technology.

5. **Simplified Privacy Token Creation**: Developers can create privacy-preserving tokens without implementing complex zero-knowledge proof circuits or mixing protocols.

## Key Features

### For Users

- **One-Click Token Creation**: Deploy confidential fungible tokens with custom names and symbols in seconds
- **Encrypted Balances**: All token balances are encrypted using FHE and stored securely on-chain
- **Free Minting**: Each token includes a free mint function allowing users to mint 10,000,000 units privately
- **Secure Decryption**: View your encrypted balance using cryptographic key generation and EIP-712 signatures
- **Wallet Integration**: Seamless connection via RainbowKit supporting MetaMask, WalletConnect, and more
- **Token Discovery**: Browse and explore all tokens deployed on the launchpad
- **Creator Dashboard**: Track and manage tokens you've created

### For Developers

- **Factory Pattern**: Efficient token deployment using a factory contract architecture
- **Zama FHE Integration**: Built on top of Zama's battle-tested FHE protocol and libraries
- **Type-Safe Contracts**: Full TypeScript support with TypeChain-generated contract bindings
- **Modern Frontend Stack**: React 19, Vite, and wagmi for optimal developer experience
- **Comprehensive Testing**: Full test coverage with Hardhat and Chai
- **Deployment Automation**: Streamlined deployment scripts for local and testnet environments

## Why FHE Launchpad?

### Advantages Over Traditional Solutions

| Feature | FHE Launchpad | Traditional ERC-20 | Zero-Knowledge Tokens |
|---------|---------------|-------------------|----------------------|
| **Balance Privacy** | ✅ Encrypted on-chain | ❌ Publicly visible | ✅ Private |
| **Computational Efficiency** | ✅ No proof generation | ✅ Simple transfers | ❌ Heavy proof computation |
| **Implementation Complexity** | ✅ Simple (uses base contracts) | ✅ Standard | ❌ Complex (zk-SNARKs) |
| **On-chain Storage** | ✅ Encrypted values | ✅ Plain values | ✅ Commitments |
| **Gas Costs** | 🟡 Moderate | ✅ Low | ❌ High |
| **Decryption** | ✅ Owner only | N/A | ✅ Owner only |
| **Regulatory Compliance** | ✅ Auditable with keys | ❌ Fully public | 🟡 Depends on implementation |

### Technical Advantages

- **Homomorphic Operations**: Perform computations on encrypted data without decryption
- **No Trusted Setup**: Unlike zk-SNARKs, FHE requires no trusted setup ceremony
- **Composability**: Encrypted values can be used in complex smart contract logic
- **Future-Proof**: Built on cryptographic primitives designed for quantum resistance
- **Developer-Friendly**: Simple Solidity syntax similar to standard token development

## Technology Stack

### Smart Contract Layer

- **Solidity 0.8.27**: Latest Ethereum smart contract language with Cancun EVM features
- **Hardhat**: Industry-standard development environment for Ethereum
- **Zama FHE Libraries**:
  - `fhevm/solidity` (v0.8.0): Core FHE VM protocol
  - `fhevm/hardhat-plugin` (v0.1.0): Hardhat integration
  - `new-confidential-contracts` (v0.1.1): Base confidential contract classes
  - `zama-fhe/oracle-solidity` (v0.1.0): Oracle integration for encryption
  - `encrypted-types` (v0.0.4): Encrypted data type definitions
- **Ethers.js v6**: Ethereum wallet and contract interaction
- **TypeChain**: Automatic TypeScript bindings for contracts
- **Hardhat Deploy**: Declarative contract deployment framework

### Testing & Quality Assurance

- **Chai & Mocha**: Behavior-driven testing framework
- **Hardhat Chai Matchers**: Ethereum-specific test assertions
- **Solidity Coverage**: Comprehensive code coverage reporting
- **Solhint**: Linting and security best practices for Solidity
- **ESLint & Prettier**: Code formatting and quality enforcement

### Frontend Stack

- **React 19.1.1**: Latest React with concurrent features and automatic batching
- **TypeScript**: Full type safety across the application
- **Vite 7.1.6**: Lightning-fast build tool with HMR (Hot Module Replacement)
- **Web3 Integration**:
  - `wagmi` (v2.17.0): React hooks for Ethereum - used for contract reads
  - `viem` (v2.37.6): TypeScript Ethereum client - optimized reads
  - `ethers` (v6.15.0): Contract writes and transaction signing
  - `@rainbow-me/rainbowkit` (v2.2.8): Beautiful wallet connection UI
- **State Management**:
  - `@tanstack/react-query` (v5.89.0): Powerful data fetching and caching
  - React hooks for local state
- **Encryption SDK**:
  - `@zama-fhe/relayer-sdk` (v0.2.0): Client-side encryption/decryption operations
- **Styling**: Custom CSS with modern design patterns (no framework dependencies)

### Infrastructure & Tooling

- **Node.js**: Runtime environment (v20+)
- **npm**: Package management
- **Git**: Version control
- **Infura**: Ethereum RPC provider for Sepolia testnet
- **Etherscan**: Contract verification and blockchain explorer
- **WalletConnect**: Multi-wallet connection protocol

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│                     (React + RainbowKit)                     │
└────────────────┬────────────────────────────┬────────────────┘
                 │                            │
                 ▼                            ▼
        ┌─────────────────┐          ┌──────────────────┐
        │  Wallet Connect │          │  Zama Relayer    │
        │   (MetaMask)    │          │  SDK (Encrypt)   │
        └────────┬────────┘          └────────┬─────────┘
                 │                            │
                 ▼                            ▼
        ┌──────────────────────────────────────────────┐
        │           Ethereum Sepolia Testnet           │
        │                                              │
        │  ┌────────────────────────────────────────┐ │
        │  │  ConfidentialTokenFactory Contract     │ │
        │  │  - Creates tokens                       │ │
        │  │  - Tracks token registry                │ │
        │  └──────────┬─────────────────────────────┘ │
        │             │ Deploys                        │
        │             ▼                                │
        │  ┌────────────────────────────────────────┐ │
        │  │  LaunchpadConfidentialToken Instances  │ │
        │  │  - Encrypted balances (euint64)        │ │
        │  │  - Confidential transfers               │ │
        │  │  - Free minting                         │ │
        │  └────────────────────────────────────────┘ │
        └──────────────────────────────────────────────┘
```

### Smart Contract Architecture

```solidity
┌─────────────────────────────────────┐
│   ConfidentialTokenFactory          │
│   - Token creation factory          │
│   - Token registry                  │
│   - Metadata storage                │
└──────────┬──────────────────────────┘
           │
           │ Creates & Manages
           ▼
┌─────────────────────────────────────┐
│   LaunchpadConfidentialToken        │
│   (inherits from)                   │
│   ConfidentialFungibleToken (Zama)  │
│                                     │
│   State:                            │
│   - euint64 _balances (encrypted)   │
│   - address creator                 │
│   - uint256 freemintAmount          │
│                                     │
│   Functions:                        │
│   - freemint()                      │
│   - confidentialBalanceOf()         │
│   - confidentialTransfer()          │
└─────────────────────────────────────┘
```

### Frontend Component Architecture

```
App.tsx
  └─ LaunchpadApp.tsx (Main Container)
       ├─ Header.tsx (Branding & Title)
       └─ Tab Navigation
            ├─ CreateTokenForm.tsx
            │    └─ Token creation with validation
            ├─ TokenList.tsx (My Tokens - filtered)
            │    └─ TokenCard[] (User's tokens)
            └─ TokenList.tsx (Explore - all tokens)
                 └─ TokenCard[] (All tokens)
                      ├─ Freemint Button
                      └─ Decrypt Balance Button
```

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20 or higher ([Download](https://nodejs.org/))
- **npm**: Version 9+ (comes with Node.js)
- **Git**: For cloning the repository
- **MetaMask** or compatible Web3 wallet
- **Sepolia ETH**: For testnet deployment and transactions ([Faucet](https://sepoliafaucet.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/fhe-launchpad.git
   cd fhe-launchpad
   ```

2. **Install root dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Environment Configuration

1. **Set up Hardhat environment variables**

   ```bash
   # Set your deployment private key (recommended)
   npx hardhat vars set PRIVATE_KEY
   # Enter your private key when prompted (without 0x prefix)

   # Set Infura API key for Sepolia access
   npx hardhat vars set INFURA_API_KEY
   # Get your key from https://infura.io

   # Optional: Set Etherscan API key for contract verification
   npx hardhat vars set ETHERSCAN_API_KEY
   # Get your key from https://etherscan.io/myapikey
   ```

2. **Configure frontend environment**

   Create `frontend/.env`:

   ```env
   # WalletConnect Project ID (get from https://cloud.walletconnect.com)
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here

   # Factory contract address (will be set after deployment)
   VITE_FACTORY_ADDRESS=0x...
   ```

### Smart Contract Deployment

1. **Compile contracts**

   ```bash
   npm run compile
   ```

2. **Run tests**

   ```bash
   npm run test
   ```

3. **Deploy to Sepolia testnet**

   ```bash
   npm run deploy:sepolia
   ```

   This will output the deployed ConfidentialTokenFactory address. Copy this address to `frontend/.env` as `VITE_FACTORY_ADDRESS`.

4. **Verify contract on Etherscan (optional)**

   ```bash
   npm run verify:sepolia
   ```

### Frontend Development

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Update contract configuration**

   The deployed factory address and ABI should be automatically available in `deployments/sepolia/ConfidentialTokenFactory.json`. The frontend is configured to read from this file.

3. **Start development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

4. **Build for production**

   ```bash
   npm run build
   ```

   Production files will be in `frontend/dist`

## Usage Guide

### Creating a Confidential Token

1. **Connect Wallet**: Click "Connect Wallet" and select your preferred wallet
2. **Navigate to Create Token Tab**: Click on the "Create Token" tab
3. **Enter Token Details**:
   - Token Name (e.g., "Privacy Coin")
   - Token Symbol (e.g., "PRIV")
4. **Deploy Token**: Click "Create Token" and confirm the transaction
5. **Wait for Confirmation**: The transaction will be submitted to Sepolia testnet
6. **View Your Token**: Once confirmed, your token appears in "My Tokens"

### Minting Tokens

1. **Find Token**: Navigate to "My Tokens" or "Explore Tokens"
2. **Click Freemint**: Each token allows minting 10,000,000 units
3. **Confirm Transaction**: Approve the transaction in your wallet
4. **Wait for Confirmation**: Tokens will be minted to your encrypted balance

### Viewing Encrypted Balance

1. **Locate Your Token**: Find a token where you hold a balance
2. **Click "Decrypt Balance"**: This initiates the decryption process
3. **Sign EIP-712 Message**: Approve the signature request in your wallet
4. **View Balance**: Your decrypted balance will be displayed on the card

The decryption process works as follows:
- A keypair is generated using Zama's FHE instance
- An EIP-712 signature request is created and signed by your wallet
- The signature proves ownership without revealing your private key
- Zama's relayer service decrypts the balance using the signature
- The plaintext balance is displayed only to you

### Exploring Tokens

1. **Navigate to "Explore Tokens"**: View all tokens on the launchpad
2. **Browse Token Cards**: See token metadata including:
   - Token name and symbol
   - Creator address
   - Deployment date
   - Free mint allowance
3. **Interact with Tokens**: Mint or check balances directly from the explore view

## Smart Contracts

### ConfidentialTokenFactory.sol

The factory contract manages the creation and registry of confidential tokens.

**Key Functions:**

- `createConfidentialToken(string memory name, string memory symbol) → address`
  - Creates a new confidential token with the specified name and symbol
  - Deploys a new LaunchpadConfidentialToken instance
  - Registers the token in the factory's registry
  - Emits a `TokenCreated` event
  - Returns the address of the newly created token

- `getTokenCount() → uint256`
  - Returns the total number of tokens created via the factory

- `getTokenInfo(uint256 index) → TokenInfo`
  - Retrieves complete metadata for a token by index
  - Returns: name, symbol, tokenAddress, creator, creationTime, freemintAmount

- `getAllTokens() → address[]`
  - Returns an array of all token addresses

- `getTokensByCreator(address creator) → address[]`
  - Filters and returns tokens created by a specific address

**Events:**

```solidity
event TokenCreated(
    address indexed tokenAddress,
    string name,
    string symbol,
    address indexed creator,
    uint256 creationTime
);
```

### LaunchpadConfidentialToken.sol

Each token instance inherits from Zama's `ConfidentialFungibleToken` and implements privacy-preserving features.

**Key Features:**

- **Encrypted Storage**: Balances stored as `euint64` (64-bit encrypted unsigned integers)
- **Homomorphic Operations**: Supports encrypted arithmetic operations
- **Access Control**: Only balance owners can decrypt their balances
- **Free Minting**: Initial token distribution mechanism

**Key Functions:**

- `freemint() → bool`
  - Mints `freemintAmount` (10,000,000) tokens to caller
  - Balance is encrypted using FHE
  - Can only be called once per address
  - Emits `FreeMint` event

- `confidentialBalanceOf(address account) → euint64`
  - Returns the encrypted balance of an account
  - Balance remains encrypted on-chain
  - Only the account owner can decrypt this value

- `confidentialTransfer(address to, euint64 amount) → bool`
  - Transfers encrypted tokens between addresses
  - Amount remains encrypted throughout the operation
  - Homomorphic subtraction/addition on encrypted balances

**Encryption Details:**

```solidity
// Balances are stored as encrypted 64-bit unsigned integers
mapping(address => euint64) private _balances;

// Minting creates an encrypted value
_balances[msg.sender] = TFHE.asEuint64(freemintAmount);

// Transfers use homomorphic operations
_balances[from] = TFHE.sub(_balances[from], amount);
_balances[to] = TFHE.add(_balances[to], amount);
```

## Frontend Application

### Core Components

#### LaunchpadApp.tsx

Main application container managing:
- Tab navigation state
- Token data fetching via React Query
- Contract interaction orchestration
- Wallet connection status

#### CreateTokenForm.tsx

Token creation interface with:
- Form validation
- Transaction state management
- Error handling
- Success feedback with Etherscan links

#### TokenList.tsx

Token display component supporting:
- Grid-based responsive layout
- Filtering (all tokens vs user's tokens)
- Token card rendering
- Empty state handling

#### TokenCard Component

Individual token display with:
- Metadata display (name, symbol, creator, date)
- Freemint button with transaction handling
- Decrypt balance functionality
- Loading states and error handling

### Custom Hooks

#### useZamaInstance.ts

Manages Zama FHE instance initialization:
- Creates FHE instance for encryption operations
- Handles instance initialization lifecycle
- Provides instance to child components

#### useEthersSigner.ts

Converts wagmi client to ethers signer:
- Bridges viem (wagmi) and ethers.js
- Enables contract writes using ethers
- Maintains wallet connection

### Web3 Integration

**Reading Contract Data (viem via wagmi):**
```typescript
const { data: tokenCount } = useReadContract({
  address: factoryAddress,
  abi: factoryABI,
  functionName: 'getTokenCount'
});
```

**Writing to Contracts (ethers):**
```typescript
const signer = useEthersSigner();
const contract = new ethers.Contract(address, abi, signer);
await contract.createConfidentialToken(name, symbol);
```

**Encryption/Decryption (Zama SDK):**
```typescript
// Generate encryption keypair
const { publicKey, privateKey } = fheInstance.generateKeypair();

// Create EIP-712 signature
const signature = await signer.signTypedData(domain, types, message);

// Decrypt balance
const decryptedBalance = await fheInstance.decrypt(
  tokenAddress,
  encryptedBalance,
  privateKey,
  signature
);
```

## Security Considerations

### Smart Contract Security

1. **Immutable Creator**: Token creator address is immutable after deployment
2. **Overflow Protection**: Solidity 0.8.27 has built-in overflow checks
3. **Access Control**: Only balance owners can decrypt their balances
4. **Factory Pattern**: Prevents unauthorized token creation
5. **Event Logging**: All critical operations emit events for transparency

### Frontend Security

1. **No Private Keys in Frontend**: All signing done via connected wallet
2. **EIP-712 Signatures**: Structured data signing for secure authorization
3. **Read-Only Instance**: Zama instance used only for decryption, not key storage
4. **HTTPS Required**: Wallet connections require secure context
5. **Input Validation**: All user inputs validated before contract interaction

### Encryption Security

1. **FHE Protocol**: Uses Zama's audited FHE implementation
2. **Threshold Encryption**: Decryption requires valid signature proof
3. **No Key Reuse**: Fresh keypairs generated for each decryption operation
4. **Signature Verification**: EIP-712 signatures verify wallet ownership
5. **Relayer Trust**: Zama relayer service handles decryption in trusted environment

### Best Practices

- Always verify contract addresses before interaction
- Never share private keys or seed phrases
- Verify transaction details before signing
- Use hardware wallets for production deployments
- Audit custom token logic before deployment

## Testing

### Smart Contract Tests

Located in `test/ConfidentialTokenFactory.ts`

**Test Coverage:**

- Token creation and deployment
- Token registry functionality
- Metadata storage and retrieval
- Free minting operations
- Balance encryption/decryption
- Event emission verification
- Edge cases and error conditions

**Running Tests:**

```bash
# Local network tests
npm run test

# Sepolia testnet tests
npm run test:sepolia

# Coverage report
npm run coverage
```

**Example Test:**

```typescript
describe("ConfidentialTokenFactory", function () {
  it("Should create a new confidential token", async function () {
    const tx = await factory.createConfidentialToken("Test", "TST");
    await tx.wait();

    const count = await factory.getTokenCount();
    expect(count).to.equal(1);

    const tokenInfo = await factory.getTokenInfo(0);
    expect(tokenInfo.name).to.equal("Test");
    expect(tokenInfo.symbol).to.equal("TST");
  });
});
```

### Frontend Testing

Currently manual testing via development server. Future plans include:

- Component testing with React Testing Library
- E2E testing with Playwright
- Web3 interaction mocking with wagmi test utilities

## Deployment

### Smart Contract Deployment

**Sepolia Testnet:**

```bash
# Deploy factory contract
npm run deploy:sepolia

# Output:
# ConfidentialTokenFactory deployed to: 0x123...
```

**Deployment Configuration:**

From `hardhat.config.ts`:
- Network: Sepolia (chainId: 11155111)
- RPC: Infura
- Gas: Automatic estimation
- Optimizer: Enabled (800 runs)
- Verification: Etherscan

**Deployed Contracts:**

Contracts are saved to `deployments/sepolia/`:
- `ConfidentialTokenFactory.json` - Factory address and ABI
- Individual token deployments (if tracked)

### Frontend Deployment

**Build for Production:**

```bash
cd frontend
npm run build
```

**Deployment Options:**

1. **Vercel** (Recommended):
   ```bash
   vercel --prod
   ```

2. **Netlify**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

3. **IPFS** (Decentralized):
   ```bash
   ipfs add -r dist
   ```

4. **Traditional Hosting**:
   - Upload `dist/` folder to any static host
   - Configure environment variables on hosting platform

**Environment Variables for Production:**

```env
VITE_FACTORY_ADDRESS=0x... (your deployed factory)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Project Structure

```
fhe-launchpad/
├── contracts/                          # Solidity smart contracts
│   └── ConfidentialTokenFactory.sol    # Factory and token contracts
│
├── deploy/                             # Hardhat deployment scripts
│   └── deploy.ts                       # Deployment logic
│
├── test/                               # Smart contract tests
│   └── ConfidentialTokenFactory.ts     # Test suite
│
├── tasks/                              # Custom Hardhat tasks
│   ├── accounts.ts                     # Account management
│   └── tokenFactory.ts                 # Factory interaction tasks
│
├── frontend/                           # React frontend application
│   ├── src/
│   │   ├── App.tsx                     # Root component
│   │   ├── main.tsx                    # Entry point
│   │   ├── index.css                   # Global styles
│   │   │
│   │   ├── components/                 # React components
│   │   │   ├── LaunchpadApp.tsx        # Main app container
│   │   │   ├── CreateTokenForm.tsx     # Token creation form
│   │   │   ├── TokenList.tsx           # Token grid display
│   │   │   └── Header.tsx              # App header
│   │   │
│   │   ├── styles/                     # Component styles
│   │   │   ├── LaunchpadApp.css
│   │   │   ├── CreateTokenForm.css
│   │   │   ├── TokenList.css
│   │   │   └── Header.css
│   │   │
│   │   ├── config/                     # Configuration
│   │   │   ├── wagmi.ts                # Web3 config
│   │   │   └── contracts.ts            # Contract ABIs
│   │   │
│   │   ├── hooks/                      # Custom React hooks
│   │   │   ├── useZamaInstance.ts      # FHE instance
│   │   │   └── useEthersSigner.ts      # Ethers integration
│   │   │
│   │   └── types/                      # TypeScript types
│   │       └── tokens.ts               # Token interfaces
│   │
│   ├── vite.config.ts                  # Vite configuration
│   ├── package.json                    # Frontend dependencies
│   └── tsconfig.json                   # TypeScript config
│
├── deployments/                        # Deployment artifacts
│   └── sepolia/                        # Sepolia deployments
│       └── ConfidentialTokenFactory.json
│
├── docs/                               # Documentation
│   ├── zama_llm.md                     # Zama contracts guide
│   └── zama_doc_relayer.md             # Zama relayer guide
│
├── hardhat.config.ts                   # Hardhat configuration
├── tsconfig.json                       # Root TypeScript config
├── package.json                        # Root dependencies
├── .env                                # Environment variables (gitignored)
├── .gitignore                          # Git ignore rules
├── .eslintrc.yml                       # ESLint configuration
├── .prettierrc.yml                     # Prettier configuration
├── LICENSE                             # BSD-3-Clause-Clear
└── README.md                           # This file
```

## Available Scripts

### Root Package (Smart Contracts)

| Script | Description |
|--------|-------------|
| `npm run clean` | Clean Hardhat artifacts and cache |
| `npm run compile` | Compile all Solidity contracts |
| `npm run test` | Run contract test suite |
| `npm run test:sepolia` | Run tests on Sepolia testnet |
| `npm run coverage` | Generate test coverage report |
| `npm run lint` | Run all linting (Solidity + TypeScript) |
| `npm run lint:sol` | Lint Solidity contracts only |
| `npm run deploy:localhost` | Deploy to local Hardhat node |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run verify:sepolia` | Verify contracts on Etherscan |

### Frontend Package

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server (port 5173) |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Lint TypeScript and React code |

## Roadmap

### Phase 1: Core Functionality (Current)
- ✅ Factory contract for token creation
- ✅ Confidential token implementation with FHE
- ✅ Free minting mechanism
- ✅ Balance decryption via Zama relayer
- ✅ React frontend with wallet connection
- ✅ Token browsing and filtering
- ✅ Sepolia testnet deployment

### Phase 2: Enhanced Features (Q2 2025)
- 🔲 **Confidential Transfers UI**: Frontend interface for encrypted transfers
- 🔲 **Token Allowances**: Implement encrypted approval mechanism
- 🔲 **Transfer History**: Event-based transaction history with decryption
- 🔲 **Token Metadata**: Add logos, descriptions, and social links
- 🔲 **Advanced Filtering**: Sort tokens by creation date, activity, TVL
- 🔲 **User Profiles**: Display creator information and portfolio

### Phase 3: DeFi Integration (Q3 2025)
- 🔲 **Confidential DEX**: Swap confidential tokens with privacy
- 🔲 **Liquidity Pools**: Create encrypted AMM pools
- 🔲 **Yield Farming**: Stake confidential tokens for rewards
- 🔲 **Lending Protocol**: Borrow/lend with encrypted collateral
- 🔲 **Price Oracles**: Integrate Chainlink for price feeds
- 🔲 **Governance**: DAO voting with encrypted token holdings

### Phase 4: Enterprise & Compliance (Q4 2025)
- 🔲 **Role-Based Decryption**: Auditors can view specific balances with permission
- 🔲 **Compliance Module**: Configurable regulatory integration
- 🔲 **Multi-signature Factory**: Require multiple approvals for token creation
- 🔲 **Emergency Pause**: Circuit breaker for security incidents
- 🔲 **Upgradeable Tokens**: Proxy pattern for token logic updates
- 🔲 **Mainnet Launch**: Deploy to Ethereum mainnet or L2s

### Phase 5: Cross-Chain & Scaling (2026)
- 🔲 **Layer 2 Integration**: Deploy on Optimism, Arbitrum, zkSync
- 🔲 **Cross-Chain Bridges**: Transfer confidential tokens across chains
- 🔲 **Batch Operations**: Mint/transfer multiple tokens in one transaction
- 🔲 **Gas Optimization**: Reduce deployment and interaction costs
- 🔲 **Mobile App**: Native iOS/Android app with WalletConnect
- 🔲 **SDK Release**: JavaScript/TypeScript SDK for developers

### Phase 6: Advanced Privacy (Future)
- 🔲 **Selective Disclosure**: Prove balance ranges without revealing exact amount
- 🔲 **Private Airdrops**: Distribute tokens to encrypted recipient lists
- 🔲 **Confidential Vesting**: Time-locked encrypted token releases
- 🔲 **Encrypted Staking**: Stake tokens while keeping amounts private
- 🔲 **Anonymous Voting**: Vote without revealing token holdings
- 🔲 **Compliance Proofs**: Generate zero-knowledge proofs for regulations

### Community & Ecosystem
- 🔲 **Developer Grants**: Fund projects building on FHE Launchpad
- 🔲 **Bug Bounty Program**: Reward security researchers
- 🔲 **Documentation Hub**: Comprehensive guides and tutorials
- 🔲 **Token Standard (ERC-20 FHE)**: Propose standardization of confidential tokens
- 🔲 **Partnerships**: Integrate with wallets, explorers, and DeFi protocols

## Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the coding standards
4. **Run tests**: Ensure all tests pass
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes in detail

### Coding Standards

- **Solidity**: Follow Solhint rules, use NatSpec comments
- **TypeScript**: Use ESLint and Prettier configurations
- **React**: Functional components with hooks, prop type definitions
- **Testing**: Maintain >80% test coverage
- **Documentation**: Update README and inline comments

### Areas for Contribution

- 🐛 **Bug Fixes**: Report and fix issues
- ✨ **New Features**: Implement roadmap items or propose new ones
- 📖 **Documentation**: Improve guides, add examples
- 🎨 **UI/UX**: Design improvements and accessibility
- 🧪 **Testing**: Add test cases and improve coverage
- 🌐 **Internationalization**: Translate UI to other languages
- 🔒 **Security**: Audit code and report vulnerabilities

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the best outcome for the community
- Report unacceptable behavior to the maintainers

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

Key points:
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No patent grant
- ⚠️ No liability or warranty

See the [LICENSE](LICENSE) file for complete details.

## Support

### Documentation & Resources

- **Zama FHE Documentation**: [docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **FHEVM Hardhat Guide**: [docs.zama.ai/protocol/solidity-guides](https://docs.zama.ai/protocol/solidity-guides)
- **Wagmi Documentation**: [wagmi.sh](https://wagmi.sh)
- **Vite Documentation**: [vitejs.dev](https://vitejs.dev)
- **Hardhat Documentation**: [hardhat.org](https://hardhat.org)

### Community & Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/fhe-launchpad/issues)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/yourusername/fhe-launchpad/discussions)
- **Zama Discord**: [Join the Zama community](https://discord.gg/zama)
- **Twitter**: [@YourHandle](https://twitter.com/yourhandle) - Follow for updates

### FAQ

**Q: Why are gas costs higher than standard ERC-20 tokens?**

A: FHE operations require additional computational overhead for encryption and homomorphic operations. However, costs are significantly lower than zero-knowledge proof systems.

**Q: Can I decrypt other users' balances?**

A: No. Each balance can only be decrypted by the account owner using their wallet signature. This ensures complete privacy.

**Q: Is FHE quantum-resistant?**

A: Zama's FHE implementation is designed with quantum-resistant cryptographic primitives, providing future-proof security.

**Q: Can I use this on Ethereum mainnet?**

A: Currently deployed on Sepolia testnet. Mainnet support is planned for Phase 4 of the roadmap after thorough security audits.

**Q: How do I get Sepolia ETH for testing?**

A: Use public faucets like [sepoliafaucet.com](https://sepoliafaucet.com/) or [infura.io/faucet](https://www.infura.io/faucet/sepolia).

**Q: Can I customize the free mint amount?**

A: Yes! Modify the `freemintAmount` in `LaunchpadConfidentialToken` constructor before deployment.

**Q: What wallets are supported?**

A: Any Ethereum wallet is supported through RainbowKit, including MetaMask, WalletConnect, Coinbase Wallet, Rainbow, and more.

---

**Built with ❤️ using Zama FHE Technology**

*Empowering financial privacy on the blockchain*
