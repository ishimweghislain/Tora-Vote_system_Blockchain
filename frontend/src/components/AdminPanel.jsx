import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Shield, UserPlus, Users, Eye, Search, Edit, Trash2, LogOut, MapPin, User, CreditCard, Info } from 'lucide-react';
import { t } from '../utils/translations';

function AdminPanel({ isAuthenticated, setIsAuthenticated, votingStatus, onStatusChange }) {
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  const [voterForm, setVoterForm] = useState({
    rwandanId: '',
    fullName: '',
    gender: 'Male',
    villageId: ''
  });
  const [voters, setVoters] = useState([]);
  const [villages, setVillages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVoter, setEditingVoter] = useState(null);
  const [loading, setLoading] = useState(false);

  // Hardcoded admin credentials
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = '123';

  // Fetch voters and villages when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchVoters();
      fetchVillages();
    }
  }, [isAuthenticated]);

  const fetchVoters = async () => {
    try {
      console.log('🔍 Fetching voters from /api/voters...');
      const response = await fetch('/api/voters');
      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const voters = await response.json();
        console.log('✅ Voters fetched successfully:', voters.length);
        setVoters(voters);
      } else {
        console.error('❌ Failed to fetch voters:', response.status, response.statusText);
        toast.error(t('error.cantFindVoters'));
        setVoters([]);
      }
    } catch (error) {
      console.error('❌ Error fetching voters:', error);
      toast.error(t('error.cantFindVoters'));
      setVoters([]);
    }
  };

  const fetchVillages = async () => {
    try {
      console.log('🔍 Fetching villages from /api/villages...');
      const response = await fetch('/api/villages');
      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Villages fetched successfully:', data.length);
        setVillages(data);
      } else {
        console.error('❌ Failed to fetch villages:', response.status, response.statusText);
        toast.error(t('error.cantFindVillages'));
        setVillages([]);
      }
    } catch (error) {
      console.error('❌ Error fetching villages:', error);
      toast.error(t('error.cantFindVillages'));
      setVillages([]);
    }
  };

  const handleAdminLogin = () => {
    if (adminCredentials.username === ADMIN_USERNAME && adminCredentials.password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('Winjiye neza mu buyobozi');
    } else {
      toast.error('Izina cyangwa ijambo ry\'ibanga si byo');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminCredentials({ username: '', password: '' });
    toast.success('Wasohotse neza');
  };

  const handleVoterSubmit = async (e) => {
    e.preventDefault();
    
    if (!voterForm.rwandanId || !voterForm.fullName || !voterForm.gender || !voterForm.villageId) {
      toast.error('Uzuza amagambo yose');
      return;
    }

    // Validate Rwandan ID (16 digits)
    if (voterForm.rwandanId.length !== 16 || !/^\d+$/.test(voterForm.rwandanId)) {
      toast.error('Indangamuntu igomba kuba imibare 16');
      return;
    }

    setLoading(true);
    try {
      // Save voter to backend database
      const response = await fetch('/api/voters/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rwandanId: voterForm.rwandanId,
          fullName: voterForm.fullName,
          gender: voterForm.gender,
          villageId: voterForm.villageId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register voter');
      }

      toast.success('Umutora yanditswe neza');
      setVoterForm({ rwandanId: '', fullName: '', gender: 'Male', villageId: '' });
      
      // Refresh voters list
      await fetchVoters();
      onStatusChange();
    } catch (error) {
      toast.error(error.message || 'Ntibyashoboye kwandikisha umutora');
    } finally {
      setLoading(false);
    }
  };

  const handleEditVoter = (voter) => {
    setEditingVoter(voter);
    setVoterForm({ 
      rwandanId: voter.rwandanId, 
      fullName: voter.fullName,
      gender: voter.gender || 'Male',
      villageId: voter.village?._id || ''
    });
  };

  const handleUpdateVoter = async (e) => {
    e.preventDefault();
    
    if (!voterForm.rwandanId || !voterForm.fullName || !voterForm.gender || !voterForm.villageId) {
      toast.error('Uzuza amagambo yose');
      return;
    }

    setLoading(true);
    try {
      // Update voter in backend database
      const response = await fetch(`/api/voters/${editingVoter.rwandanId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: voterForm.fullName,
          gender: voterForm.gender,
          villageId: voterForm.villageId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update voter');
      }

      toast.success('Amakuru y\'umutora avuguruwe neza');
      setEditingVoter(null);
      setVoterForm({ rwandanId: '', fullName: '', gender: 'Male', villageId: '' });
      
      // Refresh voters list
      await fetchVoters();
    } catch (error) {
      toast.error(error.message || 'Ntibyashoboye kuvugurura umutora');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoter = async (voterId) => {
    if (window.confirm('Uzi neza ko ushaka gusiba uyu mutora?')) {
      try {
        const response = await fetch(`/api/voters/${voterId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          toast.success('Umutora yasibwe neza');
          await fetchVoters();
        } else {
          throw new Error('Failed to delete voter');
        }
      } catch (error) {
        toast.error('Ntibyashoboye gusiba umutora');
      }
    }
  };

  const filteredVoters = voters.filter(voter =>
    voter.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.rwandanId.includes(searchTerm)
  );

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kwinjira mu Buyobozi</h2>
          <p className="text-gray-600 mb-6">Injiza izina ryawe n'ijambo ry'ibanga</p>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Izina"
              value={adminCredentials.username}
              onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Ijambo ry'ibanga"
              value={adminCredentials.password}
              onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAdminLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Injira
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ikibaho cy'Ubuyobozi</h2>
              <p className="text-gray-600">Gucunga abatora n'amatora</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sohoka
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Abatora</p>
                <p className="text-2xl font-bold text-blue-900">{voters.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl">
            <div className="flex items-center space-x-3">
              <Eye className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-green-600 font-medium">Status y'Amatora</p>
                <p className="text-2xl font-bold text-green-900">
                  {votingStatus?.isActive ? 'Turacyatora' : 'Ntabwo arakora'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-xl">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-yellow-600 font-medium">Abakandida</p>
                <p className="text-2xl font-bold text-yellow-900">{votingStatus?.totalCandidates || 3}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voter Registration Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {editingVoter ? 'Guhindura Amakuru y\'Uzatora' : 'Kwandikisha Uzatora'}
          </h3>
          <p className="text-gray-600">Injiza amakuru y'uzatora neza</p>
        </div>

        <form onSubmit={editingVoter ? handleUpdateVoter : handleVoterSubmit} className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <CreditCard className="h-4 w-4 inline mr-2 text-purple-600" />
                Indangamuntu y'u Rwanda
              </label>
              <input
                type="text"
                placeholder="1234567890123456"
                value={voterForm.rwandanId}
                onChange={(e) => setVoterForm({...voterForm, rwandanId: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                maxLength="16"
                required
              />
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <Info className="h-3 w-3 mr-1" />
                Injiza imibare 16 y'indangamuntu
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2 text-purple-600" />
                Amazina yose
              </label>
              <input
                type="text"
                placeholder="Injiza amazina yose"
                value={voterForm.fullName}
                onChange={(e) => setVoterForm({...voterForm, fullName: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Users className="h-4 w-4 inline mr-2 text-purple-600" />
                Ubwoko
              </label>
              <select
                value={voterForm.gender}
                onChange={(e) => setVoterForm({...voterForm, gender: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              >
                <option value="Male">👨 Umugabo</option>
                <option value="Female">👩 Umugore</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-2 text-purple-600" />
                Umudugudu
              </label>
              <select
                value={voterForm.villageId}
                onChange={(e) => setVoterForm({...voterForm, villageId: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              >
              <option value="">Hitamo umudugudu</option>
              {villages.map((village) => (
                <option key={village._id} value={village._id}>
                  {village.name}, {village.district}
                </option>
              ))}
            </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>{editingVoter ? 'Vugurura Amakuru' : 'Andikisha Uzatora'}</span>
                </>
              )}
            </button>
          
            {editingVoter && (
              <button
                type="button"
                onClick={() => {
                  setEditingVoter(null);
                  setVoterForm({ rwandanId: '', fullName: '', gender: 'Male', villageId: '' });
                }}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Edit className="h-5 w-5" />
                <span>Hagarika</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Voters Table with Search */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Abatora Banditswe
              </h3>
              <p className="text-gray-600 text-sm">Urutonde rw'abatora bose</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Shakisha abatora..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white w-full md:w-80"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="text-xs font-semibold text-gray-700 uppercase bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-purple-700">📋 Indangamuntu</th>
                <th className="px-6 py-4 text-purple-700">👤 Amazina</th>
                <th className="px-6 py-4 text-purple-700">⚧ Ubwoko</th>
                <th className="px-6 py-4 text-purple-700">🏘 Umudugudu</th>
                <th className="px-6 py-4 text-purple-700">⚙ Ibikorwa</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredVoters.map((voter, index) => (
                <tr key={voter._id} className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="px-6 py-4 font-mono text-gray-800 font-semibold">{voter.rwandanId}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{voter.fullName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${voter.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                      {voter.gender === 'Male' ? '👨 Umugabo' : '👩 Umugore'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      🏘 {voter.village?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditVoter(voter)}
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                        title="Hindura"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVoter(voter.rwandanId)}
                        className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                        title="Siba"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredVoters.length === 0 && (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                {searchTerm ? 'Nta mutora abonetse' : 'Nta batora bahari'}
              </h4>
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'Gerageza gushakisha izindi nyandiko' : 'Tangira wandikishe abatora'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
