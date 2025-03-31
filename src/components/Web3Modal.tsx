import React from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal as Web3ModalProvider } from '@web3modal/react';

// 1. Define constants
const projectId = 'YOUR_PROJECT_ID'; // Replace with your actual project ID if you have one

// 2. Configure wagmi client
const chains = [mainnet, polygon, optimism, arbitrum];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

// 3. Create ethereum and modal clients
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export const Web3Modal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        {children}
      </WagmiConfig>
      <Web3ModalProvider
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode="dark"
        themeColor="green"
      />
    </>
  );
};
