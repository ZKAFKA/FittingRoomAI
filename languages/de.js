// Deutsche Sprachkonfiguration
module.exports = {
  // Allgemein
  common: {
    appName: 'Fitting Room AI+',
    save: 'Speichern',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    back: 'Zurück',
    loading: 'Laden...',
    success: 'Erfolg',
    error: 'Fehler',
    warning: 'Warnung',
    info: 'Information'
  },
  
  // Navigation
  navigation: {
    wardrobe: 'Kleidung',
    tryon: 'Anprobieren',
    history: 'Verlauf',
    profile: 'Profil'
  },
  
  // Kleidung Seite
  wardrobe: {
    title: 'Mein Kleiderschrank',
    addCloth: 'Kleidung hinzufügen',
    noClothes: 'Noch keine Kleidung, klicken zum Hinzufügen',
    uploadSuccess: 'Upload erfolgreich',
    uploadFailed: 'Upload fehlgeschlagen',
    deleteConfirm: 'Möchtest du diesen Artikel wirklich löschen?',
    deleteSuccess: 'Löschen erfolgreich',
    editCloth: 'Kleidung bearbeiten',
    clothName: 'Kleidungsname',
    clothCategory: 'Kleidungs Kategorie',
    saveChanges: 'Änderungen speichern'
  },
  
  // Anprobieren Seite
  tryon: {
    title: 'Virtuelles Anprobieren',
    uploadPhoto: 'Foto hochladen',
    uploadCloth: 'Kleidung auswählen',
    startTryon: 'Anprobieren starten',
    tryonSuccess: 'Anprobieren erfolgreich',
    tryonFailed: 'Anprobieren fehlgeschlagen',
    saveResult: 'Ergebnis speichern',
    shareResult: 'Ergebnis teilen',
    tryAnother: 'Anderes ausprobieren',
    selectPhoto: 'Bitte wählen Sie ein Foto',
    selectCloth: 'Bitte wählen Sie Kleidung',
    processing: 'Verarbeitung...',
    clothingRequired: 'Bitte wählen Sie zuerst Kleidung',
    photoRequired: 'Bitte laden Sie zuerst ein Foto hoch',
    guideTitle: 'Beispielbild',
    clearFrontPhoto: 'Klares Frontalbild',
    cleanBackground: 'Sauberer Hintergrund',
    goodLighting: 'Gutes Licht',
    iKnowStartUpload: 'Ich verstehe, Upload starten',
    dontShowAgain: 'Nicht erneut anzeigen',
    uploadYourPhoto: 'Lade dein Foto hoch',
    uploadFullBodyHint: 'Lade ein vollständiges Frontalbild für beste Ergebnisse',
    upper: 'Oberteil',
    lower: 'Unterteil',
    suit: 'Anzug',
    shoes: 'Schuhe & Hüte',
    accessories: 'Accessoires',
    addUpper: 'Oberteil hinzufügen',
    addLower: 'Unterteil hinzufügen',
    addSuit: 'Anzug hinzufügen',
    addShoes: 'Schuhe & Hüte hinzufügen',
    addAccessories: 'Accessoires hinzufügen',
    empty: 'Leer',
    addClothHint: 'Klicken Sie auf die obere linke Schaltfläche, um Kleidung hinzuzufügen',
    tryonEffect: 'Anprobeffekt',
    saveEffect: 'Effekt speichern',
    shareEffect: 'Effekt teilen'
  },
  
  // Verlauf Seite
  history: {
    title: 'Anprobierverlauf',
    noHistory: 'Noch keine Anprobeinträge',
    deleteHistory: 'Verlauf löschen',
    deleteAllConfirm: 'Möchtest du wirklich alle Verlaufseinträge löschen?',
    deleteSuccess: 'Löschen erfolgreich',
    viewDetail: 'Details anzeigen'
  },
  
  // Profil Seite
  profile: {
    title: 'Profil',
    bodyProfile: 'Körperinformationen',
    height: 'Größe',
    weight: 'Gewicht',
    gender: 'Geschlecht',
    settings: 'Einstellungen',
    about: 'Über uns',
    feedback: 'Feedback',
    logout: 'Abmelden',
    login: 'Anmelden',
    myAccount: 'Mein Konto',
    myBody: 'Meine Körperdaten',
    myWardrobe: 'Mein Kleiderschrank',
    clothingCount: '24 Artikel',
    tryonHistory: 'Anprobierverlauf',
    tryonCount: '128 Anprobierungen',
    contactUs: 'Kontaktiere uns'
  },
  
  // Einstellungen Seite
  settings: {
    title: 'Einstellungen',
    accountSection: 'Konto',
    personalInfo: 'Persönliche Informationen',
    language: 'Sprache',
    preferencesSection: 'Einstellungen',
    fitOptimization: 'Passoptimierung',
    fitOptimizationDesc: 'Optimieren Sie die Anwerbergebnisse mit Körperinformationen',
    faceProtection: 'Gesichtsschutz',
    faceProtectionDesc: 'Verdecke das Gesicht mit einer Maske, speichere keine Gesichtsinformationen',
    backgroundRemoval: 'Hintergrundentfernung',
    backgroundRemovalDesc: 'Automatisch Hintergrund erkennen und entfernen, Subjekt hervorheben',
    legalSection: 'Hilfe & Support',
    privacyPolicy: 'Datenschutzrichtlinie',
    helpCenter: 'Feedback & Vorschläge'
  },
  
  // Körperinformationen Seite
  bodyProfile: {
    title: 'Körperinformationen',
    height: 'Größe (cm)',
    weight: 'Gewicht (kg)',
    bust: 'Busen (cm)',
    waist: 'Taille (cm)',
    hips: 'Hüften (cm)',
    saveProfile: 'Körperinformationen speichern',
    profileSaved: 'Körperinformationen erfolgreich gespeichert',
    enterHeight: 'Bitte geben Sie Ihre Größe ein',
    enterWeight: 'Bitte geben Sie Ihr Gewicht ein',
    enterBust: 'Bitte geben Sie Ihren Busen ein',
    enterWaist: 'Bitte geben Sie Ihre Taille ein',
    enterHips: 'Bitte geben Sie Ihre Hüften ein'
  },
  
  // Über uns Seite
  about: {
    title: 'Über uns',
    version: 'Version',
    description: 'Fitting Room AI+ ist eine virtuelle Anprobieranwendung basierend auf KI-Technologie, mit der Sie verschiedene Kleidungsstile zu Hause ausprobieren können.',
    features: 'Schlüsselmerkmale',
    feature1: '• Virtuelles Anprobieren',
    feature2: '• Körperinformationsverwaltung',
    feature3: '• Kleiderschrankverwaltung',
    feature4: '• Anprobierverlauf',
    contact: 'Kontaktiere uns',
    email: 'E-Mail',
    website: 'Website'
  },
  
  // Sprachoptionen
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