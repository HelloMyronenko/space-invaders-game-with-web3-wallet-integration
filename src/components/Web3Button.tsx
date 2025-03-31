import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import { Wallet, LogOut } from 'lucide-react';

export const Web3Button: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">
          {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
        </span>
        <button
          onClick={() => disconnect()}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-sm transition-colors"
        >
          <LogOut size={14} />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors"
    >
      <Wallet size={18} />
      Connect Wallet
    </button>
  );
};
