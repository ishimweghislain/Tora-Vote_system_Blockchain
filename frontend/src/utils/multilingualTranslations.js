// Multilingual translations for Tora Voting System
export const translations = {
  rw: {
    // Navigation and General
    appName: "Tora - Sisitemu y'Amatora y'u Rwanda",
    appDescription: "Sisitemu y'Amatora y'Umutekano n'Ubunyangamugayo",
    home: "Ahabanza",
    about: "Ibyerekeye",
    admin: "Umuyobozi",
    vote: "Tora",
    results: "Ibisubizo",
    winner: "Uwatsinze",
    guide: "Ubuyobozi",
    candidates: "Abakandida",
    language: "Ururimi",
    
    // Homepage
    welcomeTitle: "Murakaza neza kuri Tora",
    welcomeSubtitle: "Sisitemu y'amatora ifatika, isobanura kandi idashobora guhindurwa yubatswe ku blockchain",
    aboutTitle: "Ibyerekeye Tora",
    aboutDescription: "Tora ni sisitemu y'amatora igezweho ikoresha tekinoroji ya blockchain kugirango itange amatora y'umutekano, asobanura kandi adashobora guhindurwa.",
    
    aboutFeatures: {
      security: "Umutekano",
      securityDesc: "Amatora yawe aracungwa n'uburyo bw'umutekano bukomeye",
      transparency: "Ubunyangamugayo",
      transparencyDesc: "Ibisubizo byose bishobora kubonwa n'abantu bose mu gihe nyacyo",
      immutable: "Bidashobora guhindurwa",
      immutableDesc: "Amakuru y'amatora ntashobora guhindurwa nyuma y'uko yanditswe"
    },
    
    // Status
    status: {
      connected: "Uhujwe",
      disconnected: "Utahujwe"
    }
  },
  
  en: {
    // Navigation and General
    appName: "Tora - Rwanda Electoral System",
    appDescription: "Secure and Transparent Electoral System",
    home: "Home",
    about: "About",
    admin: "Admin",
    vote: "Vote",
    results: "Results",
    winner: "Winner",
    guide: "Voting Guide",
    candidates: "Candidates",
    language: "Language",
    
    // Homepage
    welcomeTitle: "Welcome to Tora",
    welcomeSubtitle: "A secure, transparent and immutable voting system built on blockchain technology",
    aboutTitle: "About Tora",
    aboutDescription: "Tora is an advanced electoral system that uses blockchain technology to provide secure, transparent and immutable elections.",
    
    aboutFeatures: {
      security: "Security",
      securityDesc: "Your votes are protected by robust security measures",
      transparency: "Transparency",
      transparencyDesc: "All results can be viewed by everyone in real-time",
      immutable: "Immutable",
      immutableDesc: "Electoral data cannot be changed after being recorded"
    },
    
    // Status
    status: {
      connected: "Connected",
      disconnected: "Disconnected"
    }
  },
  
  fr: {
    // Navigation and General
    appName: "Tora - Système Électoral du Rwanda",
    appDescription: "Système Électoral Sécurisé et Transparent",
    home: "Accueil",
    about: "À propos",
    admin: "Admin",
    vote: "Voter",
    results: "Résultats",
    winner: "Gagnant",
    guide: "Guide de Vote",
    candidates: "Candidats",
    language: "Langue",
    
    // Homepage
    welcomeTitle: "Bienvenue sur Tora",
    welcomeSubtitle: "Un système de vote sécurisé, transparent et immuable construit sur la technologie blockchain",
    aboutTitle: "À propos de Tora",
    aboutDescription: "Tora est un système électoral avancé qui utilise la technologie blockchain pour fournir des élections sécurisées, transparentes et immuables.",
    
    aboutFeatures: {
      security: "Sécurité",
      securityDesc: "Vos votes sont protégés par des mesures de sécurité robustes",
      transparency: "Transparence",
      transparencyDesc: "Tous les résultats peuvent être consultés par tous en temps réel",
      immutable: "Immuable",
      immutableDesc: "Les données électorales ne peuvent pas être modifiées après enregistrement"
    },
    
    // Status
    status: {
      connected: "Connecté",
      disconnected: "Déconnecté"
    }
  }
};

// Current language state
let currentLanguage = localStorage.getItem('tora-language') || 'rw';

// Helper function to get translation
export const t = (key) => {
  const keys = key.split('.');
  let value = translations[currentLanguage];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found in current language
      value = translations['en'];
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key; // Return key if translation not found
        }
      }
      break;
    }
  }
  
  return value;
};

// Function to change language
export const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLanguage = lang;
    // Store in localStorage for persistence
    localStorage.setItem('tora-language', lang);
    // Trigger a custom event to notify components of language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
  }
};

// Function to get current language
export const getCurrentLanguage = () => {
  return currentLanguage;
};

// Initialize language from localStorage
export const initializeLanguage = () => {
  const savedLanguage = localStorage.getItem('tora-language');
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage;
  }
};

// Language options for dropdown
export const languageOptions = [
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

export default translations;
