import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

// Contract ABI and address will be imported after deployment
let contractAddress = null;
let contractABI = null;

// Function to load contract details
async function loadContractDetails() {
  try {
    const addressData = await import('../contracts/contract-address.json');
    const abiData = await import('../contracts/VotingSystem.json');
    contractAddress = addressData.VotingSystem;
    contractABI = JSON.parse(abiData.default);
    return true;
  } catch (error) {
    console.log('Contract not deployed yet or files not found');
    return false;
  }
}

export class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
  }

  async connectWallet() {
    try {
      // Detect MetaMask
      const provider = await detectEthereumProvider();
      
      if (!provider) {
        throw new Error('MetaMask not detected. Please install MetaMask.');
      }

      // Request account access
      await provider.request({ method: 'eth_requestAccounts' });
      
      // Create ethers provider
      this.provider = new ethers.BrowserProvider(provider);
      this.signer = await this.provider.getSigner();
      this.account = await this.signer.getAddress();

      // Load and initialize contract if deployed
      await loadContractDetails();
      if (contractAddress && contractABI) {
        this.contract = new ethers.Contract(contractAddress, contractABI, this.signer);
      }

      // Listen for account changes
      provider.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.disconnect();
        } else {
          this.account = accounts[0];
          window.location.reload();
        }
      });

      // Listen for chain changes
      provider.on('chainChanged', () => {
        window.location.reload();
      });

      return this.account;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async checkNetwork() {
    if (!this.provider) return false;
    
    try {
      const network = await this.provider.getNetwork();
      // Check if we're on localhost (chainId 1337) or hardhat network
      return network.chainId === 1337n || network.chainId === 31337n;
    } catch (error) {
      console.error('Error checking network:', error);
      return false;
    }
  }

  async switchToLocalNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x539' }], // 1337 in hex
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x539',
                chainName: 'Localhost 8545',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['http://localhost:8545'],
              },
            ],
          });
        } catch (addError) {
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  }

  disconnect() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
  }

  isConnected() {
    return this.account !== null;
  }

  getAccount() {
    return this.account;
  }

  // Contract interaction methods
  async registerVoter(voterAddress) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await this.contract.registerVoter(voterAddress);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error registering voter:', error);
      throw error;
    }
  }

  async addCandidate(name) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await this.contract.addCandidate(name);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error adding candidate:', error);
      throw error;
    }
  }

  async startVoting() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await this.contract.startVoting();
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error starting voting:', error);
      throw error;
    }
  }

  async endVoting() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await this.contract.endVoting();
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error ending voting:', error);
      throw error;
    }
  }

  async vote(candidateId) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await this.contract.vote(candidateId);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  }

  async getAllCandidates() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const [ids, names, voteCounts] = await this.contract.getAllCandidates();
      return ids.map((id, index) => ({
        id: Number(id),
        name: names[index],
        voteCount: Number(voteCounts[index])
      }));
    } catch (error) {
      console.error('Error getting candidates:', error);
      throw error;
    }
  }

  async getVotingStatus() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const [isActive, totalCandidates, totalVotes] = await this.contract.getVotingStatus();
      return {
        isActive,
        totalCandidates: Number(totalCandidates),
        totalVotes: Number(totalVotes)
      };
    } catch (error) {
      console.error('Error getting voting status:', error);
      throw error;
    }
  }

  async isVoterRegistered(address) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      return await this.contract.isVoterRegistered(address);
    } catch (error) {
      console.error('Error checking voter registration:', error);
      throw error;
    }
  }

  async hasVoterVoted(address) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      return await this.contract.hasVoterVoted(address);
    } catch (error) {
      console.error('Error checking if voter has voted:', error);
      throw error;
    }
  }

  async getWinner() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const [winnerId, winnerName, winnerVoteCount] = await this.contract.getWinner();
      return {
        id: Number(winnerId),
        name: winnerName,
        voteCount: Number(winnerVoteCount)
      };
    } catch (error) {
      console.error('Error getting winner:', error);
      throw error;
    }
  }

  async getOwner() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      return await this.contract.owner();
    } catch (error) {
      console.error('Error getting owner:', error);
      throw error;
    }
  }

  isOwner() {
    return this.account && this.contract && this.account.toLowerCase() === this.getOwner()?.toLowerCase();
  }
}

export const web3Service = new Web3Service();
