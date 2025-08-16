import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Users,
  Play,
  Square,
  Plus,
  Lock,
  Eye,
  EyeOff,
  Search,
  Edit,
  Save,
  X,
  Trash2,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { t } from '../utils/translations';

const AdminPanel = ({ isAuthenticated, setIsAuthenticated, votingStatus, onStatusChange }) => {
  // Authentication state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Voter management state
  const [voters, setVoters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVoter, setEditingVoter] = useState(null);
  const [newVoter, setNewVoter] = useState({
    rwandanId: '',
    fullName: '',
    gender: '',
    address: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Initialize with dummy voters
  useEffect(() => {
    setVoters([
      {
        id: '1234567890123456',
        rwandanId: '1234567890123456',
        fullName: 'UWIMANA Jean',
        gender: 'Male',
        address: '0x1234567890123456789012345678901234567890'
      },
      {
        id: '1234567890123457',
        rwandanId: '1234567890123457',
        fullName: 'MUKAMANA Marie',
        gender: 'Female',
        address: '0x1234567890123456789012345678901234567891'
      }
    ]);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '123') {
      setIsAuthenticated(true);
      toast.success(t('success.loginSuccess'));
    } else {
      toast.error(t('error.invalidCredentials'));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const validateRwandanId = (id) => {
    return /^\d{16}$/.test(id);
  };

  const handleAddVoter = (e) => {
    e.preventDefault();

    // Validation
    if (!newVoter.rwandanId || !validateRwandanId(newVoter.rwandanId)) {
      toast.error(t('validation.idInvalid'));
      return;
    }
    if (!newVoter.fullName.trim()) {
      toast.error(t('validation.nameRequired'));
      return;
    }
    if (!newVoter.gender) {
      toast.error(t('validation.genderRequired'));
      return;
    }
    if (!newVoter.address.trim()) {
      toast.error(t('validation.addressRequired'));
      return;
    }

    // Check if ID already exists
    if (voters.find(v => v.rwandanId === newVoter.rwandanId)) {
      toast.error('Voter with this ID already exists');
      return;
    }

    const voter = {
      id: newVoter.rwandanId,
      ...newVoter
    };

    setVoters([...voters, voter]);
    setNewVoter({ rwandanId: '', fullName: '', gender: '', address: '' });
    setShowAddForm(false);
    toast.success(t('success.voterRegistered'));
  };

  const handleUpdateVoter = (voter) => {
    setEditingVoter({ ...voter });
  };

  const handleSaveVoter = () => {
    if (!editingVoter.fullName.trim()) {
      toast.error(t('validation.nameRequired'));
      return;
    }
    if (!editingVoter.gender) {
      toast.error(t('validation.genderRequired'));
      return;
    }

    setVoters(voters.map(v =>
      v.id === editingVoter.id ? editingVoter : v
    ));
    setEditingVoter(null);
    toast.success(t('success.voterUpdated'));
  };

  const handleDeleteVoter = (voterId) => {
    if (window.confirm('Are you sure you want to delete this voter?')) {
      setVoters(voters.filter(v => v.id !== voterId));
      toast.success(t('success.voterDeleted'));
    }
  };

  const filteredVoters = voters.filter(voter =>
    voter.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.rwandanId.includes(searchTerm)
  );

  // Login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t('adminLogin')}</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('username')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {t('login')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">{t('adminPanel')}</h2>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            {t('logout')}
          </button>
        </div>
      </div>

      {/* Voter Management */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-2 text-blue-600" />
            {t('voterManagement')}
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {t('registerVoter')}
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Add Voter Form */}
        {showAddForm && (
          <div className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">{t('registerVoter')}</h4>
            <form onSubmit={handleAddVoter} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('rwandanId')} *
                </label>
                <input
                  type="text"
                  value={newVoter.rwandanId}
                  onChange={(e) => setNewVoter({...newVoter, rwandanId: e.target.value})}
                  placeholder="1234567890123456"
                  maxLength="16"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  value={newVoter.fullName}
                  onChange={(e) => setNewVoter({...newVoter, fullName: e.target.value})}
                  placeholder="UWIMANA Jean"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('gender')} *
                </label>
                <select
                  value={newVoter.gender}
                  onChange={(e) => setNewVoter({...newVoter, gender: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">{t('gender')}</option>
                  <option value="Male">{t('male')}</option>
                  <option value="Female">{t('female')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('voterAddress')} *
                </label>
                <input
                  type="text"
                  value={newVoter.address}
                  onChange={(e) => setNewVoter({...newVoter, address: e.target.value})}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2 flex space-x-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t('register')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Voters List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('rwandanId')}</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('fullName')}</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('gender')}</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVoters.map((voter) => (
                <tr key={voter.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">{voter.rwandanId}</td>
                  <td className="py-3 px-4">
                    {editingVoter?.id === voter.id ? (
                      <input
                        type="text"
                        value={editingVoter.fullName}
                        onChange={(e) => setEditingVoter({...editingVoter, fullName: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      voter.fullName
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingVoter?.id === voter.id ? (
                      <select
                        value={editingVoter.gender}
                        onChange={(e) => setEditingVoter({...editingVoter, gender: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="Male">{t('male')}</option>
                        <option value="Female">{t('female')}</option>
                      </select>
                    ) : (
                      voter.gender === 'Male' ? t('male') : t('female')
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {editingVoter?.id === voter.id ? (
                        <>
                          <button
                            onClick={handleSaveVoter}
                            className="text-green-600 hover:text-green-800 p-1"
                            title={t('save')}
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingVoter(null)}
                            className="text-gray-600 hover:text-gray-800 p-1"
                            title={t('cancel')}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleUpdateVoter(voter)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title={t('update')}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVoter(voter.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title={t('delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredVoters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No voters found matching your search.' : 'No voters registered yet.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
