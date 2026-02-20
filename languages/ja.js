// 日本語言語設定
module.exports = {
  // 共通
  common: {
    appName: 'フィッティングルームAI+',
    save: '保存',
    cancel: 'キャンセル',
    confirm: '確認',
    delete: '削除',
    edit: '編集',
    back: '戻る',
    loading: '読み込み中...',
    success: '成功',
    error: 'エラー',
    warning: '警告',
    info: '情報'
  },
  
  // ナビゲーション
  navigation: {
    wardrobe: '洋服',
    tryon: '試着',
    history: '履歴',
    profile: 'プロフィール'
  },
  
  // 洋服ページ
  wardrobe: {
    title: 'マイウォードローブ',
    addCloth: '服を追加',
    noClothes: 'まだ服がありません。追加してください',
    uploadSuccess: 'アップロード成功',
    uploadFailed: 'アップロード失敗',
    deleteConfirm: 'このアイテムを削除しますか？',
    deleteSuccess: '削除成功',
    editCloth: '服を編集',
    clothName: '服の名前',
    clothCategory: '服のカテゴリー',
    saveChanges: '変更を保存'
  },
  
  // 試着ページ
  tryon: {
    title: 'バーチャル試着',
    uploadPhoto: '写真をアップロード',
    uploadCloth: '服を選択',
    startTryon: '試着を開始',
    tryonSuccess: '試着成功',
    tryonFailed: '試着失敗',
    saveResult: '結果を保存',
    shareResult: '結果を共有',
    tryAnother: '他の服を試す',
    selectPhoto: '写真を選択してください',
    selectCloth: '服を選択してください',
    processing: '処理中...',
    clothingRequired: 'まず服を選択してください',
    photoRequired: 'まず写真をアップロードしてください',
    guideTitle: '例の画像',
    clearFrontPhoto: '正面の写真を明確に',
    cleanBackground: '背景をクリーンに',
    goodLighting: '十分な照明',
    iKnowStartUpload: 'わかりました、アップロードを開始',
    dontShowAgain: '再度表示しない',
    uploadYourPhoto: 'あなたの写真をアップロード',
    uploadFullBodyHint: '最適な試着効果を得るには、全身の正面写真をアップロードしてください',
    upper: '上着',
    lower: '下着',
    suit: 'スーツ',
    shoes: '靴と帽子',
    accessories: 'アクセサリー',
    addUpper: '上着を追加',
    addLower: '下着を追加',
    addSuit: 'スーツを追加',
    addShoes: '靴と帽子を追加',
    addAccessories: 'アクセサリーを追加',
    empty: '空',
    addClothHint: '左上のボタンをクリックして服を追加',
    tryonEffect: '試着効果',
    saveEffect: '効果を保存',
    shareEffect: '効果を共有'
  },
  
  // 履歴ページ
  history: {
    title: '試着履歴',
    noHistory: 'まだ試着記録がありません',
    deleteHistory: '履歴を削除',
    deleteAllConfirm: 'すべての履歴記録を削除しますか？',
    deleteSuccess: '削除成功',
    viewDetail: '詳細を表示'
  },
  
  // プロフィールページ
  profile: {
    title: 'プロフィール',
    bodyProfile: '身体情報',
    height: '身長',
    weight: '体重',
    gender: '性別',
    settings: '設定',
    about: '会社概要',
    feedback: 'フィードバック',
    logout: 'ログアウト',
    login: 'ログイン',
    myAccount: 'マイアカウント',
    myBody: 'マイボディデータ',
    myWardrobe: 'マイウォードローブ',
    clothingCount: '24アイテム',
    tryonHistory: '試着履歴',
    tryonCount: '128回の試着',
    contactUs: 'お問い合わせ'
  },
  
  // 設定ページ
  settings: {
    title: '設定',
    accountSection: 'アカウント',
    personalInfo: '個人情報',
    language: '言語',
    preferencesSection: '設定',
    fitOptimization: 'フィット最適化',
    fitOptimizationDesc: '身体情報を活用して試着効果を最適化',
    faceProtection: '顔の保護',
    faceProtectionDesc: 'マスクで顔を覆い、顔の情報を保存しません',
    backgroundRemoval: '背景削除',
    backgroundRemovalDesc: '自動的に背景を検出・削除し、被写体を強調',
    legalSection: 'ヘルプ＆サポート',
    privacyPolicy: 'プライバシーポリシー',
    helpCenter: 'フィードバック＆提案'
  },
  
  // 身体情報ページ
  bodyProfile: {
    title: '身体情報',
    height: '身長 (cm)',
    weight: '体重 (kg)',
    bust: 'バスト (cm)',
    waist: 'ウエスト (cm)',
    hips: 'ヒップ (cm)',
    saveProfile: '身体情報を保存',
    profileSaved: '身体情報が正常に保存されました',
    enterHeight: '身長を入力してください',
    enterWeight: '体重を入力してください',
    enterBust: 'バストを入力してください',
    enterWaist: 'ウエストを入力してください',
    enterHips: 'ヒップを入力してください'
  },
  
  // 会社概要ページ
  about: {
    title: '会社概要',
    version: 'バージョン',
    description: 'Fitting Room AI+は、人工知能技術に基づくバーチャル試着アプリケーションであり、自宅で様々な服のスタイルを体験することができます。',
    features: '主な機能',
    feature1: '• バーチャル試着',
    feature2: '• 身体情報管理',
    feature3: '• ウォードローブ管理',
    feature4: '• 試着履歴',
    contact: 'お問い合わせ',
    email: 'メール',
    website: 'ウェブサイト'
  },
  
  // 言語オプション
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