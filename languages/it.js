// Configurazione linguistica italiana
module.exports = {
  // Comune
  common: {
    appName: 'Fitting Room AI+',
    save: 'Salva',
    cancel: 'Annulla',
    confirm: 'Conferma',
    delete: 'Elimina',
    edit: 'Modifica',
    back: 'Indietro',
    loading: 'Caricamento...',
    success: 'Successo',
    error: 'Errore',
    warning: 'Avviso',
    info: 'Informazione'
  },
  
  // Navigazione
  navigation: {
    wardrobe: 'Guardaroba',
    tryon: 'Prova',
    history: 'Cronologia',
    profile: 'Profilo'
  },
  
  // Pagina del guardaroba
  wardrobe: {
    title: 'Il Mio Guardaroba',
    addCloth: 'Aggiungi Abiti',
    noClothes: 'Nessun abito ancora, clicca per aggiungere',
    uploadSuccess: 'Caricamento riuscito',
    uploadFailed: 'Caricamento fallito',
    deleteConfirm: 'Sei sicuro di voler eliminare questo articolo?',
    deleteSuccess: 'Eliminato con successo',
    editCloth: 'Modifica Abiti',
    clothName: 'Nome dell\'Abito',
    clothCategory: 'Categoria dell\'Abito',
    saveChanges: 'Salva Modifiche'
  },
  
  // Pagina di prova
  tryon: {
    title: 'Prova Virtuale',
    uploadPhoto: 'Carica Foto',
    uploadCloth: 'Seleziona Abiti',
    startTryon: 'Inizia Prova',
    tryonSuccess: 'Prova riuscita',
    tryonFailed: 'Prova fallita',
    saveResult: 'Salva Risultato',
    shareResult: 'Condividi Risultato',
    tryAnother: 'Prova Altro',
    selectPhoto: 'Per favore, seleziona una foto',
    selectCloth: 'Per favore, seleziona abiti',
    processing: 'Elaborazione...',
    clothingRequired: 'Per favore, seleziona prima gli abiti',
    photoRequired: 'Per favore, carica prima una foto',
    guideTitle: 'Esempio di Immagine',
    clearFrontPhoto: 'Foto frontale chiara',
    cleanBackground: 'Sfondo pulito',
    goodLighting: 'Buona illuminazione',
    iKnowStartUpload: 'Lo so, inizia il caricamento',
    dontShowAgain: 'Non mostrare più',
    uploadYourPhoto: 'Carica la tua foto',
    uploadFullBodyHint: 'Carica una foto frontale del corpo intero per ottenere i migliori risultati',
    upper: 'Superiore',
    lower: 'Inferiore',
    suit: 'Abito',
    shoes: 'Scarpe e Cappelli',
    accessories: 'Accessori',
    addUpper: 'Aggiungi Superiore',
    addLower: 'Aggiungi Inferiore',
    addSuit: 'Aggiungi Abito',
    addShoes: 'Aggiungi Scarpe e Cappelli',
    addAccessories: 'Aggiungi Accessori',
    empty: 'Vuoto',
    addClothHint: 'Clicca sul pulsante in alto a sinistra per aggiungere abiti',
    tryonEffect: 'Effetto di Prova',
    saveEffect: 'Salva Effetto',
    shareEffect: 'Condividi Effetto'
  },
  
  // Pagina della cronologia
  history: {
    title: 'Cronologia delle Prove',
    noHistory: 'Nessun record di prova ancora',
    deleteHistory: 'Elimina Cronologia',
    deleteAllConfirm: 'Sei sicuro di voler eliminare tutti i record della cronologia?',
    deleteSuccess: 'Eliminato con successo',
    viewDetail: 'Vedi Dettagli'
  },
  
  // Pagina del profilo
  profile: {
    title: 'Profilo',
    bodyProfile: 'Informazioni Corporee',
    height: 'Altezza',
    weight: 'Peso',
    gender: 'Genere',
    settings: 'Impostazioni',
    about: 'Chi Siamo',
    feedback: 'Feedback',
    logout: 'Esci',
    login: 'Accedi',
    myAccount: 'Il Mio Account',
    myBody: 'I Miei Dati Corporei',
    myWardrobe: 'Il Mio Guardaroba',
    clothingCount: '24 articoli',
    tryonHistory: 'Cronologia delle Prove',
    tryonCount: '128 prove',
    contactUs: 'Contattaci'
  },
  
  // Pagina delle impostazioni
  settings: {
    title: 'Impostazioni',
    accountSection: 'Account',
    personalInfo: 'Informazioni Personali',
    language: 'Lingua',
    preferencesSection: 'Preferenze',
    fitOptimization: 'Ottimizzazione del Fit',
    fitOptimizationDesc: 'Ottimizza i risultati delle prove con le informazioni corporee',
    faceProtection: 'Protezione del Volto',
    faceProtectionDesc: 'Copri il volto con una maschera, non conservare informazioni facciali',
    backgroundRemoval: 'Rimozione dello Sfondo',
    backgroundRemovalDesc: 'Rileva e rimuovi automaticamente lo sfondo, metti in evidenza il soggetto',
    legalSection: 'Aiuto & Supporto',
    privacyPolicy: 'Privacy Policy',
    helpCenter: 'Feedback & Suggerimenti'
  },
  
  // Pagina delle informazioni corporee
  bodyProfile: {
    title: 'Informazioni Corporee',
    height: 'Altezza (cm)',
    weight: 'Peso (kg)',
    bust: 'Busto (cm)',
    waist: 'Taltezza (cm)',
    hips: 'Anca (cm)',
    saveProfile: 'Salva Informazioni Corporee',
    profileSaved: 'Informazioni corporee salvate con successo',
    enterHeight: 'Per favore, inserisci l\'altezza',
    enterWeight: 'Per favore, inserisci il peso',
    enterBust: 'Per favore, inserisci il busto',
    enterWaist: 'Per favore, inserisci la taltezza',
    enterHips: 'Per favore, inserisci l\'anca'
  },
  
  // Pagina Chi Siamo
  about: {
    title: 'Chi Siamo',
    version: 'Versione',
    description: 'Fitting Room AI+ è un\'applicazione di prova virtuale basata su tecnologia di intelligenza artificiale, che ti consente di sperimentare vari stili di abiti a casa.',
    features: 'Caratteristiche Principali',
    feature1: '• Prova Virtuale',
    feature2: '• Gestione delle Informazioni Corporee',
    feature3: '• Gestione del Guardaroba',
    feature4: '• Cronologia delle Prove',
    contact: 'Contattaci',
    email: 'Email',
    website: 'Sito Web'
  },
  
  // Opzioni di lingua
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