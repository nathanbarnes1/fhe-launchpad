import { useMemo, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract } from 'wagmi';

import { Header } from './Header';
import { CreateTokenForm } from './CreateTokenForm';
import { TokenList } from './TokenList';
import { FACTORY_ADDRESS, FACTORY_ABI, IS_FACTORY_CONFIGURED } from '../config/contracts';
import type { TokenRecord } from '../types/tokens';
import '../styles/LaunchpadApp.css';

type TabKey = 'create' | 'mine' | 'all';

export function LaunchpadApp() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<TabKey>('create');

  const {
    data: rawRecords,
    refetch: refetchRecords,
    isFetching,
  } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getTokenRecords',
    query: {
      refetchOnWindowFocus: false,
      enabled: IS_FACTORY_CONFIGURED,
    },
  });

  const tokenRecords = useMemo<TokenRecord[]>(() => {
    if (!rawRecords) return [];
    return (rawRecords as TokenRecord[]).map(record => ({
      token: record.token,
      creator: record.creator,
      createdAt: record.createdAt,
    }));
  }, [rawRecords]);

  const handleRefresh = async () => {
    await refetchRecords();
  };

  const filteredMine = useMemo(() => {
    if (!address) return [];
    return tokenRecords.filter(record => record.creator.toLowerCase() === address.toLowerCase());
  }, [address, tokenRecords]);

  return (
    <div className="launchpad-shell">
      <Header>
        <ConnectButton />
      </Header>

      <main className="launchpad-main">
        <section className="intro">
          <h1 className="intro-title">Confidential Token Launchpad</h1>
          <p className="intro-subtitle">
            Deploy FHE-enabled tokens, mint private balances, and manage your confidential assets on Sepolia.
          </p>
          {!IS_FACTORY_CONFIGURED && (
            <p className="intro-warning">
              Factory address is not configured. Set <code>VITE_FACTORY_ADDRESS</code> before interacting with the launchpad.
            </p>
          )}
        </section>

        <nav className="tab-bar">
          <button
            className={`tab-item ${activeTab === 'create' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Token
          </button>
          <button
            className={`tab-item ${activeTab === 'mine' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('mine')}
          >
            My Tokens
          </button>
          <button
            className={`tab-item ${activeTab === 'all' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Explore Tokens
          </button>
        </nav>

        <section className="tab-content">
          {activeTab === 'create' && (
            <CreateTokenForm onCreated={handleRefresh} />
          )}

          {activeTab === 'mine' && (
            <TokenList
              title="Your Launchpad Tokens"
              emptyMessage={address ? 'You have not created any tokens yet.' : 'Connect your wallet to view creations.'}
              tokens={filteredMine}
              onActionComplete={handleRefresh}
              isLoading={isFetching}
            />
          )}

          {activeTab === 'all' && (
            <TokenList
              title="All Confidential Tokens"
              emptyMessage="No confidential tokens deployed yet. Be the first to launch one."
              tokens={tokenRecords}
              onActionComplete={handleRefresh}
              isLoading={isFetching}
            />
          )}
        </section>
      </main>
    </div>
  );
}
