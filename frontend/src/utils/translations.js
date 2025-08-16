// Kinyarwanda translations for Tora Voting System
export const translations = {
  // Navigation and General
  appName: "Tora",
  appDescription: "Sisitemu y'Amatora y'Umutekano",
  home: "Ahabanza",
  about: "Ibyerekeye",
  admin: "Ubuyobozi",
  vote: "Tora",
  results: "Ibisubizo",
  
  // Homepage
  welcomeTitle: "Murakaza neza kuri Tora",
  welcomeSubtitle: "Sisitemu y'amatora ifatika, isobanura kandi idashobora guhindurwa yubatswe ku blockchain",
  aboutTitle: "Ibyerekeye Tora",
  aboutDescription: "Tora ni sisitemu y'amatora igezweho ikoresha tekinoroji ya blockchain kugirango itange amatora y'umutekano, asobanura kandi adashobora guhindurwa. Buri itora rikorerwa ku blockchain, bituma bidashobora guhindurwa kandi bishobora kugenzurwa n'abantu bose.",
  aboutFeatures: {
    security: "Umutekano",
    securityDesc: "Amatora yawe aracungwa n'uburyo bw'umutekano bukomeye",
    transparency: "Ubunyangamugayo",
    transparencyDesc: "Ibisubizo byose bishobora kubonwa n'abantu bose mu gihe nyacyo",
    immutable: "Bidashobora guhindurwa",
    immutableDesc: "Amakuru y'amatora ntashobora guhindurwa nyuma y'uko yanditswe"
  },
  
  // Admin Section
  adminLogin: "Kwinjira mu buyobozi",
  username: "Izina ry'ukoresha",
  password: "Ijambo ry'ibanga",
  login: "Injira",
  logout: "Sohoka",
  adminPanel: "Ikibaho cy'ubuyobozi",
  voterManagement: "Gucunga abatora",
  
  // Voter Registration
  registerVoter: "Kwandikisha umutora",
  rwandanId: "Indangamuntu y'u Rwanda",
  fullName: "Amazina yose",
  gender: "Igitsina",
  male: "Gabo",
  female: "Gore",
  voterAddress: "Aderesi y'umutora",
  register: "Andikisha",
  update: "Kuvugurura",
  delete: "Gusiba",
  search: "Gushakisha",
  
  // Voting Interface
  votingRules: "Amategeko y'amatora",
  rulesTitle: "Amategeko n'amabwiriza y'amatora",
  rules: [
    "Ugomba kuba ufite indangamuntu y'u Rwanda ifatika",
    "Buri muntu ashobora gutora rimwe gusa",
    "Hitamo umukandida umwe gusa",
    "Amatora yawe ni amabanga kandi aracungwa",
    "Ntushobora guhindura itora ryawe nyuma y'uko uryemeje",
    "Amatora azarangira ku gihe cyagenwe"
  ],
  agreeToRules: "Nemeye amategeko y'amatora",
  proceedToVote: "Komeza utore",
  enterYourId: "Injiza indangamuntu yawe",
  verifyIdentity: "Kugenzura umwirondoro",
  takePhoto: "Fata ifoto",
  retakePhoto: "Ongera ufate ifoto",
  confirmIdentity: "Emeza umwirondoro",
  
  // Candidates
  candidates: "Abakandida",
  selectCandidate: "Hitamo umukandida",
  confirmVote: "Emeza itora ryawe",
  voteFor: "Tora",
  
  // Results
  liveResults: "Ibisubizo mu gihe nyacyo",
  totalVotes: "Amatora yose",
  percentage: "Ijanisha",
  votingInProgress: "Amatora arakomeje",
  votingEnded: "Amatora yarangiye",
  winner: "Uwatsinze",
  
  // Messages
  success: {
    voterRegistered: "Umutora yanditswe neza",
    voterUpdated: "Amakuru y'umutora avuguruwe neza",
    voterDeleted: "Umutora yasibwe neza",
    voteSubmitted: "Itora ryawe ryoherejwe neza",
    loginSuccess: "Winjiye neza"
  },
  
  error: {
    invalidCredentials: "Amazina y'ukoresha cyangwa ijambo ry'ibanga si byo",
    voterNotFound: "Umutora ntabwo abonetse",
    alreadyVoted: "Waratoje",
    votingNotActive: "Amatora ntabwo arakora",
    invalidId: "Indangamuntu si nziza",
    networkError: "Ikibazo cy'umuyoboro",
    generalError: "Habaye ikibazo"
  },
  
  // Form Labels
  required: "Bikenewe",
  optional: "Bitegetswe",
  save: "Bika",
  cancel: "Kuraguza",
  confirm: "Emeza",
  back: "Subira inyuma",
  next: "Komeza",
  loading: "Birimo gutegurwa...",
  
  // Validation Messages
  validation: {
    idRequired: "Indangamuntu ikenewe",
    idInvalid: "Indangamuntu igomba kuba ifite imibare 16",
    nameRequired: "Amazina akenewe",
    genderRequired: "Igitsina gikenewe",
    addressRequired: "Aderesi ikenewe"
  },
  
  // Status Messages
  status: {
    connected: "Uhujwe",
    disconnected: "Utahujwe",
    registered: "Wanditswe",
    notRegistered: "Utanditswe",
    voted: "Waratoje",
    notVoted: "Utaratora"
  }
};

// Helper function to get translation
export const t = (key) => {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return value;
};

export default translations;
