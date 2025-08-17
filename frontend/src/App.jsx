import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Vote, Shield, BarChart3, Users, Lock, Eye, CheckCircle, Trophy, Clock } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import VotingInterface from './components/VotingInterface';
import ResultsDisplay from './components/ResultsDisplay';
import WinnerAnnouncement from './components/WinnerAnnouncement';

import LanguageSwitcher from './components/LanguageSwitcher';
import { t } from './utils/multilingualTranslations';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [votingStatus, setVotingStatus] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [showDeadlinePopup, setShowDeadlinePopup] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [forceRerender, setForceRerender] = useState(0);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setForceRerender(prev => prev + 1);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  // Fetch real candidate data from backend
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('/api/candidates');
        if (response.ok) {
          const candidatesData = await response.json();
          // Transform to match expected format
          const formattedCandidates = candidatesData.map(candidate => ({
            id: candidate.candidateId,
            name: candidate.name,
            imageUrl: candidate.imageUrl,
            party: candidate.party,
            description: candidate.description,
            voteCount: 0 // Will be updated from results
          }));
          setCandidates(formattedCandidates);
        } else {
          console.error('Failed to fetch candidates');
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
    
    // Set initial voting status with deadline 17/08/2025 15:00
    const deadline = new Date('2025-08-17T15:00:00');
    setVotingStatus({ 
      isActive: true, 
      totalCandidates: 3, 
      totalVotesCast: 0,
      deadline: deadline
    });

    // Update countdown every second
    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.max(0, deadline.getTime() - now);
      setTimeRemaining(remaining);
    }, 1000);

    // Show deadline popup every 30 seconds
    const deadlineInterval = setInterval(() => {
      setShowDeadlinePopup(true);
      setTimeout(() => setShowDeadlinePopup(false), 5000); // Hide after 5 seconds
    }, 30000);

    return () => {
      clearInterval(deadlineInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const handleStatusChange = () => {
    // Refresh data
  };

  const handleVoteSubmitted = async () => {
    // Fetch updated vote data from backend
    try {
      const response = await fetch('/api/votes/results');
      if (response.ok) {
        const data = await response.json();
        // Update candidates with real vote counts
        setCandidates(data.candidates.map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          imageUrl: candidate.imageUrl,
          voteCount: candidate.voteCount,
          percentage: candidate.percentage
        })));

        // Update voting status with real data
        setVotingStatus(prev => ({
          ...prev,
          totalVotesCast: data.totalVotes
        }));
      }
    } catch (error) {
      console.error('Error fetching updated results:', error);
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

  const tabs = [
    { id: 'home', label: t('home'), icon: Vote },
    { id: 'about', label: t('about'), icon: Users },
    { id: 'admin', label: t('admin'), icon: Shield },
    { id: 'vote', label: t('vote'), icon: Vote },
    { id: 'results', label: t('results'), icon: BarChart3 },
    { id: 'winner', label: t('winner'), icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Toaster position="top-right" />

      {/* Animated Deadline Popup */}
      {showDeadlinePopup && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <div className="bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg border-2 border-yellow-600">
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 animate-pulse" />
              <div>
                <p className="font-bold">Umunsi wa nyuma wo gutora!</p>
                <p className="text-sm">17/08/2025 saa kenda (15:00)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 lg:py-6">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Vote className="h-5 w-5 lg:h-7 lg:w-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  {t('appName')}
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 font-medium">{t('appDescription')}</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Tora
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-3">
              {/* Language Switcher */}
              <div className="order-last sm:order-first">
                <LanguageSwitcher />
              </div>

              <div className="hidden md:flex items-center space-x-2 bg-yellow-100 px-2 lg:px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-xs lg:text-sm font-medium text-yellow-800">Rwanda 🇷🇼</span>
              </div>

              {/* Header Deadline Countdown */}
              <div className="flex items-center space-x-1 lg:space-x-2 bg-red-100 px-2 lg:px-3 py-1 lg:py-2 rounded-full">
                <Clock className="h-3 w-3 lg:h-4 lg:w-4 text-red-600" />
                <div className="text-right">
                  <p className="text-xs text-red-600 font-medium hidden lg:block">Deadline</p>
                  <p className="text-xs lg:text-sm font-bold text-red-800 font-mono">
                    {formatTimeRemaining(timeRemaining).split(' ')[0]}
                  </p>
                </div>
              </div>

              {votingStatus?.isActive && (
                <span className="hidden lg:inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
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
            <nav className="flex flex-wrap sm:flex-nowrap">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-0 flex items-center justify-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-6 font-medium text-xs sm:text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="hidden xs:inline sm:inline truncate">{tab.label}</span>
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
              <div className="text-center py-8 sm:py-12 lg:py-16 bg-white rounded-2xl shadow-xl border border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl">
                    <Vote className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4 sm:mb-6">
                    {t('welcomeTitle')}
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                    {t('welcomeSubtitle')}
                  </p>

                  {/* Project Description */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 mb-8 border border-blue-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">🇷🇼 Ibyerekeye Porogaramu Yacu</h2>
                    <div className="text-left space-y-4 text-gray-700">
                      <p className="text-lg leading-relaxed">
                        <strong>Tora</strong> ni sisitemu y'amatora igezweho yakozwe n'ubuhanga bwa <strong>Blockchain</strong>
                        kugirango itange amatora y'umutekano, asobanura kandi adashobora guhindurwa mu Rwanda.
                      </p>

                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                          <h3 className="font-semibold text-blue-700 mb-2">🔒 Umutekano Mukomeye</h3>
                          <p className="text-sm">Amatora yawe aracungwa n'uburyo bw'umutekano bukomeye bwa blockchain, bidashobora guhindurwa cyangwa gukorerwa ubujiji.</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                          <h3 className="font-semibold text-green-700 mb-2">👁️ Ubunyangamugayo</h3>
                          <p className="text-sm">Ibisubizo byose bishobora kubonwa n'abantu bose mu gihe nyacyo, bituma amatora aba asobanura kandi afatika.</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100">
                          <h3 className="font-semibold text-yellow-700 mb-2">✅ Bidashobora Guhindurwa</h3>
                          <p className="text-sm">Buri itora rikorerwa ku blockchain, bituma ridashobora guhindurwa kandi rishobora kugenzurwa n'abantu bose.</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                          <h3 className="font-semibold text-purple-700 mb-2">🚀 Tekinoroji Igezweho</h3>
                          <p className="text-sm">Dukoresha tekinoroji igezweho ya React, Node.js na Ethereum blockchain kugirango dutange serivisi nziza.</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg mt-6 border border-green-200">
                        <p className="text-center font-semibold text-gray-800">
                          🌟 <strong>"Tora ni intambwe ikomeye mu iterambere ry'amatora y'u Rwanda -
                          amatora y'umutekano, asobanura kandi adashobora guhindurwa."</strong> 🌟
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Prominent Deadline Countdown */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-8 mb-8 max-w-3xl mx-auto animate-pulse">
                    <div className="flex items-center justify-center space-x-3 text-red-800 mb-4">
                      <Clock className="h-8 w-8 animate-bounce" />
                      <span className="text-2xl font-bold">
                        Umunsi wa nyuma wo gutora!
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-lg text-red-700 mb-3">
                        17/08/2025 saa kenda (15:00)
                      </p>
                      <div className="bg-white rounded-lg p-4 inline-block shadow-lg">
                        <p className="text-sm text-red-600 font-medium mb-2">Igihe gisigaye:</p>
                        <p className="text-3xl font-bold text-red-800 font-mono">
                          {formatTimeRemaining(timeRemaining)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                    <button
                      onClick={() => setActiveTab('vote')}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
                    >
                      <Vote className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>🗳️ {t('vote')}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('results')}
                      className="flex items-center space-x-2 bg-white text-blue-600 border-2 border-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 text-sm sm:text-base"
                    >
                      <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>📊 {t('results')}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('about')}
                      className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
                    >
                      <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>ℹ️ {t('about')}</span>
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

          {activeTab === 'winner' && (
            <WinnerAnnouncement
              candidates={candidates}
              votingStatus={votingStatus}
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
              <p>© 2025 {t('appName')} - Sisitemu y'Amatora y'u Rwanda</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
