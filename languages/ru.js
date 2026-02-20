// Русская языковая конфигурация
module.exports = {
  // Общие
  common: {
    appName: 'Fitting Room AI+',
    save: 'Сохранить',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    delete: 'Удалить',
    edit: 'Редактировать',
    back: 'Назад',
    loading: 'Загрузка...',
    success: 'Успех',
    error: 'Ошибка',
    warning: 'Предупреждение',
    info: 'Информация'
  },
  
  // Навигация
  navigation: {
    wardrobe: 'Гардероб',
    tryon: 'Примерить',
    history: 'История',
    profile: 'Профиль'
  },
  
  // Страница гардероба
  wardrobe: {
    title: 'Мой гардероб',
    addCloth: 'Добавить одежду',
    noClothes: 'Пока нет одежды, нажмите, чтобы добавить',
    uploadSuccess: 'Загрузка успешна',
    uploadFailed: 'Загрузка не удалась',
    deleteConfirm: 'Вы уверены, что хотите удалить этот предмет?',
    deleteSuccess: 'Удаление успешно',
    editCloth: 'Редактировать одежду',
    clothName: 'Название одежды',
    clothCategory: 'Категория одежды',
    saveChanges: 'Сохранить изменения'
  },
  
  // Страница примерки
  tryon: {
    title: 'Виртуальная примерка',
    uploadPhoto: 'Загрузить фото',
    uploadCloth: 'Выбрать одежду',
    startTryon: 'Начать примерку',
    tryonSuccess: 'Примерка успешна',
    tryonFailed: 'Примерка не удалась',
    saveResult: 'Сохранить результат',
    shareResult: 'Поделиться результатом',
    tryAnother: 'Попробовать другое',
    selectPhoto: 'Пожалуйста, выберите фото',
    selectCloth: 'Пожалуйста, выберите одежду',
    processing: 'Обработка...',
    clothingRequired: 'Пожалуйста, сначала выберите одежду',
    photoRequired: 'Пожалуйста, сначала загрузите фото',
    guideTitle: 'Пример изображения',
    clearFrontPhoto: 'Четкое фронтальное фото',
    cleanBackground: 'Чистый фон',
    goodLighting: 'Хорошее освещение',
    iKnowStartUpload: 'Я знаю, начать загрузку',
    dontShowAgain: 'Не показывать снова',
    uploadYourPhoto: 'Загрузите ваше фото',
    uploadFullBodyHint: 'Загрузите полное фронтальное фото тела для получения лучших результатов',
    upper: 'Верхняя одежда',
    lower: 'Нижняя одежда',
    suit: 'Костюм',
    shoes: 'Обувь и головные уборы',
    accessories: 'Аксессуары',
    addUpper: 'Добавить верхнюю одежду',
    addLower: 'Добавить нижнюю одежду',
    addSuit: 'Добавить костюм',
    addShoes: 'Добавить обувь и головные уборы',
    addAccessories: 'Добавить аксессуары',
    empty: 'Пусто',
    addClothHint: 'Нажмите кнопку в верхнем левом углу, чтобы добавить одежду',
    tryonEffect: 'Эффект примерки',
    saveEffect: 'Сохранить эффект',
    shareEffect: 'Поделиться эффектом'
  },
  
  // Страница истории
  history: {
    title: 'История примерок',
    noHistory: 'Пока нет записей примерок',
    deleteHistory: 'Удалить историю',
    deleteAllConfirm: 'Вы уверены, что хотите удалить все записи истории?',
    deleteSuccess: 'Удаление успешно',
    viewDetail: 'Просмотреть детали'
  },
  
  // Страница профиля
  profile: {
    title: 'Профиль',
    bodyProfile: 'Информация о теле',
    height: 'Рост',
    weight: 'Вес',
    gender: 'Пол',
    settings: 'Настройки',
    about: 'О нас',
    feedback: 'Обратная связь',
    logout: 'Выйти из аккаунта',
    login: 'Войти',
    myAccount: 'Мой аккаунт',
    myBody: 'Мои данные тела',
    myWardrobe: 'Мой гардероб',
    clothingCount: '24 предмета одежды',
    tryonHistory: 'История примерок',
    tryonCount: '128 примерок',
    contactUs: 'Связаться с нами'
  },
  
  // Страница настроек
  settings: {
    title: 'Настройки',
    accountSection: 'Аккаунт',
    personalInfo: 'Личная информация',
    language: 'Язык',
    preferencesSection: 'Предпочтения',
    fitOptimization: 'Оптимизация посадки',
    fitOptimizationDesc: 'Оптимизировать результаты примерки с помощью информации о теле',
    faceProtection: 'Защита лица',
    faceProtectionDesc: 'Скрыть лицо маской, не сохранять информацию о лице',
    backgroundRemoval: 'Удаление фона',
    backgroundRemovalDesc: 'Автоматически обнаруживать и удалять фон, выделять субъект',
    legalSection: 'Помощь & Поддержка',
    privacyPolicy: 'Политика конфиденциальности',
    helpCenter: 'Обратная связь & Предложения'
  },
  
  // Страница информации о теле
  bodyProfile: {
    title: 'Информация о теле',
    height: 'Рост (см)',
    weight: 'Вес (кг)',
    bust: 'Грудь (см)',
    waist: 'Талия (см)',
    hips: 'Бедра (см)',
    saveProfile: 'Сохранить информацию о теле',
    profileSaved: 'Информация о теле успешно сохранена',
    enterHeight: 'Пожалуйста, введите рост',
    enterWeight: 'Пожалуйста, введите вес',
    enterBust: 'Пожалуйста, введите грудь',
    enterWaist: 'Пожалуйста, введите талию',
    enterHips: 'Пожалуйста, введите бедра'
  },
  
  // Страница О нас
  about: {
    title: 'О нас',
    version: 'Версия',
    description: 'Fitting Room AI+ — это приложение для виртуальной примерки на основе технологий искусственного интеллекта, позволяющее вам испытать различные стили одежды дома.',
    features: 'Ключевые особенности',
    feature1: '• Виртуальная примерка',
    feature2: '• Управление информацией о теле',
    feature3: '• Управление гардеробом',
    feature4: '• История примерок',
    contact: 'Связаться с нами',
    email: 'Электронная почта',
    website: 'Веб-сайт'
  },
  
  // Языковые опции
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