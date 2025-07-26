import React, { useState, useEffect } from 'react';
import { Trophy, BarChart3, Users, TrendingUp } from 'lucide-react';
import { web3Service } from '../utils/web3';

const ResultsDisplay = ({ votingStatus, candidates }) => {
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!votingStatus?.isActive && votingStatus?.totalVotes > 0) {
      fetchWinner();
    }
  }, [votingStatus]);

  const fetchWinner = async () => {
    setLoading(true);
    try {
      const winnerData = await web3Service.getWinner();
      setWinner(winnerData);
    } catch (error) {
      console.error('Error fetching winner:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVotePercentage = (voteCount, totalVotes) => {
    if (totalVotes === 0) return 0;
    return ((voteCount / totalVotes) * 100).toFixed(1);
  };

  const sortedCandidates = candidates ? [...candidates].sort((a, b) => b.voteCount - a.voteCount) : [];

  return (
    <div className="space-y-6">
      {/* Winner Display */}
      {!votingStatus?.isActive && winner && (
        <div className="card bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="text-center">
            <Trophy className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Winner Announced!
            </h3>
            <div className="bg-white rounded-lg p-4 inline-block">
              <h4 className="text-xl font-semibold text-gray-900">{winner.name}</h4>
              <p className="text-gray-600">
                {winner.voteCount} votes ({getVotePercentage(winner.voteCount, votingStatus?.totalVotes)}%)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Overview */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {votingStatus?.isActive ? 'Live Results' : 'Final Results'}
          </h3>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900">{votingStatus?.totalVotes || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{votingStatus?.totalCandidates || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-lg font-bold text-gray-900">
                  {votingStatus?.isActive ? 'Active' : 'Ended'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Results */}
        {sortedCandidates.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Candidate Results</h4>
            {sortedCandidates.map((candidate, index) => {
              const percentage = getVotePercentage(candidate.voteCount, votingStatus?.totalVotes);
              const isWinner = !votingStatus?.isActive && winner && candidate.id === winner.id;
              
              return (
                <div
                  key={candidate.id}
                  className={`border rounded-lg p-4 ${
                    isWinner ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 flex items-center">
                          {candidate.name}
                          {isWinner && <Trophy className="h-4 w-4 text-yellow-500 ml-2" />}
                        </h5>
                        <p className="text-sm text-gray-500">Candidate #{candidate.id}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{candidate.voteCount}</p>
                      <p className="text-sm text-gray-500">{percentage}%</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isWinner ? 'bg-yellow-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No voting results available yet</p>
          </div>
        )}

        {/* Live Updates Notice */}
        {votingStatus?.isActive && (
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Live Results:</strong> These results update in real-time as votes are cast. 
              Final results will be available once voting ends.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
