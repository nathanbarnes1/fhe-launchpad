import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { Contract } from 'ethers';
import type { InterfaceAbi } from 'ethers';

import { Header } from './Header';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import {
  CONFIDENTIAL_TOKEN_FACTORY_ABI,
  CONFIDENTIAL_TOKEN_FACTORY_ADDRESS,
  LAUNCHPAD_CONFIDENTIAL_TOKEN_ABI,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_RPC_URL,
} from '../config/contracts';
import '../styles/LaunchpadApp.css';

type LaunchpadToken = {
  address: `0x${string}`;
  creator: `0x${string}`;
  createdAt: number;
  name: string;
  symbol: string;
  freemintAmount: bigint;
};

type CreateTokenInput = {
  name: string;
  symbol: string;
};

const TOKEN_DECIMALS = 6;

function formatTokenAmount(value: bigint, decimals = TOKEN_DECIMALS) {
  const base = 10n ** BigInt(decimals);
  const integerPart = value / base;
  const fractionalPart = value % base;

  if (fractionalPart === 0n) {
    return integerPart.toString();
  }

  const fractional = fractionalPart.toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${integerPart.toString()}.${fractional}`;
}

function normalizeQueryString(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function LaunchpadApp() {
  const { address } = useAccount();
  const signer = useEthersSigner({ chainId: SEPOLIA_CHAIN_ID });
  const queryClient = useQueryClient();
  const { instance, isLoading: zamaLoading, error: zamaError } = useZamaInstance();
  const [creationFeedback, setCreationFeedback] = useState<string | null>(null);

  const publicClient = useMemo(
    () =>
      createPublicClient({
        chain: sepolia,
        transport: http(SEPOLIA_RPC_URL),
      }),
    []
  );

  const tokensQuery = useQuery({
    queryKey: ['launchpad', 'tokens'],
    queryFn: async () => {
      const records = (await publicClient.readContract({
        address: CONFIDENTIAL_TOKEN_FACTORY_ADDRESS,
        abi: CONFIDENTIAL_TOKEN_FACTORY_ABI,
        functionName: 'getTokenRecords',
      })) as Array<{ token: `0x${string}`; creator: `0x${string}`; createdAt: bigint }>;

      if (!records.length) {
        return [] as LaunchpadToken[];
      }

      const metadataResults = await publicClient.multicall({
        allowFailure: true,
        contracts: records.flatMap((record) => [
          {
            address: record.token,
            abi: LAUNCHPAD_CONFIDENTIAL_TOKEN_ABI,
            functionName: 'name',
          } as const,
          {
            address: record.token,
            abi: LAUNCHPAD_CONFIDENTIAL_TOKEN_ABI,
            functionName: 'symbol',
          } as const,
          {
            address: record.token,
            abi: LAUNCHPAD_CONFIDENTIAL_TOKEN_ABI,
            functionName: 'freemintAmount',
          } as const,
        ]),
      });

      return records.map((record, index) => {
        const base = index * 3;
        const nameResult = metadataResults[base];
        const symbolResult = metadataResults[base + 1];
        const amountResult = metadataResults[base + 2];

        const name =
          nameResult && nameResult.status === 'success' && typeof nameResult.result === 'string'
            ? nameResult.result
            : 'Confidential Token';
        const symbol =
          symbolResult && symbolResult.status === 'success' && typeof symbolResult.result === 'string'
            ? symbolResult.result
            : 'CTK';
        let freemintAmount = 0n;
        if (amountResult && amountResult.status === 'success') {
          const raw = amountResult.result as bigint | number | string;
          freemintAmount = typeof raw === 'bigint' ? raw : BigInt(raw);
        }

        return {
          address: record.token,
          creator: record.creator,
          createdAt: Number(record.createdAt) * 1000,
          name,
          symbol,
          freemintAmount,
        } satisfies LaunchpadToken;
      });
    },
  });

  const createTokenMutation = useMutation({
    onMutate: () => {
      setCreationFeedback(null);
    },
    mutationFn: async ({ name, symbol }: CreateTokenInput) => {
      const trimmedName = normalizeQueryString(name);
      const trimmedSymbol = normalizeQueryString(symbol).toUpperCase();

      if (!trimmedName || !trimmedSymbol) {
        throw new Error('Token name and symbol are required');
      }

      const resolvedSigner = await signer;
      if (!resolvedSigner) {
        throw new Error('Connect your wallet on Sepolia to create a token');
      }

      const contract = new Contract(
        CONFIDENTIAL_TOKEN_FACTORY_ADDRESS,
        CONFIDENTIAL_TOKEN_FACTORY_ABI as InterfaceAbi,
        resolvedSigner
      );

      const tx = await contract.createConfidentialToken(trimmedName, trimmedSymbol);
      const receipt = await tx.wait();
      return { receipt, name: trimmedName, symbol: trimmedSymbol };
    },
    onSuccess: (result) => {
      setCreationFeedback(
        `Created confidential token ${result.name} (${result.symbol}). Transaction hash: ${result.receipt.hash}`
      );
      queryClient.invalidateQueries({ queryKey: ['launchpad', 'tokens'] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown error while creating token';
      setCreationFeedback(`Failed to create token: ${message}`);
    },
  });

  const handleFreeMint = async (tokenAddress: `0x${string}`) => {
    const resolvedSigner = await signer;
    if (!resolvedSigner) {
      throw new Error('Connect your wallet to mint tokens');
    }

    const contract = new Contract(
      tokenAddress,
      LAUNCHPAD_CONFIDENTIAL_TOKEN_ABI as InterfaceAbi,
      resolvedSigner
    );

    const tx = await contract.freemint();
    const receipt = await tx.wait();
    return receipt.hash as string;
  };

  const handleDecryptBalance = async (tokenAddress: `0x${string}`) => {
    if (!address) {
      throw new Error('Connect your wallet to check balance');
    }

    if (!instance) {
      throw new Error('Encryption service is not ready yet');
    }

    const encryptedBalance = (await publicClient.readContract({
      address: tokenAddress,
      abi: LAUNCHPAD_CONFIDENTIAL_TOKEN_ABI,
      functionName: 'confidentialBalanceOf',
      args: [address],
    })) as `0x${string}`;

    const keypair = instance.generateKeypair();
    const startTimeStamp = Math.floor(Date.now() / 1000).toString();
    const durationDays = '10';
    const contractAddresses = [tokenAddress];

    const eip712 = instance.createEIP712(
      keypair.publicKey,
      contractAddresses,
      startTimeStamp,
      durationDays
    );

    const resolvedSigner = await signer;
    if (!resolvedSigner) {
      throw new Error('Wallet signer unavailable');
    }

    const signature = await resolvedSigner.signTypedData(
      eip712.domain,
      {
        UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
      },
      eip712.message
    );

    const decryption = await instance.userDecrypt(
      [
        {
          handle: encryptedBalance,
          contractAddress: tokenAddress,
        },
      ],
      keypair.privateKey,
      keypair.publicKey,
      signature.replace('0x', ''),
      contractAddresses,
      address,
      startTimeStamp,
      durationDays
    );

    const rawAmount = decryption[encryptedBalance] ?? '0';
    let numericAmount = 0n;
    try {
      numericAmount = BigInt(rawAmount);
    } catch (error) {
      console.error('Failed to parse decrypted amount', error);
    }

    return formatTokenAmount(numericAmount);
  };

  return (
    <div className="launchpad-app">
      <Header />

      <main className="launchpad-main">
        {zamaError && <p className="status-error">Encryption service error: {zamaError}</p>}
        <section className="launchpad-section">
          <h2 className="section-title">Create a Confidential Token</h2>
          <p className="section-description">
            Deploy a confidential fungible token with a name and symbol. Each deployed token inherits Zama&apos;s
            fhEVM privacy guarantees and includes a built-in free mint function for community distribution.
          </p>

          <TokenCreationForm
            isSubmitting={createTokenMutation.isPending}
            onSubmit={(values) => createTokenMutation.mutateAsync(values)}
            feedback={creationFeedback}
          />
        </section>

        <section className="launchpad-section">
          <h2 className="section-title">Launched Tokens</h2>
          <p className="section-description">
            Browse every confidential token deployed through this launchpad. Connect your wallet to free mint tokens
            and decrypt your private balance using the Zama relayer.
          </p>

          {tokensQuery.isPending && <p className="status-message">Loading deployed tokens…</p>}
          {tokensQuery.isError && (
            <p className="status-error">Failed to load tokens. Please refresh and try again.</p>
          )}
          {!tokensQuery.isPending && !tokensQuery.isError && tokensQuery.data?.length === 0 && (
            <p className="status-message">No tokens deployed yet. Be the first to launch one!</p>
          )}

          <div className="token-grid">
            {tokensQuery.data?.map((token) => (
              <TokenCard
                key={token.address}
                token={token}
                currentAccount={address ?? null}
                onFreeMint={handleFreeMint}
                onDecryptBalance={handleDecryptBalance}
                zamaUnavailable={zamaLoading || !!zamaError}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

type TokenCreationFormProps = {
  isSubmitting: boolean;
  feedback: string | null;
  onSubmit: (values: CreateTokenInput) => Promise<unknown>;
};

function TokenCreationForm({ isSubmitting, feedback, onSubmit }: TokenCreationFormProps) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await onSubmit({ name, symbol });
      setName('');
      setSymbol('');
    } catch (error) {
      console.error('Token creation failed', error);
    }
  };

  return (
    <form className="creation-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="token-name">Token Name</label>
        <input
          id="token-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Confidential Token"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="token-symbol">Token Symbol</label>
        <input
          id="token-symbol"
          type="text"
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          placeholder="CTK"
          maxLength={8}
          required
        />
      </div>

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Deploy Confidential Token'}
      </button>

      {feedback && <p className="form-feedback">{feedback}</p>}
    </form>
  );
}

type TokenCardProps = {
  token: LaunchpadToken;
  currentAccount: `0x${string}` | null;
  onFreeMint: (tokenAddress: `0x${string}`) => Promise<string>;
  onDecryptBalance: (tokenAddress: `0x${string}`) => Promise<string>;
  zamaUnavailable: boolean;
};

function TokenCard({ token, currentAccount, onFreeMint, onDecryptBalance, zamaUnavailable }: TokenCardProps) {
  const queryClient = useQueryClient();
  const [mintFeedback, setMintFeedback] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const freeMintMutation = useMutation({
    mutationFn: async () => {
      const txHash = await onFreeMint(token.address);
      return txHash;
    },
    onSuccess: (hash) => {
      setMintFeedback(`Free mint submitted. Transaction hash: ${hash}`);
      queryClient.invalidateQueries({ queryKey: ['launchpad', 'tokens'] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Mint failed';
      setMintFeedback(`Free mint failed: ${message}`);
    },
  });

  const decryptMutation = useMutation({
    mutationFn: async () => {
      const amount = await onDecryptBalance(token.address);
      return amount;
    },
    onSuccess: (amount) => {
      setBalance(amount);
      setBalanceError(null);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unable to decrypt balance';
      setBalanceError(message);
    },
  });

  const isCreator = currentAccount ? currentAccount.toLowerCase() === token.creator.toLowerCase() : false;
  const createdAt = new Date(token.createdAt).toLocaleString();
  const formattedMintAmount = formatTokenAmount(token.freemintAmount);

  return (
    <article className="token-card">
      <header className="token-card-header">
        <div>
          <h3 className="token-name">{token.name}</h3>
          <p className="token-symbol">{token.symbol}</p>
        </div>
        {isCreator && <span className="token-badge">Creator</span>}
      </header>

      <dl className="token-details">
        <div>
          <dt>Token Address</dt>
          <dd>{token.address}</dd>
        </div>
        <div>
          <dt>Creator</dt>
          <dd>{token.creator}</dd>
        </div>
        <div>
          <dt>Created At</dt>
          <dd>{createdAt}</dd>
        </div>
        <div>
          <dt>Free Mint Amount</dt>
          <dd>
            {formattedMintAmount}
            <span className="token-unit"> {token.symbol}</span>
          </dd>
        </div>
      </dl>

      <div className="token-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={() => freeMintMutation.mutate()}
          disabled={freeMintMutation.isPending}
        >
          {freeMintMutation.isPending ? 'Minting…' : 'Free Mint'}
        </button>

        <button
          className="tertiary-button"
          type="button"
          onClick={() => decryptMutation.mutate()}
          disabled={decryptMutation.isPending || zamaUnavailable}
        >
          {decryptMutation.isPending ? 'Decrypting…' : 'Decrypt My Balance'}
        </button>
      </div>

      {mintFeedback && <p className="token-feedback">{mintFeedback}</p>}
      {balance && <p className="token-balance">Your balance: {balance} {token.symbol}</p>}
      {balanceError && <p className="token-error">{balanceError}</p>}
      {zamaUnavailable && !decryptMutation.isPending && (
        <p className="token-warning">Encryption service is still initializing. Please retry shortly.</p>
      )}
    </article>
  );
}
