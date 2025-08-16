import React, { useState, useEffect } from 'react';
import { Trophy, BarChart3, Users, TrendingUp, Clock, Eye } from 'lucide-react';
import { t } from '../utils/translations';

const ResultsDisplay = ({ votingStatus, candidates }) => {
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    // Calculate total votes from candidates
    if (candidates && candidates.length > 0) {
      const total = candidates.reduce((sum, candidate) => sum + (candidate.voteCount || 0), 0);
      setTotalVotes(total);

      // Determine winner if voting is not active
      if (!votingStatus?.isActive && total > 0) {
        const winningCandidate = candidates.reduce((prev, current) =>
          (current.voteCount > prev.voteCount) ? current : prev
        );
        setWinner(winningCandidate);
      }
    }
  }, [candidates, votingStatus]);

  // Simulate live updates with random vote increments
  useEffect(() => {
    if (votingStatus?.isActive) {
      const interval = setInterval(() => {
        // This would normally fetch from blockchain
        // For demo purposes, we'll simulate vote updates
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [votingStatus]);

  const getVotePercentage = (voteCount, total) => {
    if (total === 0) return 0;
    return ((voteCount / total) * 100).toFixed(1);
  };

  const sortedCandidates = candidates ? [...candidates].sort((a, b) => b.voteCount - a.voteCount) : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('liveResults')}</h2>
          <p className="text-gray-600 text-lg">
            {votingStatus?.isActive ? t('votingInProgress') : t('votingEnded')}
          </p>
        </div>
      </div>

      {/* Winner Display */}
      {!votingStatus?.isActive && winner && totalVotes > 0 && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-8 text-white">
          <div className="text-center">
            <Trophy className="mx-auto h-16 w-16 mb-6" />
            <h3 className="text-3xl font-bold mb-4">
              🎉 {t('winner')}!
            </h3>
            <div className="bg-white bg-opacity-20 rounded-xl p-6 inline-block backdrop-blur-sm">
              <h4 className="text-2xl font-bold">{winner.name}</h4>
              <p className="text-xl opacity-90">
                {winner.voteCount} amatora ({getVotePercentage(winner.voteCount, totalVotes)}%)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('totalVotes')}</p>
              <p className="text-3xl font-bold text-gray-900">{totalVotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('candidates')}</p>
              <p className="text-3xl font-bold text-gray-900">{candidates?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              votingStatus?.isActive ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <BarChart3 className={`h-6 w-6 ${
                votingStatus?.isActive ? 'text-green-600' : 'text-gray-600'
              }`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className={`text-lg font-bold ${
                votingStatus?.isActive ? 'text-green-600' : 'text-gray-600'
              }`}>
                {votingStatus?.isActive ? 'Arakora' : 'Yarangiye'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Results */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Ibisubizo by'Abakandida
        </h3>

        {sortedCandidates.length > 0 ? (
          <div className="space-y-6">
            {sortedCandidates.map((candidate, index) => {
              const percentage = getVotePercentage(candidate.voteCount, totalVotes);
              const isWinner = !votingStatus?.isActive && winner && candidate.id === winner.id;

              return (
                <div
                  key={candidate.id}
                  className={`border-2 rounded-2xl p-6 transition-all duration-300 ${
                    isWinner
                      ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                        index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                          <img
                            src={candidate.imageUrl || '/api/placeholder/64/64'}
                            alt={candidate.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/api/placeholder/64/64';
                            }}
                          />
                        </div>

                        <div>
                          <h5 className="text-xl font-bold text-gray-900 flex items-center">
                            {candidate.name}
                            {isWinner && <Trophy className="h-5 w-5 text-yellow-500 ml-2" />}
                          </h5>
                          <p className="text-gray-600">Umukandida #{candidate.id}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">{candidate.voteCount}</p>
                      <p className="text-lg text-gray-600">{percentage}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                        isWinner
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                          : index === 0
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                            : index === 1
                              ? 'bg-gradient-to-r from-green-500 to-green-600'
                              : 'bg-gradient-to-r from-purple-500 to-purple-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Nta bisubizo bihari ubu</p>
          </div>
        )}

        {/* Live Updates Notice */}
        {votingStatus?.isActive && (
          <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-blue-800 font-medium">
                <strong>Ibisubizo mu gihe nyacyo:</strong> Ibi bisubizo biravugururwa mu gihe nyacyo
                iyo amatora akomeje. Ibisubizo byanyuma bizaboneka iyo amatora arangiye.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
