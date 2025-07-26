import React, { useState, useEffect } from 'react';
import { Vote, CheckCircle, AlertCircle } from 'lucide-react';
import { web3Service } from '../utils/web3';
import toast from 'react-hot-toast';

const VotingInterface = ({ account, votingStatus, candidates, onVoteSubmitted }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voterStatus, setVoterStatus] = useState({
    isRegistered: false,
    hasVoted: false,
    loading: true
  });

  useEffect(() => {
    if (account) {
      checkVoterStatus();
    }
  }, [account]);

  const checkVoterStatus = async () => {
    if (!account) return;
    
    try {
      const [isRegistered, hasVoted] = await Promise.all([
        web3Service.isVoterRegistered(account),
        web3Service.hasVoterVoted(account)
      ]);
      
      setVoterStatus({
        isRegistered,
        hasVoted,
        loading: false
      });
    } catch (error) {
      console.error('Error checking voter status:', error);
      setVoterStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const submitVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }

    setIsVoting(true);
    try {
      await web3Service.vote(selectedCandidate.id);
      toast.success(`Vote cast for ${selectedCandidate.name}!`);
      setVoterStatus(prev => ({ ...prev, hasVoted: true }));
      onVoteSubmitted?.();
    } catch (error) {
      toast.error(error.reason || error.message || 'Failed to cast vote');
    } finally {
      setIsVoting(false);
    }
  };

  if (!account) {
    return (
      <div className="card text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Wallet Not Connected
        </h3>
        <p className="text-gray-600">
          Please connect your wallet to participate in voting
        </p>
      </div>
    );
  }

  if (voterStatus.loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!voterStatus.isRegistered) {
    return (
      <div className="card text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Not Registered to Vote
        </h3>
        <p className="text-gray-600 mb-4">
          Your address is not registered to vote in this election. Please contact the administrator to get registered.
        </p>
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          Your address: {account}
        </div>
      </div>
    );
  }

  if (voterStatus.hasVoted) {
    return (
      <div className="card text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Vote Already Cast
        </h3>
        <p className="text-gray-600">
          You have already voted in this election. Thank you for participating!
        </p>
      </div>
    );
  }

  if (!votingStatus?.isActive) {
    return (
      <div className="card text-center">
        <Vote className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Voting Not Active
        </h3>
        <p className="text-gray-600">
          Voting is currently not active. Please wait for the administrator to start the voting process.
        </p>
      </div>
    );
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="card text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Candidates Available
        </h3>
        <p className="text-gray-600">
          There are no candidates to vote for at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <Vote className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Cast Your Vote</h3>
      </div>

      <div className="space-y-4 mb-6">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedCandidate?.id === candidate.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedCandidate(candidate)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedCandidate?.id === candidate.id
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}>
                  {selectedCandidate?.id === candidate.id && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                  <p className="text-sm text-gray-500">Candidate #{candidate.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {candidate.voteCount} votes
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {selectedCandidate ? (
            <span>Selected: <strong>{selectedCandidate.name}</strong></span>
          ) : (
            <span>Please select a candidate</span>
          )}
        </div>
        
        <button
          onClick={submitVote}
          disabled={!selectedCandidate || isVoting}
          className="btn-primary"
        >
          {isVoting ? 'Submitting Vote...' : 'Submit Vote'}
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Once you submit your vote, it cannot be changed. Please make sure you have selected the correct candidate.
        </p>
      </div>
    </div>
  );
};

export default VotingInterface;
