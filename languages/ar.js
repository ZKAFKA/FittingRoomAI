// تكوين اللغة العربية
module.exports = {
  // مشتركة
  common: {
    appName: 'Fitting Room AI+',
    save: 'حفظ',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    delete: 'حذف',
    edit: 'تعديل',
    back: 'رجوع',
    loading: 'جار التحميل...',
    success: 'نجاح',
    error: 'خطأ',
    warning: 'تحذير',
    info: 'معلومات'
  },
  
  // التنقل
  navigation: {
    wardrobe: 'الملابس',
    tryon: 'جرب',
    history: 'تاريخ',
    profile: 'ملف شخصي'
  },
  
  // صفحة الملابس
  wardrobe: {
    title: 'ملابسي',
    addCloth: 'إضافة ملابس',
    noClothes: 'لا توجد ملابس بعد، اضغط لإضافة',
    uploadSuccess: 'تحميل بنجاح',
    uploadFailed: 'فشل التحميل',
    deleteConfirm: 'هل أنت متأكد أنك تريد حذف هذا العنصر؟',
    deleteSuccess: 'حذف بنجاح',
    editCloth: 'تعديل الملابس',
    clothName: 'اسم الملابس',
    clothCategory: 'فئة الملابس',
    saveChanges: 'حفظ التغييرات'
  },
  
  // صفحة التجربة
  tryon: {
    title: 'التجربة الافتراضية',
    uploadPhoto: 'تحميل صورة',
    uploadCloth: 'اختيار ملابس',
    startTryon: 'بدء التجربة',
    tryonSuccess: 'نجاح التجربة',
    tryonFailed: 'فشل التجربة',
    saveResult: 'حفظ النتيجة',
    shareResult: 'مشاركة النتيجة',
    tryAnother: 'جرب أخر',
    selectPhoto: 'يرجى اختيار صورة',
    selectCloth: 'يرجى اختيار ملابس',
    processing: 'جار المعالجة...',
    clothingRequired: 'يرجى اختيار الملابس أولاً',
    photoRequired: 'يرجى تحميل صورة أولاً',
    guideTitle: 'مثال للصورة',
    clearFrontPhoto: 'صورة أمامية واضحة',
    cleanBackground: 'خلفية نظيفة',
    goodLighting: 'إضاءة جيدة',
    iKnowStartUpload: 'أنا أعرف، ابدأ التحميل',
    dontShowAgain: 'لا تظهر مرة أخرى',
    uploadYourPhoto: 'تحميل صورتك',
    uploadFullBodyHint: 'تحميل صورة أمامية للجسم بأكمله للحصول على أفضل النتائج',
    upper: 'أعلى',
    lower: 'أسفل',
    suit: 'بدلة',
    shoes: 'حذاء واقرع',
    accessories: 'أكسسوارات',
    addUpper: 'إضافة أعلى',
    addLower: 'إضافة أسفل',
    addSuit: 'إضافة بدلة',
    addShoes: 'إضافة حذاء واقرع',
    addAccessories: 'إضافة أكسسوارات',
    empty: 'فارغ',
    addClothHint: 'اضغط على الزر في أعلى اليسار لإضافة ملابس',
    tryonEffect: 'تأثير التجربة',
    saveEffect: 'حفظ التأثير',
    shareEffect: 'مشاركة التأثير'
  },
  
  // صفحة التاريخ
  history: {
    title: 'تاريخ التجربة',
    noHistory: 'لا توجد سجلات تجربة بعد',
    deleteHistory: 'حذف التاريخ',
    deleteAllConfirm: 'هل أنت متأكد أنك تريد حذف جميع سجلات التاريخ؟',
    deleteSuccess: 'حذف بنجاح',
    viewDetail: 'عرض التفاصيل'
  },
  
  // صفحة الملف الشخصي
  profile: {
    title: 'ملف شخصي',
    bodyProfile: 'معلومات الجسم',
    height: 'الطول',
    weight: 'الوزن',
    gender: 'الجنس',
    settings: 'الإعدادات',
    about: 'عنا',
    feedback: 'ملاحظات',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    myAccount: 'حسابي',
    myBody: 'بيانات جسدي',
    myWardrobe: 'ملابسي',
    clothingCount: '24 عنصر',
    tryonHistory: 'تاريخ التجربة',
    tryonCount: '128 تجربة',
    contactUs: 'اتصل بنا'
  },
  
  // صفحة الإعدادات
  settings: {
    title: 'الإعدادات',
    accountSection: 'الحساب',
    personalInfo: 'المعلومات الشخصية',
    language: 'اللغة',
    preferencesSection: 'التفضيلات',
    fitOptimization: 'تحسين الت合身',
    fitOptimizationDesc: 'تحسين نتائج التجربة باستخدام معلومات الجسم',
    faceProtection: 'حماية الوجه',
    faceProtectionDesc: 'تغطية الوجه بماسك، عدم حفظ معلومات الوجه',
    backgroundRemoval: 'إزالة الخلفية',
    backgroundRemovalDesc: 'كشف وإزالة الخلفية تلقائياً، تميز الموضوع',
    legalSection: 'المساعدة و الدعم',
    privacyPolicy: 'سياسة الخصوصية',
    helpCenter: 'ملاحظات و اقتراحات'
  },
  
  // صفحة معلومات الجسم
  bodyProfile: {
    title: 'معلومات الجسم',
    height: 'الطول (سم)',
    weight: 'الوزن (كجم)',
    bust: 'الصدر (سم)',
    waist: 'الخصر (سم)',
    hips: 'الوركين (سم)',
    saveProfile: 'حفظ معلومات الجسم',
    profileSaved: 'تم حفظ معلومات الجسم بنجاح',
    enterHeight: 'يرجى إدخال الطول',
    enterWeight: 'يرجى إدخال الوزن',
    enterBust: 'يرجى إدخال الصدر',
    enterWaist: 'يرجى إدخال الخصر',
    enterHips: 'يرجى إدخال الوركين'
  },
  
  // صفحة عنا
  about: {
    title: 'عنا',
    version: 'الإصدار',
    description: 'Fitting Room AI+ هو تطبيق تجربة افتراضية يعتمد على تكنولوجيا الذكاء الاصطناعي، مما يسمح لك بتجربة أنماط الملابس المختلفة في المنزل.',
    features: 'المميزات الرئيسية',
    feature1: '• تجربة افتراضية',
    feature2: '• إدارة معلومات الجسم',
    feature3: '• إدارة الملابس',
    feature4: '• تاريخ التجربة',
    contact: 'اتصل بنا',
    email: 'البريد الإلكتروني',
    website: 'الموقع الإلكتروني'
  },
  
  // خيارات اللغة
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