import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Play, Square, Plus } from 'lucide-react';
import { web3Service } from '../utils/web3';
import toast from 'react-hot-toast';

const AdminPanel = ({ isOwner, votingStatus, onStatusChange }) => {
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newVoterAddress, setNewVoterAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOwner) {
    return null;
  }

  const addCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidateName.trim()) {
      toast.error('Please enter a candidate name');
      return;
    }

    setIsLoading(true);
    try {
      await web3Service.addCandidate(newCandidateName.trim());
      toast.success(`Candidate "${newCandidateName}" added successfully!`);
      setNewCandidateName('');
      onStatusChange?.();
    } catch (error) {
      toast.error(error.reason || error.message || 'Failed to add candidate');
    } finally {
      setIsLoading(false);
    }
  };

  const registerVoter = async (e) => {
    e.preventDefault();
    if (!newVoterAddress.trim()) {
      toast.error('Please enter a voter address');
      return;
    }

    // Basic address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(newVoterAddress.trim())) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    setIsLoading(true);
    try {
      await web3Service.registerVoter(newVoterAddress.trim());
      toast.success('Voter registered successfully!');
      setNewVoterAddress('');
    } catch (error) {
      toast.error(error.reason || error.message || 'Failed to register voter');
    } finally {
      setIsLoading(false);
    }
  };

  const startVoting = async () => {
    if (votingStatus?.totalCandidates === 0) {
      toast.error('Please add at least one candidate before starting voting');
      return;
    }

    setIsLoading(true);
    try {
      await web3Service.startVoting();
      toast.success('Voting started successfully!');
      onStatusChange?.();
    } catch (error) {
      toast.error(error.reason || error.message || 'Failed to start voting');
    } finally {
      setIsLoading(false);
    }
  };

  const endVoting = async () => {
    setIsLoading(true);
    try {
      await web3Service.endVoting();
      toast.success('Voting ended successfully!');
      onStatusChange?.();
    } catch (error) {
      toast.error(error.reason || error.message || 'Failed to end voting');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Admin Panel</h3>
        </div>

        {/* Voting Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Voting Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Status: </span>
              <span className={`font-medium ${votingStatus?.isActive ? 'text-green-600' : 'text-gray-900'}`}>
                {votingStatus?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Candidates: </span>
              <span className="font-medium">{votingStatus?.totalCandidates || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Votes: </span>
              <span className="font-medium">{votingStatus?.totalVotes || 0}</span>
            </div>
          </div>
        </div>

        {/* Add Candidate */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </h4>
          <form onSubmit={addCandidate} className="flex space-x-3">
            <input
              type="text"
              value={newCandidateName}
              onChange={(e) => setNewCandidateName(e.target.value)}
              placeholder="Enter candidate name"
              className="input-field flex-1"
              disabled={isLoading || votingStatus?.isActive}
            />
            <button
              type="submit"
              disabled={isLoading || votingStatus?.isActive}
              className="btn-primary"
            >
              Add
            </button>
          </form>
          {votingStatus?.isActive && (
            <p className="text-sm text-yellow-600 mt-2">
              Cannot add candidates while voting is active
            </p>
          )}
        </div>

        {/* Register Voter */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Register Voter
          </h4>
          <form onSubmit={registerVoter} className="flex space-x-3">
            <input
              type="text"
              value={newVoterAddress}
              onChange={(e) => setNewVoterAddress(e.target.value)}
              placeholder="Enter voter address (0x...)"
              className="input-field flex-1"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              Register
            </button>
          </form>
        </div>

        {/* Voting Controls */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Voting Controls</h4>
          <div className="flex space-x-3">
            {!votingStatus?.isActive ? (
              <button
                onClick={startVoting}
                disabled={isLoading}
                className="btn-primary flex items-center"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Voting
              </button>
            ) : (
              <button
                onClick={endVoting}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
              >
                <Square className="h-4 w-4 mr-2" />
                End Voting
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
