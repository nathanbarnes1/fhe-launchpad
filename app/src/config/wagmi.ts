import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Confidential Token Launchpad',
  projectId: 'confidential-token-launchpad',
  chains: [sepolia],
  ssr: false,
});
