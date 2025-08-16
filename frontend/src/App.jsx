import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Vote, Shield, BarChart3, Users, Lock, Eye, CheckCircle } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import VotingInterface from './components/VotingInterface';
import ResultsDisplay from './components/ResultsDisplay';
import { t } from './utils/translations';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [votingStatus, setVotingStatus] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);

  // Initialize with dummy data for the three candidates
  useEffect(() => {
    setCandidates([
      {
        id: 1,
        name: 'KAGAME PAUL',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        voteCount: Math.floor(Math.random() * 100) + 50
      },
      {
        id: 2,
        name: 'ANDY ISHIMWE',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        voteCount: Math.floor(Math.random() * 80) + 30
      },
      {
        id: 3,
        name: 'ISHIMWE GHISLAIN',
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        voteCount: Math.floor(Math.random() * 70) + 25
      }
    ]);
    setVotingStatus({ isActive: true, totalCandidates: 3, totalVotesCast: 0 });
  }, []);

  const handleStatusChange = () => {
    // Refresh voting data
  };

  const handleVoteSubmitted = () => {
    // Refresh voting data after vote
  };

  const tabs = [
    { id: 'home', label: t('home'), icon: Vote },
    { id: 'about', label: t('about'), icon: Users },
    { id: 'admin', label: t('admin'), icon: Shield },
    { id: 'vote', label: t('vote'), icon: Vote },
    { id: 'results', label: t('results'), icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Vote className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  {t('appName')}
                </h1>
                <p className="text-sm text-gray-600 font-medium">{t('appDescription')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-yellow-800">Rwanda 🇷🇼</span>
              </div>
              {votingStatus?.isActive && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  {t('status.connected')}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'home' && (
            <div className="space-y-12">
              {/* Hero Section */}
              <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-gray-200">
                <div className="max-w-4xl mx-auto px-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Vote className="h-10 w-10 text-white" />
                  </div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
                    {t('welcomeTitle')}
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {t('welcomeSubtitle')}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => setActiveTab('vote')}
                      className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      {t('vote')} {t('appName')}
                    </button>
                    <button
                      onClick={() => setActiveTab('results')}
                      className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200"
                    >
                      {t('results')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('aboutTitle')}</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {t('aboutDescription')}
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center p-6 bg-blue-50 rounded-xl">
                    <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('aboutFeatures.security')}</h3>
                    <p className="text-gray-600">{t('aboutFeatures.securityDesc')}</p>
                  </div>

                  <div className="text-center p-6 bg-green-50 rounded-xl">
                    <Eye className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('aboutFeatures.transparency')}</h3>
                    <p className="text-gray-600">{t('aboutFeatures.transparencyDesc')}</p>
                  </div>

                  <div className="text-center p-6 bg-yellow-50 rounded-xl">
                    <CheckCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('aboutFeatures.immutable')}</h3>
                    <p className="text-gray-600">{t('aboutFeatures.immutableDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <AdminPanel
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              votingStatus={votingStatus}
              onStatusChange={handleStatusChange}
            />
          )}

          {activeTab === 'vote' && (
            <VotingInterface
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
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-green-600 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Vote className="h-6 w-6" />
              <span className="text-xl font-bold">{t('appName')}</span>
            </div>
            <p className="text-blue-100 mb-2">{t('appDescription')}</p>
            <div className="flex justify-center space-x-6 text-sm text-blue-100">
              <span>🔒 {t('aboutFeatures.security')}</span>
              <span>👁️ {t('aboutFeatures.transparency')}</span>
              <span>✅ {t('aboutFeatures.immutable')}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-500 text-xs text-blue-200">
              <p>© 2024 {t('appName')} - Sisitemu y'Amatora y'u Rwanda</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
