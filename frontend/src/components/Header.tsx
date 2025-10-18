import type { ReactNode } from 'react';
import '../styles/Header.css';

interface HeaderProps {
  children: ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="brand">
            <span className="brand-badge">FHE</span>
            <div>
              <h2 className="brand-title">Confidential Launchpad</h2>
              <p className="brand-subtitle">Create private-first fungible tokens</p>
            </div>
          </div>
          <div className="header-actions">
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}
