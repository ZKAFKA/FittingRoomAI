// Configuration linguistique française
module.exports = {
  // Commun
  common: {
    appName: 'Fitting Room AI+',
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    delete: 'Supprimer',
    edit: 'Modifier',
    back: 'Retour',
    loading: 'Chargement...',
    success: 'Succès',
    error: 'Erreur',
    warning: 'Avertissement',
    info: 'Information'
  },
  
  // Navigation
  navigation: {
    wardrobe: 'Garde-robe',
    tryon: 'Essayage',
    history: 'Historique',
    profile: 'Profil'
  },
  
  // Page de garde-robe
  wardrobe: {
    title: 'Ma garde-robe',
    addCloth: 'Ajouter des vêtements',
    noClothes: 'Aucun vêtement pour le moment, cliquez pour ajouter',
    uploadSuccess: 'Téléchargement réussi',
    uploadFailed: 'Échec du téléchargement',
    deleteConfirm: 'Voulez-vous vraiment supprimer cet article ?',
    deleteSuccess: 'Supprimé avec succès',
    editCloth: 'Modifier les vêtements',
    clothName: 'Nom du vêtement',
    clothCategory: 'Catégorie de vêtement',
    saveChanges: 'Enregistrer les modifications'
  },
  
  // Page d'essayage
  tryon: {
    title: 'Essayage virtuel',
    uploadPhoto: 'Télécharger une photo',
    uploadCloth: 'Sélectionner des vêtements',
    startTryon: 'Démarrer l\'essayage',
    tryonSuccess: 'Essayage réussi',
    tryonFailed: 'Échec de l\'essayage',
    saveResult: 'Enregistrer le résultat',
    shareResult: 'Partager le résultat',
    tryAnother: 'Essayer autre chose',
    selectPhoto: 'Veuillez sélectionner une photo',
    selectCloth: 'Veuillez sélectionner des vêtements',
    processing: 'Traitement en cours...',
    clothingRequired: 'Veuillez d\'abord sélectionner des vêtements',
    photoRequired: 'Veuillez d\'abord télécharger une photo',
    guideTitle: 'Image exemple',
    clearFrontPhoto: 'Photo正面 claire',
    cleanBackground: 'Fond propre',
    goodLighting: 'Bon éclairage',
    iKnowStartUpload: 'Je sais, commencer le téléchargement',
    dontShowAgain: 'Ne plus afficher',
    uploadYourPhoto: 'Téléchargez votre photo',
    uploadFullBodyHint: 'Téléchargez une photo正面 de tout le corps pour obtenir les meilleurs résultats',
    upper: 'Haut',
    lower: 'Bas',
    suit: 'Costume',
    shoes: 'Chaussures et chapeaux',
    accessories: 'Accessoires',
    addUpper: 'Ajouter un haut',
    addLower: 'Ajouter un bas',
    addSuit: 'Ajouter un costume',
    addShoes: 'Ajouter des chaussures et des chapeaux',
    addAccessories: 'Ajouter des accessoires',
    empty: 'Vide',
    addClothHint: 'Cliquez sur le bouton en haut à gauche pour ajouter des vêtements',
    tryonEffect: 'Effet d\'essayage',
    saveEffect: 'Enregistrer l\'effet',
    shareEffect: 'Partager l\'effet'
  },
  
  // Page d'historique
  history: {
    title: 'Historique d\'essayage',
    noHistory: 'Aucun enregistrement d\'essayage pour le moment',
    deleteHistory: 'Supprimer l\'historique',
    deleteAllConfirm: 'Voulez-vous vraiment supprimer tous les enregistrements d\'historique ?',
    deleteSuccess: 'Supprimé avec succès',
    viewDetail: 'Voir les détails'
  },
  
  // Page de profil
  profile: {
    title: 'Profil',
    bodyProfile: 'Informations corporelles',
    height: 'Taille',
    weight: 'Poids',
    gender: 'Genre',
    settings: 'Paramètres',
    about: 'À propos de nous',
    feedback: 'Feedback',
    logout: 'Déconnexion',
    login: 'Connexion',
    myAccount: 'Mon compte',
    myBody: 'Mes données corporelles',
    myWardrobe: 'Ma garde-robe',
    clothingCount: '24 articles',
    tryonHistory: 'Historique d\'essayage',
    tryonCount: '128 essayages',
    contactUs: 'Contactez-nous'
  },
  
  // Page de paramètres
  settings: {
    title: 'Paramètres',
    accountSection: 'Compte',
    personalInfo: 'Informations personnelles',
    language: 'Langue',
    preferencesSection: 'Préférences',
    fitOptimization: 'Optimisation du fit',
    fitOptimizationDesc: 'Optimiser les résultats d\'essayage avec les informations corporelles',
    faceProtection: 'Protection du visage',
    faceProtectionDesc: 'Couvrir le visage avec un masque, ne pas conserver d\'informations faciales',
    backgroundRemoval: 'Suppression du fond',
    backgroundRemovalDesc: 'Détecter et supprimer automatiquement le fond, mettre en valeur le sujet',
    legalSection: 'Aide & Support',
    privacyPolicy: 'Politique de confidentialité',
    helpCenter: 'Feedback & Suggestions'
  },
  
  // Page d'informations corporelles
  bodyProfile: {
    title: 'Informations corporelles',
    height: 'Taille (cm)',
    weight: 'Poids (kg)',
    bust: 'Buste (cm)',
    waist: 'Taille (cm)',
    hips: 'Hanche (cm)',
    saveProfile: 'Enregistrer les informations corporelles',
    profileSaved: 'Informations corporelles enregistrées avec succès',
    enterHeight: 'Veuillez saisir la taille',
    enterWeight: 'Veuillez saisir le poids',
    enterBust: 'Veuillez saisir la taille du buste',
    enterWaist: 'Veuillez saisir la taille',
    enterHips: 'Veuillez saisir la taille des hanches'
  },
  
  // Page À propos
  about: {
    title: 'À propos de nous',
    version: 'Version',
    description: 'Fitting Room AI+ est une application d\'essayage virtuel basée sur la technologie d\'intelligence artificielle, vous permettant d\'expérimenter divers styles de vêtements chez vous.',
    features: 'Fonctionnalités clés',
    feature1: '• Essayage virtuel',
    feature2: '• Gestion des informations corporelles',
    feature3: '• Gestion de la garde-robe',
    feature4: '• Historique d\'essayage',
    contact: 'Contactez-nous',
    email: 'Email',
    website: 'Site web'
  },
  
  // Options linguistiques
  languages: {
    zhCN: '简体中文',
    zhTW: '繁體中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어',
    fr: 'Français',
    es: 'Español',
    de: 'Deutsch',
    ru: 'Русский',
    ar: 'العربية',
    pt: 'Português',
    it: 'Italiano',
    hi: 'हिन्दी'
  }
};