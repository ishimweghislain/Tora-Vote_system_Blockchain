import React, { useState, useRef } from 'react';
import {
  Vote,
  CheckCircle,
  AlertCircle,
  Camera,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  User,
  Shield,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { t } from '../utils/translations';

const VotingInterface = ({ votingStatus, candidates, onVoteSubmitted }) => {
  const [currentStep, setCurrentStep] = useState('rules'); // rules, id-input, camera, candidates, confirmation
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [rwandanId, setRwandanId] = useState('');
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [voterInfo, setVoterInfo] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Mock registered voters (in real app, this would come from admin/blockchain)
  const registeredVoters = [
    { rwandanId: '1234567890123456', fullName: 'John Doe' },
    { rwandanId: '2345678901234567', fullName: 'Jane Smith' }
  ];

  const validateRwandanId = (id) => {
    return /^\d{16}$/.test(id);
  };

  const checkVoterRegistration = (id) => {
    return registeredVoters.find(voter => voter.rwandanId === id);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      toast.error('Camera access denied or not available');
      // Simulate camera for demo
      setCameraActive(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const photoDataUrl = canvas.toDataURL('image/jpeg');
      setPhotoData(photoDataUrl);
      setPhotoTaken(true);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setPhotoTaken(false);
    setPhotoData(null);
    startCamera();
  };

  const handleProceedFromRules = () => {
    if (!rulesAccepted) {
      toast.error('Please accept the voting rules to continue');
      return;
    }
    setCurrentStep('id-input');
  };

  const handleIdSubmit = () => {
    if (!validateRwandanId(rwandanId)) {
      toast.error('Indangamuntu si nziza. Injiza imibare 16.');
      return;
    }

    // Check if voter is registered
    const registeredVoter = checkVoterRegistration(rwandanId);
    if (!registeredVoter) {
      toast.error('Ntibyemewe gutora. Indangamuntu yawe ntiyanditswe na buyobozi.');
      return;
    }

    setVoterInfo(registeredVoter);
    setCurrentStep('camera');
  };

  const handleCameraConfirm = () => {
    if (!photoTaken) {
      toast.error('Please take a photo for verification');
      return;
    }
    setCurrentStep('candidates');
  };

  const submitVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }

    setIsVoting(true);
    try {
      // Simulate vote submission
      toast.success('Itora ryawe ryoherejwe neza!');
      onVoteSubmitted?.();
      setCurrentStep('confirmation');
    } catch (error) {
      toast.error('Ntibyashoboye gutora. Ongera ugerageze.');
    } finally {
      setIsVoting(false);
    }
  };

  if (!votingStatus?.isActive) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
        <Clock className="mx-auto h-16 w-16 text-gray-400 mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Amatora ntabwo arakora
        </h3>
        <p className="text-gray-600 text-lg">
          Tegereza ubuyobozi butangire amatora.
        </p>
      </div>
    );
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-gray-400 mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Nta bakandida bahari
        </h3>
        <p className="text-gray-600 text-lg">
          Nta bakandida bo gutora ubu.
        </p>
      </div>
    );
  }

  // Step 1: Rules and Regulations (Amabwiriza)
  if (currentStep === 'rules') {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <Shield className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Amategeko n'Amabwiriza y'Amatora</h2>
          <p className="text-gray-600">Soma amategeko mbere yo gutora</p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Amategeko y'Amatora</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-blue-800">Ugomba kuba ufite indangamuntu y'u Rwanda ifatika</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-blue-800">Buri muntu ashobora gutora rimwe gusa</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-blue-800">Hitamo umukandida umwe gusa</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-blue-800">Amatora yawe ni amabanga kandi aracungwa</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-blue-800">Ntushobora guhindura itora ryawe nyuma y'uko uryemeje</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <input
              type="checkbox"
              id="rulesAccepted"
              checked={rulesAccepted}
              onChange={(e) => setRulesAccepted(e.target.checked)}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="rulesAccepted" className="text-yellow-800 font-medium">
              Nemeye amategeko y'amatora
            </label>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleProceedFromRules}
            disabled={!rulesAccepted}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
              rulesAccepted
                ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Komeza utore <ArrowRight className="inline h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // Step 2: ID Input
  if (currentStep === 'id-input') {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <User className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Injiza Indangamuntu Yawe</h2>
          <p className="text-gray-600">Injiza indangamuntu yawe y'u Rwanda</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <label className="block text-lg font-medium text-gray-700 mb-4">
            Indangamuntu y'u Rwanda
          </label>
          <input
            type="text"
            value={rwandanId}
            onChange={(e) => setRwandanId(e.target.value.replace(/\D/g, '').slice(0, 16))}
            placeholder="1234567890123456"
            className="w-full px-6 py-4 text-xl text-center border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            maxLength="16"
          />
          <p className="text-sm text-gray-500 mt-2 text-center">
            Injiza imibare 16 y'indangamuntu yawe
          </p>

          <div className="flex space-x-4 mt-8">
            <button
              onClick={() => setCurrentStep('rules')}
              className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" /> Inyuma
            </button>
            <button
              onClick={handleIdSubmit}
              disabled={!validateRwandanId(rwandanId)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                validateRwandanId(rwandanId)
                  ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Komeza <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Camera Verification
  if (currentStep === 'camera') {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <Camera className="mx-auto h-16 w-16 text-purple-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Kugenzura Umwirondoro</h2>
          <p className="text-gray-600">Fata ifoto yawe kugirango tugenzure umwirondoro</p>
        </div>
        
        <div className="max-w-md mx-auto">
          {!photoTaken ? (
            <div className="space-y-6">
              <div className="relative bg-gray-100 rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                {!cameraActive ? (
                  <button
                    onClick={startCamera}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
                  >
                    <Camera className="h-5 w-5 mr-2" /> Tangira Kamera
                  </button>
                ) : (
                  <button
                    onClick={takePhoto}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Camera className="h-5 w-5 mr-2" /> Fata Ifoto
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative bg-gray-100 rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img src={photoData} alt="Captured" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={retakePhoto}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center"
                >
                  <RotateCcw className="h-5 w-5 mr-2" /> Ongera Ufate Ifoto
                </button>
                <button
                  onClick={handleCameraConfirm}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                >
                  Emeza Umwirondoro <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentStep('id-input')}
            className="text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Inyuma
          </button>
        </div>
      </div>
    );
  }

  // Step 4: Candidate Selection
  if (currentStep === 'candidates') {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <Vote className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Hitamo Umukandida</h2>
          <p className="text-gray-600">Hitamo umukandida ushaka gutora</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                selectedCandidate?.id === candidate.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedCandidate(candidate)}
            >
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={candidate.imageUrl || '/api/placeholder/128/128'}
                    alt={candidate.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/128/128';
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{candidate.name}</h3>
                <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                  selectedCandidate?.id === candidate.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedCandidate?.id === candidate.id && (
                    <CheckCircle className="w-full h-full text-white" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentStep('camera')}
            className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Inyuma
          </button>
          <button
            onClick={submitVote}
            disabled={!selectedCandidate || isVoting}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
              selectedCandidate && !isVoting
                ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isVoting ? 'Birakora...' : `Tora ${selectedCandidate?.name || ''}`}
            {!isVoting && <ArrowRight className="h-5 w-5 ml-2" />}
          </button>
        </div>
      </div>
    );
  }

  // Step 5: Confirmation
  if (currentStep === 'confirmation') {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
        <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Murakoze!</h2>
        <p className="text-xl text-gray-600 mb-6">
          Itora ryawe ryoherejwe neza. Murakoze kwitabira amatora.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <p className="text-green-800">
            <strong>Watoje:</strong> {selectedCandidate?.name}
          </p>
          <p className="text-green-700 text-sm mt-2">
            Itora ryawe ryabitswe kandi ridashobora guhindurwa.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
        >
          Reba Ibisubizo
        </button>
      </div>
    );
  }

  return null;
};

export default VotingInterface;
