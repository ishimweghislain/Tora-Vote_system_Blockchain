import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Vote, Shield, BarChart3 } from 'lucide-react';
import WalletConnection from './components/WalletConnection';
import AdminPanel from './components/AdminPanel';
import VotingInterface from './components/VotingInterface';
import ResultsDisplay from './components/ResultsDisplay';
import { web3Service } from './utils/web3';

function App() {
  const [account, setAccount] = useState(null);
  const [networkCorrect, setNetworkCorrect] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [votingStatus, setVotingStatus] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState('vote');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account && networkCorrect) {
      checkOwnerStatus();
      fetchVotingData();
    }
  }, [account, networkCorrect]);

  const handleConnectionChange = (newAccount, isNetworkCorrect) => {
    setAccount(newAccount);
    setNetworkCorrect(isNetworkCorrect);
    
    if (!newAccount || !isNetworkCorrect) {
      setIsOwner(false);
      setVotingStatus(null);
      setCandidates([]);
    }
  };

  const checkOwnerStatus = async () => {
    try {
      const owner = await web3Service.getOwner();
      setIsOwner(account && owner && account.toLowerCase() === owner.toLowerCase());
    } catch (error) {
      console.error('Error checking owner status:', error);
      setIsOwner(false);
    }
  };

  const fetchVotingData = async () => {
    setLoading(true);
    try {
      const [status, candidatesList] = await Promise.all([
        web3Service.getVotingStatus(),
        web3Service.getAllCandidates()
      ]);
      
      setVotingStatus(status);
      setCandidates(candidatesList);
    } catch (error) {
      console.error('Error fetching voting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = () => {
    fetchVotingData();
  };

  const handleVoteSubmitted = () => {
    fetchVotingData();
  };

  const tabs = [
    { id: 'vote', label: 'Vote', icon: Vote },
    { id: 'results', label: 'Results', icon: BarChart3 },
    ...(isOwner ? [{ id: 'admin', label: 'Admin', icon: Shield }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DecentralVote</h1>
                <p className="text-sm text-gray-600">Secure Blockchain Voting System</p>
              </div>
            </div>
            
            {account && networkCorrect && (
              <div className="flex items-center space-x-2">
                {isOwner && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </span>
                )}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  votingStatus?.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {votingStatus?.isActive ? 'Voting Active' : 'Voting Inactive'}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnection onConnectionChange={handleConnectionChange} />
        </div>

        {account && networkCorrect ? (
          <div className="space-y-8">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            {loading ? (
              <div className="card">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {activeTab === 'vote' && (
                  <VotingInterface
                    account={account}
                    votingStatus={votingStatus}
                    candidates={candidates}
                    onVoteSubmitted={handleVoteSubmitted}
                  />
                )}
                
                {activeTab === 'results' && (
                  <ResultsDisplay
                    votingStatus={votingStatus}
                    candidates={candidates}
                  />
                )}
                
                {activeTab === 'admin' && isOwner && (
                  <AdminPanel
                    isOwner={isOwner}
                    votingStatus={votingStatus}
                    onStatusChange={handleStatusChange}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Vote className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to DecentralVote
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              A secure, transparent, and tamper-proof voting system built on the Ethereum blockchain. 
              Connect your wallet to get started.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Built with React, Vite, Tailwind CSS, and Ethereum Smart Contracts</p>
            <p className="mt-1">Secure • Transparent • Decentralized</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
