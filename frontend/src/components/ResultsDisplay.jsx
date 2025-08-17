import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { BarChart3, Trophy, TrendingUp, Users, Clock, AlertCircle, Shield } from 'lucide-react';
import { t } from '../utils/translations';

function ResultsDisplay({ votingStatus, candidates }) {
  const [blockchainData, setBlockchainData] = useState({
    candidates: [],
    totalVotes: 0,
    isActive: false,
    deadline: null,
    currentLeader: null
  });
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Set deadline to 17/08/2025 15:00
  useEffect(() => {
    const deadline = new Date('2025-08-17T15:00:00');
    setBlockchainData(prev => ({ ...prev, deadline }));

    // Fetch initial data
    fetchBlockchainData();

    // Update every 30 seconds for real-time results
    const interval = setInterval(fetchBlockchainData, 30000);

    // Update countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, []);

  const fetchBlockchainData = async () => {
    try {
      // Fetch real vote data from backend
      const response = await fetch('/api/votes/results');
      if (!response.ok) {
        throw new Error('Failed to fetch vote results');
      }
      
      const data = await response.json();
      const updatedCandidates = data.candidates;
      const totalVotes = data.totalVotes;
      
      // Only show current leader if there are actual votes
      let currentLeader = null;
      if (totalVotes > 0) {
        currentLeader = updatedCandidates.reduce((leader, candidate) => 
          candidate.voteCount > leader.voteCount ? candidate : leader
        );
      }
      
      setBlockchainData(prev => ({
        ...prev,
        candidates: updatedCandidates,
        totalVotes,
        isActive: true, // Always true since deadline is in the future
        currentLeader
      }));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
      toast.error(t('error.cantFindResults'));
      setLoading(false);
    }
  };

  const updateCountdown = () => {
    if (blockchainData.deadline) {
      const now = new Date().getTime();
      const deadline = new Date(blockchainData.deadline).getTime();
      const remaining = Math.max(0, deadline - now);
      setTimeRemaining(remaining);
    }
  };

  const formatTimeRemaining = (milliseconds) => {
    if (milliseconds === 0) return '00:00:00';
    
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    if (days > 0) {
      return `${days} umunsi, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculatePercentage = (voteCount) => {
    if (blockchainData.totalVotes === 0) return 0;
    return ((voteCount / blockchainData.totalVotes) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Birakora...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ibisubizo by'Amatora</h1>
          <p className="text-lg text-gray-600 mb-6">Reba ibisubizo by'amatora mu gihe nyacyo</p>
          
          {/* Deadline Countdown */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-yellow-800">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">
                Umunsi wa nyuma wo gutora: 17/08/2025 saa kenda (15:00)
              </span>
            </div>
            <div className="mt-2 text-sm text-yellow-700">
              Igihe gisigaye: {formatTimeRemaining(timeRemaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Current Leader Highlight - Only show if voting is active and there are votes */}
      {blockchainData.isActive && blockchainData.totalVotes > 0 && blockchainData.currentLeader && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">
              Ushoboye Ubu
            </h2>
            <h3 className="text-3xl font-bold text-yellow-900 mb-2">
              {blockchainData.currentLeader.name}
            </h3>
            <div className="flex items-center justify-center space-x-6 text-yellow-800">
              <div className="text-center">
                <p className="text-sm font-medium">Amatora</p>
                <p className="text-2xl font-bold">{blockchainData.currentLeader.voteCount}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Ijanisha</p>
                <p className="text-2xl font-bold">{calculatePercentage(blockchainData.currentLeader.voteCount)}%</p>
              </div>
            </div>
            <p className="text-sm text-yellow-700 mt-4">
              Uwatsinze azaboneka nyuma y'uko amatora arangiye
            </p>
          </div>
        </div>
      )}

      {/* Show message when no votes are cast */}
      {blockchainData.isActive && blockchainData.totalVotes === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-2">
            Amajwi Arangana Kano Kanya
          </h2>
          <p className="text-lg text-blue-700">
            Nta matora yatanzwe ubu. Tangira gutora!
          </p>
        </div>
      )}

      {/* Statistics Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl text-center">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-blue-600 font-medium">Abakandida Bose</p>
          <p className="text-3xl font-bold text-blue-900">{candidates.length}</p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl text-center">
          <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <p className="text-sm text-green-600 font-medium">Amatora Yose</p>
          <p className="text-3xl font-bold text-green-900">{blockchainData.totalVotes}</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl text-center">
          <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-3" />
          <p className="text-sm text-purple-600 font-medium">Status y'Amatora</p>
          <p className="text-xl font-bold text-purple-900">
            {blockchainData.isActive ? 'Turacyatora' : 'Ntabwo arakora'}
          </p>
        </div>
      </div>

      {/* Results Chart */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ibisubizo Byuzuye</h2>

        <div className="space-y-6">
          {blockchainData.candidates.map((candidate, index) => {
            const percentage = calculatePercentage(candidate.voteCount);
            const isLeader = candidate.id === blockchainData.currentLeader?.id;

            return (
              <div key={candidate.id} className="relative">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center space-x-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isLeader ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {index + 1}
                    </span>
                    <img
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                      <p className="text-sm text-gray-600">Umukandida</p>
                    </div>
                  </div>
                  
                  <div className="ml-auto text-right">
                    <p className="text-lg font-bold text-gray-900">{candidate.voteCount}</p>
                    <p className="text-sm text-gray-600">{percentage}%</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isLeader ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                {/* Leader Badge */}
                {isLeader && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Trophy className="h-3 w-3" />
                      <span>Ushoboye</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Bibitswe na Blockchain</span>
          </div>
          <p className="text-sm text-gray-500">
            Ibisubizo byose bishobora kugenzurwa kandi ntibishobora guhindurwa
          </p>
        </div>
      </div>

      {/* Voting Status */}
      {blockchainData.isActive && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-900 mb-2">Amatora Aracyakora</h3>
          <p className="text-green-700 mb-4">Umunsi wa nyuma wo gutora: 17/08/2025 saa kenda (15:00)</p>
          <div className="bg-white rounded-lg p-4 inline-block">
            <p className="text-sm text-green-600 font-medium">Igihe gisigaye:</p>
            <p className="text-2xl font-bold text-green-800">{formatTimeRemaining(timeRemaining)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsDisplay;
