// Configuración lingüística española
module.exports = {
  // Común
  common: {
    appName: 'Fitting Room AI+',
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Volver',
    loading: 'Cargando...',
    success: 'Éxito',
    error: 'Error',
    warning: 'Advertencia',
    info: 'Información'
  },
  
  // Navegación
  navigation: {
    wardrobe: 'Ropa',
    tryon: 'Probar',
    history: 'Historial',
    profile: 'Perfil'
  },
  
  // Página de ropa
  wardrobe: {
    title: 'Mi Armario',
    addCloth: 'Añadir Ropa',
    noClothes: 'No hay ropa todavía, haz clic para añadir',
    uploadSuccess: 'Subida exitosa',
    uploadFailed: 'Error en la subida',
    deleteConfirm: '¿Estás seguro de que quieres eliminar este artículo?',
    deleteSuccess: 'Eliminado exitosamente',
    editCloth: 'Editar Ropa',
    clothName: 'Nombre de la Prenda',
    clothCategory: 'Categoría de la Prenda',
    saveChanges: 'Guardar Cambios'
  },
  
  // Página de prueba
  tryon: {
    title: 'Prueba Virtual',
    uploadPhoto: 'Subir Foto',
    uploadCloth: 'Seleccionar Ropa',
    startTryon: 'Iniciar Prueba',
    tryonSuccess: 'Prueba exitosa',
    tryonFailed: 'Error en la prueba',
    saveResult: 'Guardar Resultado',
    shareResult: 'Compartir Resultado',
    tryAnother: 'Probar Otra',
    selectPhoto: 'Por favor, selecciona una foto',
    selectCloth: 'Por favor, selecciona ropa',
    processing: 'Procesando...',
    clothingRequired: 'Por favor, selecciona ropa primero',
    photoRequired: 'Por favor, sube una foto primero',
    guideTitle: 'Imagen de Ejemplo',
    clearFrontPhoto: 'Foto frontal clara',
    cleanBackground: 'Fondo limpio',
    goodLighting: 'Buena iluminación',
    iKnowStartUpload: 'Lo sé, comenzar subida',
    dontShowAgain: 'No mostrar de nuevo',
    uploadYourPhoto: 'Sube tu foto',
    uploadFullBodyHint: 'Sube una foto frontal de todo el cuerpo para obtener los mejores resultados',
    upper: 'Superior',
    lower: 'Inferior',
    suit: 'Traje',
    shoes: 'Zapatos y Sombreros',
    accessories: 'Accesorios',
    addUpper: 'Añadir Superior',
    addLower: 'Añadir Inferior',
    addSuit: 'Añadir Traje',
    addShoes: 'Añadir Zapatos y Sombreros',
    addAccessories: 'Añadir Accesorios',
    empty: 'Vacío',
    addClothHint: 'Haz clic en el botón superior izquierdo para añadir ropa',
    tryonEffect: 'Efecto de Prueba',
    saveEffect: 'Guardar Efecto',
    shareEffect: 'Compartir Efecto'
  },
  
  // Página de historial
  history: {
    title: 'Historial de Pruebas',
    noHistory: 'No hay registros de prueba todavía',
    deleteHistory: 'Eliminar Historial',
    deleteAllConfirm: '¿Estás seguro de que quieres eliminar todos los registros del historial?',
    deleteSuccess: 'Eliminado exitosamente',
    viewDetail: 'Ver Detalles'
  },
  
  // Página de perfil
  profile: {
    title: 'Perfil',
    bodyProfile: 'Información Corporal',
    height: 'Altura',
    weight: 'Peso',
    gender: 'Género',
    settings: 'Configuración',
    about: 'Sobre Nosotros',
    feedback: 'Feedback',
    logout: 'Cerrar Sesión',
    login: 'Iniciar Sesión',
    myAccount: 'Mi Cuenta',
    myBody: 'Mis Datos Corporales',
    myWardrobe: 'Mi Armario',
    clothingCount: '24 artículos',
    tryonHistory: 'Historial de Pruebas',
    tryonCount: '128 pruebas',
    contactUs: 'Contáctanos'
  },
  
  // Página de configuración
  settings: {
    title: 'Configuración',
    accountSection: 'Cuenta',
    personalInfo: 'Información Personal',
    language: 'Idioma',
    preferencesSection: 'Preferencias',
    fitOptimization: 'Optimización de Ajuste',
    fitOptimizationDesc: 'Optimizar resultados de prueba con información corporal',
    faceProtection: 'Protección Facial',
    faceProtectionDesc: 'Cubrir el rostro con una máscara, no guardar información facial',
    backgroundRemoval: 'Eliminación de Fondo',
    backgroundRemovalDesc: 'Detectar y eliminar automáticamente el fondo, resaltar el sujeto',
    legalSection: 'Ayuda & Soporte',
    privacyPolicy: 'Política de Privacidad',
    helpCenter: 'Feedback & Sugerencias'
  },
  
  // Página de información corporal
  bodyProfile: {
    title: 'Información Corporal',
    height: 'Altura (cm)',
    weight: 'Peso (kg)',
    bust: 'Busto (cm)',
    waist: 'Cintura (cm)',
    hips: 'Caderas (cm)',
    saveProfile: 'Guardar Información Corporal',
    profileSaved: 'Información corporal guardada exitosamente',
    enterHeight: 'Por favor, introduce la altura',
    enterWeight: 'Por favor, introduce el peso',
    enterBust: 'Por favor, introduce el busto',
    enterWaist: 'Por favor, introduce la cintura',
    enterHips: 'Por favor, introduce las caderas'
  },
  
  // Página Sobre Nosotros
  about: {
    title: 'Sobre Nosotros',
    version: 'Versión',
    description: 'Fitting Room AI+ es una aplicación de prueba virtual basada en tecnología de inteligencia artificial, que te permite experimentar diversos estilos de ropa en casa.',
    features: 'Características Clave',
    feature1: '• Prueba Virtual',
    feature2: '• Gestión de Información Corporal',
    feature3: '• Gestión de Armario',
    feature4: '• Historial de Pruebas',
    contact: 'Contáctanos',
    email: 'Correo Electrónico',
    website: 'Sitio Web'
  },
  
  // Opciones de idioma
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