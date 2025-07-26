import React, { useState, useEffect } from 'react';
import { Wallet, AlertCircle } from 'lucide-react';
import { web3Service } from '../utils/web3';
import toast from 'react-hot-toast';

const WalletConnection = ({ onConnectionChange }) => {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkCorrect, setNetworkCorrect] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (web3Service.isConnected()) {
      setAccount(web3Service.getAccount());
      const isCorrectNetwork = await web3Service.checkNetwork();
      setNetworkCorrect(isCorrectNetwork);
      onConnectionChange?.(web3Service.getAccount(), isCorrectNetwork);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const account = await web3Service.connectWallet();
      setAccount(account);
      
      const isCorrectNetwork = await web3Service.checkNetwork();
      setNetworkCorrect(isCorrectNetwork);
      
      if (!isCorrectNetwork) {
        toast.error('Please switch to the local network (localhost:8545)');
      } else {
        toast.success('Wallet connected successfully!');
      }
      
      onConnectionChange?.(account, isCorrectNetwork);
    } catch (error) {
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async () => {
    try {
      await web3Service.switchToLocalNetwork();
      const isCorrectNetwork = await web3Service.checkNetwork();
      setNetworkCorrect(isCorrectNetwork);
      
      if (isCorrectNetwork) {
        toast.success('Switched to local network!');
        onConnectionChange?.(account, true);
      }
    } catch (error) {
      toast.error('Failed to switch network');
    }
  };

  const disconnect = () => {
    web3Service.disconnect();
    setAccount(null);
    setNetworkCorrect(false);
    onConnectionChange?.(null, false);
    toast.success('Wallet disconnected');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!account) {
    return (
      <div className="card">
        <div className="text-center">
          <Wallet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-gray-600 mb-6">
            Connect your MetaMask wallet to participate in voting
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="btn-primary"
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {formatAddress(account)}
            </p>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${networkCorrect ? 'bg-green-400' : 'bg-red-400'}`} />
              <p className="text-xs text-gray-500">
                {networkCorrect ? 'Local Network' : 'Wrong Network'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {!networkCorrect && (
            <button
              onClick={switchNetwork}
              className="btn-secondary text-sm"
            >
              Switch Network
            </button>
          )}
          <button
            onClick={disconnect}
            className="btn-secondary text-sm"
          >
            Disconnect
          </button>
        </div>
      </div>
      
      {!networkCorrect && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                Please switch to the local network (localhost:8545) to interact with the voting contract.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
