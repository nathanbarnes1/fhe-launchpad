import { useMemo, useState } from 'react';
import { useAccount, usePublicClient, useReadContract } from 'wagmi';
import { Contract, ethers } from 'ethers';

import type { TokenRecord } from '../types/tokens';
import { TOKEN_ABI } from '../config/contracts';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import '../styles/TokenList.css';

interface TokenListProps {
  title: string;
  emptyMessage: string;
  tokens: TokenRecord[];
  isLoading?: boolean;
  onActionComplete: () => Promise<void> | void;
}

export function TokenList({ title, emptyMessage, tokens, isLoading = false, onActionComplete }: TokenListProps) {
  return (
    <div className="token-list">
      <div className="token-list-header">
        <h2>{title}</h2>
        {isLoading && <span className="loading">Refreshing...</span>}
      </div>

      {tokens.length === 0 ? (
        <div className="token-empty">{emptyMessage}</div>
      ) : (
        <div className="token-grid">
          {tokens.map(record => (
            <TokenCard key={record.token} record={record} onActionComplete={onActionComplete} />
          ))}
        </div>
      )}
    </div>
  );
}

interface TokenCardProps {
  record: TokenRecord;
  onActionComplete: () => Promise<void> | void;
}

function TokenCard({ record, onActionComplete }: TokenCardProps) {
  const { address } = useAccount();
  const signerPromise = useEthersSigner();
  const publicClient = usePublicClient();
  const { instance, isLoading: zamaLoading, error: zamaError } = useZamaInstance();

  const { data: nameData } = useReadContract({
    address: record.token,
    abi: TOKEN_ABI,
    functionName: 'name',
  });

  const { data: symbolData } = useReadContract({
    address: record.token,
    abi: TOKEN_ABI,
    functionName: 'symbol',
  });

  const { data: freeAmountData } = useReadContract({
    address: record.token,
    abi: TOKEN_ABI,
    functionName: 'freemintAmount',
  });

  const createdDate = useMemo(() => new Date(Number(record.createdAt) * 1000).toLocaleString(), [record.createdAt]);
  const freeAmount = useMemo(() => {
    if (!freeAmountData) return '0.000000';
    const raw = BigInt(freeAmountData as bigint);
    const whole = raw / BigInt(1_000_000);
    const fraction = raw % BigInt(1_000_000);
    return `${whole.toString()}.${fraction.toString().padStart(6, '0')}`;
  }, [freeAmountData]);

  const [isMinting, setIsMinting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedBalance, setDecryptedBalance] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const formattedBalance = useMemo(() => {
    if (decryptedBalance === null) return null;
    try {
      const raw = BigInt(decryptedBalance);
      const whole = raw / BigInt(1_000_000);
      const fraction = raw % BigInt(1_000_000);
      return `${whole.toString()}.${fraction.toString().padStart(6, '0')}`;
    } catch (error) {
      console.warn('Unable to format decrypted balance', error);
      return decryptedBalance;
    }
  }, [decryptedBalance]);

  const handleFreemint = async () => {
    if (!signerPromise) {
      setStatusMessage('Connect your wallet to mint tokens.');
      return;
    }

    setIsMinting(true);
    setStatusMessage('Submitting freemint transaction...');

    try {
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Wallet signer unavailable');
      }

      const token = new Contract(record.token, TOKEN_ABI, signer);
      const tx = await token.freemint();
      setStatusMessage('Waiting for confirmation...');
      await tx.wait();
      setStatusMessage('Freemint completed successfully.');
      await onActionComplete();
    } catch (error) {
      console.error('Freemint failed', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      setStatusMessage(`Freemint failed: ${message}`);
    } finally {
      setIsMinting(false);
    }
  };

  const handleDecryptBalance = async () => {
    if (!address) {
      setStatusMessage('Connect your wallet to decrypt balances.');
      return;
    }

    if (!instance) {
      setStatusMessage('Waiting for encryption relayer to initialize.');
      return;
    }

    if (!publicClient) {
      setStatusMessage('Public client unavailable for balance query.');
      return;
    }

    setIsDecrypting(true);
    setStatusMessage('Requesting encrypted balance...');

    try {
      const encryptedBalance = await publicClient.readContract({
        address: record.token,
        abi: TOKEN_ABI,
        functionName: 'confidentialBalanceOf',
        args: [address],
      });

      if (encryptedBalance === ethers.ZeroHash) {
        setDecryptedBalance('0');
        setStatusMessage('You have no minted balance yet.');
        return;
      }

      const keypair = instance.generateKeypair();
      const startTimestamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '7';
      const contractAddresses = [record.token];

      const eip712 = instance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimestamp,
        durationDays,
      );

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Wallet signer unavailable for signature');
      }

      const signature = await signer.signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message,
      );

      const decryption = await instance.userDecrypt(
        [
          {
            handle: encryptedBalance,
            contractAddress: record.token,
          },
        ],
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        startTimestamp,
        durationDays,
      );

      const resolved = decryption[encryptedBalance as string] ?? '0';
      setDecryptedBalance(resolved);
      setStatusMessage('Balance decrypted successfully.');
    } catch (error) {
      console.error('Failed to decrypt balance', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      setStatusMessage(`Decryption failed: ${message}`);
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <article className="token-card">
      <header className="token-card-header">
        <div>
          <h3>{(nameData as string) ?? 'Loading name...'}</h3>
          <span className="token-symbol">{(symbolData as string) ?? ''}</span>
        </div>
        <span className="token-address">{record.token}</span>
      </header>

      <dl className="token-meta">
        <div>
          <dt>Creator</dt>
          <dd>{record.creator}</dd>
        </div>
        <div>
          <dt>Deployed</dt>
          <dd>{createdDate}</dd>
        </div>
        <div>
          <dt>Free Mint Allowance</dt>
          <dd>{freeAmount} tokens</dd>
        </div>
      </dl>

      <div className="token-actions">
        <button className="secondary-button" onClick={handleFreemint} disabled={isMinting}>
          {isMinting ? 'Minting...' : 'Freemint'}
        </button>
        <button
          className="secondary-button"
          onClick={handleDecryptBalance}
          disabled={isDecrypting || zamaLoading}
        >
          {isDecrypting || zamaLoading ? 'Decrypting...' : 'Decrypt My Balance'}
        </button>
      </div>

      {zamaError && <p className="token-warning">{zamaError}</p>}

      {formattedBalance !== null && (
        <div className="balance-box">
          <p className="balance-label">Decrypted Balance</p>
          <p className="balance-value">{formattedBalance} tokens</p>
        </div>
      )}

      {statusMessage && <p className="token-status">{statusMessage}</p>}
    </article>
  );
}
