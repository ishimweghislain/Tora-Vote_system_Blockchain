import React, { useState, useEffect } from 'react';
import { Trophy, Star, TrendingUp, Users, Award, Flag } from 'lucide-react';
import { t } from '../utils/translations';

function WinnerAnnouncement({ candidates, votingStatus }) {
  const [winner, setWinner] = useState(null);
  const [finalResults, setFinalResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching final results from blockchain
    setTimeout(() => {
      const results = candidates.map(c => ({
        ...c,
        voteCount: Math.floor(Math.random() * 200) + 100,
        percentage: 0
      }));
      
      // Calculate percentages
      const totalVotes = results.reduce((sum, c) => sum + c.voteCount, 0);
      results.forEach(c => {
        c.percentage = ((c.voteCount / totalVotes) * 100).toFixed(1);
      });
      
      // Sort by vote count
      results.sort((a, b) => b.voteCount - a.voteCount);
      
      setFinalResults(results);
      setWinner(results[0]);
      setLoading(false);
    }, 2000);
  }, [candidates]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Calculating final results...</p>
      </div>
    );
  }

  if (!winner) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-600">No winner data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Winner Celebration */}
      <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-2 border-yellow-300 rounded-2xl p-8 text-center">
        <div className="relative">
          {/* Confetti Effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-yellow-900 mb-4">
              🎉 {t('winner.congratulations')} 🎉
            </h1>
            
            <h2 className="text-3xl font-bold text-orange-800 mb-2">
              {winner.name}
            </h2>
            
            <p className="text-xl text-orange-700 mb-6">
              {t('winner.newPresident')}
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-orange-800">
              <div className="text-center">
                <p className="text-sm font-medium">{t('winner.totalVotes')}</p>
                <p className="text-3xl font-bold">{winner.voteCount}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{t('winner.percentage')}</p>
                <p className="text-3xl font-bold">{winner.percentage}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Statistics */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('winner.finalStatistics')}</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-600 font-medium">{t('winner.totalCandidates')}</p>
            <p className="text-2xl font-bold text-blue-900">{finalResults.length}</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-600 font-medium">{t('winner.totalVotesCast')}</p>
            <p className="text-2xl font-bold text-green-900">
              {finalResults.reduce((sum, c) => sum + c.voteCount, 0)}
            </p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-600 font-medium">{t('winner.winningMargin')}</p>
            <p className="text-2xl font-bold text-purple-900">
              {finalResults.length > 1 ? 
                `${winner.voteCount - finalResults[1].voteCount}` : 
                winner.voteCount
              }
            </p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-600 font-medium">{t('winner.voterTurnout')}</p>
            <p className="text-2xl font-bold text-yellow-900">
              {Math.floor(Math.random() * 20) + 70}%
            </p>
          </div>
        </div>
        
        {/* Final Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">{t('winner.rank')}</th>
                <th className="px-6 py-3">{t('winner.candidate')}</th>
                <th className="px-6 py-3">{t('winner.votes')}</th>
                <th className="px-6 py-3">{t('winner.percentage')}</th>
                <th className="px-6 py-3">{t('winner.status')}</th>
              </tr>
            </thead>
            <tbody>
              {finalResults.map((candidate, index) => (
                <tr key={candidate.id} className={`border-b ${
                  index === 0 ? 'bg-yellow-50' : 'bg-white'
                }`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {index === 0 && <Trophy className="h-5 w-5 text-yellow-600" />}
                      <span className={`font-bold ${
                        index === 0 ? 'text-yellow-600' : 'text-gray-700'
                      }`}>
                        #{index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={candidate.imageUrl}
                        alt={candidate.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className={`font-semibold ${
                        index === 0 ? 'text-yellow-800' : 'text-gray-900'
                      }`}>
                        {candidate.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono">{candidate.voteCount}</td>
                  <td className="px-6 py-4 font-semibold">{candidate.percentage}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      index === 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {index === 0 ? t('winner.winner') : t('winner.candidate')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
            <Flag className="h-5 w-5" />
            <span className="font-medium">{t('winner.rwandaElection')}</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            {t('winner.blockchainVerified')}
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>🔒 {t('winner.immutable')}</span>
            <span>👁️ {t('winner.transparent')}</span>
            <span>✅ {t('winner.verified')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WinnerAnnouncement; 