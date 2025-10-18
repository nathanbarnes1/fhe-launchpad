import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Contract } from 'ethers';

import { FACTORY_ADDRESS, FACTORY_ABI, IS_FACTORY_CONFIGURED } from '../config/contracts';
import { useEthersSigner } from '../hooks/useEthersSigner';
import '../styles/CreateTokenForm.css';

interface CreateTokenFormProps {
  onCreated: () => Promise<void> | void;
}

export function CreateTokenForm({ onCreated }: CreateTokenFormProps) {
  const { address } = useAccount();
  const signerPromise = useEthersSigner();

  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);

  const clearForm = () => {
    setTokenName('');
    setTokenSymbol('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!IS_FACTORY_CONFIGURED) {
      setStatusMessage('Factory address is not configured.');
      return;
    }

    if (!signerPromise) {
      setStatusMessage('Connect your wallet to deploy a token.');
      return;
    }

    if (!tokenName.trim() || !tokenSymbol.trim()) {
      setStatusMessage('Token name and symbol are required.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Preparing deployment...');
    setTxHash(null);

    try {
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Wallet signer unavailable');
      }

      const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
      const tx = await factory.createConfidentialToken(tokenName.trim(), tokenSymbol.trim());
      setStatusMessage('Waiting for Sepolia confirmation...');
      setTxHash(tx.hash);
      await tx.wait();

      setStatusMessage('Token deployed successfully.');
      await onCreated();
      clearForm();
    } catch (error) {
      console.error('Failed to deploy token', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      setStatusMessage(`Deployment failed: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-card">
      <h2 className="card-title">Launch a Confidential Token</h2>
      <p className="card-subtitle">
        Each token inherits Zama's FHE security. Holders can mint a private balance of 10 units for free.
      </p>

      <form className="create-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Token Name</span>
          <input
            className="field-input"
            placeholder="e.g., Midnight Dollar"
            value={tokenName}
            onChange={event => setTokenName(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Token Symbol</span>
          <input
            className="field-input"
            placeholder="e.g., MND"
            value={tokenSymbol}
            onChange={event => setTokenSymbol(event.target.value.toUpperCase())}
            disabled={isSubmitting}
            maxLength={6}
            required
          />
        </label>

        <button
          className="primary-button"
          type="submit"
          disabled={isSubmitting || !address || !IS_FACTORY_CONFIGURED}
        >
          {isSubmitting
            ? 'Deploying...'
            : !IS_FACTORY_CONFIGURED
            ? 'Configure Factory Address'
            : address
            ? 'Deploy Token'
            : 'Connect Wallet to Deploy'}
        </button>
      </form>

      {statusMessage && (
        <div className="status-box">
          <p>{statusMessage}</p>
          {txHash && (
            <a
              className="status-link"
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              View transaction
            </a>
          )}
        </div>
      )}

      <div className="helper-box">
        <h3>What happens next?</h3>
        <ul>
          <li>Your contract inherits Sepolia FHE configuration automatically.</li>
          <li>Your wallet address is recorded as the token creator.</li>
          <li>Every holder can mint 10.000000 units privately using the freemint action.</li>
        </ul>
      </div>
    </div>
  );
}
