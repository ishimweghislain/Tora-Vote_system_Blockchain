import React, { useState, useRef, useEffect } from 'react';
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
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);

  // Real registered voters - will be fetched from backend
  const [registeredVoters, setRegisteredVoters] = useState([]);

  // Fetch registered voters from backend
  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await fetch('/api/voters');
        if (response.ok) {
          const voters = await response.json();
          setRegisteredVoters(voters);
        } else {
          console.error('Failed to fetch voters:', response.status);
          // Set empty array to avoid errors
          setRegisteredVoters([]);
        }
      } catch (error) {
        console.error('Error fetching voters:', error);
        // Set empty array to avoid errors
        setRegisteredVoters([]);
      }
    };
    fetchVoters();
  }, []);

  const validateRwandanId = (id) => {
    return /^\d{16}$/.test(id);
  };

  const checkVoterRegistration = (id) => {
    return registeredVoters.find(voter => voter.rwandanId === id);
  };

  const startCamera = async () => {
    console.log('🎥 Button clicked - Starting camera...');

    try {
      console.log('🎥 Attempting to access camera...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      console.log('✅ Camera stream obtained');
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        console.log('✅ Real camera video playing');
        toast.success('Kamera yatangiye neza');

        // Start scanning simulation after camera is ready
        setTimeout(() => {
          startScanningSimulation();
        }, 500);
      }
    } catch (error) {
      console.error('❌ Camera error:', error);
      console.log('📱 Camera access denied or not available');
      toast.error('Kamera ntishobora gutangira - Emera kamera cyangwa koresha browser izifite kamera');
    }
  };

  const startScanningSimulation = () => {
    console.log('🔍 Starting scanning simulation...');
    setIsScanning(true);
    setScanProgress(0);
    setFaceDetected(false);

    // Show initial scanning message
    toast.info('Ese ni wowe...');
    console.log('📱 Scanning state set, showing toast message');

    // Simulate face detection after 1 second
    setTimeout(() => {
      console.log('👤 Face detected!');
      setFaceDetected(true);
      toast.success('Isura yabonetse!');
    }, 1000);

    // Progress animation over 3 seconds (faster)
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 4; // 4% every 100ms = 2.5 seconds total
        console.log(`📊 Scan progress: ${newProgress}%`);

        if (newProgress >= 100) {
          console.log('✅ Scanning complete!');
          clearInterval(progressInterval);
          setIsScanning(false);

          // Complete verification
          setTimeout(() => {
            completeVerification();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  const completeVerification = () => {
    // Take photo (real or simulated)
    if (videoRef.current && videoRef.current.srcObject) {
      takePhoto();
    } else {
      simulateDemoPhoto();
    }

    toast.success('Dusanze ari wowe ubu watora uko wifuza');
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current && videoRef.current.videoWidth > 0) {
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
      toast.success('Ifoto yafashwe neza!');

      // Auto-advance to voting after 2 seconds
      setTimeout(() => {
        setCurrentStep('candidates');
        toast.success('Umwirondoro wemejwe! Hitamo umukandida');
      }, 2000);
    } else {
      // Fallback to demo photo
      simulateDemoPhoto();
    }
  };

  const simulateDemoPhoto = () => {
    // Create a demo photo with canvas
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');

      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 640, 480);
      gradient.addColorStop(0, '#4F46E5');
      gradient.addColorStop(1, '#06B6D4');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 640, 480);

      // Add demo text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('DEMO CAMERA', 320, 200);
      ctx.font = '18px Arial';
      ctx.fillText('Ifoto ya Demo', 320, 240);
      ctx.fillText('✅ Umwirondoro wemejwe', 320, 280);

      // Add a simple face outline
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(320, 320, 60, 0, 2 * Math.PI);
      ctx.stroke();

      // Eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(300, 310, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(340, 310, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Smile
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(320, 330, 20, 0, Math.PI);
      ctx.stroke();

      const photoDataUrl = canvas.toDataURL('image/jpeg');
      setPhotoData(photoDataUrl);
      setPhotoTaken(true);
      setCameraActive(false);
      toast.success('Demo ifoto yafashwe neza!');

      // Auto-advance to voting after 2 seconds
      setTimeout(() => {
        setCurrentStep('candidates');
        toast.success('Umwirondoro wemejwe! Hitamo umukandida');
      }, 2000);
    }
  };

  const retakePhoto = () => {
    setPhotoTaken(false);
    setPhotoData(null);
    setCameraActive(false);
    toast.info('Ongera utangire kamera');
    // Small delay before restarting camera
    setTimeout(() => {
      startCamera();
    }, 500);
  };

  const handleProceedFromRules = () => {
    if (!rulesAccepted) {
      toast.error('Please accept the voting rules to continue');
      return;
    }
    setCurrentStep('id-input');
  };

  const handleIdSubmit = async () => {
    if (!validateRwandanId(rwandanId)) {
      toast.error('Indangamuntu si nziza. Injiza imibare 16.');
      return;
    }

    try {
      // Check if voter is registered
      const voterResponse = await fetch(`/api/voters/${rwandanId}`);
      if (!voterResponse.ok) {
        toast.error('Ntibyemewe gutora. Indangamuntu yawe ntiyanditswe na buyobozi.');
        return;
      }

      const voter = await voterResponse.json();

      if (!voter.isEligible) {
        toast.error('Ntibyemewe gutora. Ntabwo ufite uburenganzira bwo gutora.');
        return;
      }

      // Check if voter has already voted
      const voteCheckResponse = await fetch(`/api/votes/check/${rwandanId}`);
      if (voteCheckResponse.ok) {
        const voteCheck = await voteCheckResponse.json();
        if (voteCheck.hasVoted) {
          toast.error('Waratoye! Byararangiye. Ntushobora gutora kabiri.', {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }
          });
          return;
        }
      }

      setVoterInfo(voter);
      setCurrentStep('camera');
    } catch (error) {
      toast.error('Habaye ikosa. Ongera ugerageze.');
    }
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
      // Submit vote to backend
      const response = await fetch('/api/votes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rwandanId: rwandanId,
          candidateId: selectedCandidate.id
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit vote');
      }

      const result = await response.json();
      toast.success('Itora ryawe ryoherejwe neza!');
      onVoteSubmitted?.();
      setCurrentStep('confirmation');
    } catch (error) {
      toast.error(error.message || 'Ntibyashoboye gutora. Ongera ugerageze.');
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
        
        <div className="max-w-lg mx-auto">
          {!photoTaken ? (
            <div className="space-y-6">
              {/* Camera Preview */}
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border-4 border-purple-200" style={{ aspectRatio: '4/3' }}>
                {cameraActive ? (
                  <>
                    {/* Video or Demo Face */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />

                    {/* Show demo face only if no camera stream */}
                    {!videoRef.current?.srcObject && (
                      /* Demo Face Display */
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
                        {/* Realistic face simulation */}
                        <div className="relative">
                          {/* Face shape */}
                          <div className="w-40 h-48 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-full relative shadow-lg">
                            {/* Eyes */}
                            <div className="absolute top-16 left-8 w-4 h-4 bg-gray-800 rounded-full"></div>
                            <div className="absolute top-16 right-8 w-4 h-4 bg-gray-800 rounded-full"></div>
                            {/* Nose */}
                            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-yellow-300 rounded-full"></div>
                            {/* Mouth */}
                            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-red-300 rounded-full"></div>
                            {/* Hair */}
                            <div className="absolute -top-4 left-4 right-4 h-8 bg-gray-700 rounded-t-full"></div>
                          </div>
                          {/* Shoulders */}
                          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-56 h-16 bg-blue-400 rounded-t-full"></div>
                        </div>

                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200"></div>
                        </div>
                      </div>
                    )}

                    {/* Camera overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                        LIVE
                      </div>

                      {/* Face Detection Frame */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-48 h-48 border-2 rounded-full transition-all duration-500 ${
                          faceDetected ? 'border-green-400 shadow-lg shadow-green-400/50' : 'border-white opacity-30'
                        }`}>
                          {faceDetected && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              ✓ Isura yabonetse
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Scanning Animation */}
                      {isScanning && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-48 relative">
                            {/* Scanning line */}
                            <div
                              className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"
                              style={{
                                top: `${scanProgress}%`,
                                transition: 'top 0.1s ease-out'
                              }}
                            ></div>
                            {/* Corner brackets */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-blue-400"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-blue-400"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-blue-400"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-blue-400"></div>
                          </div>
                        </div>
                      )}

                      {/* Progress Bar */}
                      {isScanning && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black bg-opacity-50 rounded-lg p-3">
                            <div className="flex items-center space-x-3 text-white">
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                              <div className="flex-1">
                                <div className="text-xs mb-1">Gusuzuma umwirondoro... {Math.round(scanProgress)}%</div>
                                <div className="w-full bg-gray-600 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-100"
                                    style={{ width: `${scanProgress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="text-8xl mb-4 opacity-30">📷</div>
                    <p className="text-lg font-semibold text-gray-600">Kamera Demo</p>
                    <p className="text-sm text-gray-500">Kanda buto yo gutangira</p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">ℹ</span>
                  </div>
                  <div className="text-blue-800">
                    <p className="font-semibold mb-1">Amabwiriza:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Reba neza mu kamera</li>
                      <li>• Emeza ko umutwe wawe ugaragara neza</li>
                      <li>• Kanda "Tangira Kamera" kugirango utangire gusuzuma</li>
                      <li>• Tegereza amasegonda 5 kugirango dusuzume umwirondoro</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                {!cameraActive ? (
                  <button
                    onClick={() => {
                      console.log('🔥 Button clicked!');
                      startCamera();
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center shadow-lg transform hover:scale-105"
                  >
                    <Camera className="h-5 w-5 mr-2" /> Tangira Kamera
                  </button>
                ) : isScanning ? (
                  <button
                    disabled
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center shadow-lg opacity-75 cursor-not-allowed"
                  >
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Gusuzuma... {Math.round(scanProgress)}%
                  </button>
                ) : (
                  <button
                    onClick={takePhoto}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center shadow-lg transform hover:scale-105 animate-pulse"
                  >
                    <Camera className="h-5 w-5 mr-2" /> Fata Ifoto
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Photo Preview */}
              <div className="relative bg-gray-100 rounded-xl overflow-hidden border-4 border-green-200" style={{ aspectRatio: '4/3' }}>
                <img src={photoData} alt="Ifoto yafashwe" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Yafashwe
                </div>
              </div>

              {/* Photo confirmation */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div className="text-green-800">
                    <p className="font-semibold">Ifoto yafashwe neza!</p>
                    <p className="text-sm">Reba niba ifoto igaragaza neza, hanyuma ukande "Emeza"</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={retakePhoto}
                  className="flex-1 bg-gray-500 text-white py-4 rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center shadow-lg"
                >
                  <RotateCcw className="h-5 w-5 mr-2" /> Ongera Ufate Ifoto
                </button>
                <button
                  onClick={handleCameraConfirm}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105"
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