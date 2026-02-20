// 한국어 언어 설정
module.exports = {
  // 공통
  common: {
    appName: '피팅룸AI+',
    save: '저장',
    cancel: '취소',
    confirm: '확인',
    delete: '삭제',
    edit: '편집',
    back: '뒤로',
    loading: '로딩 중...',
    success: '성공',
    error: '오류',
    warning: '경고',
    info: '정보'
  },
  
  // 네비게이션
  navigation: {
    wardrobe: '옷장',
    tryon: '착용',
    history: '기록',
    profile: '프로필'
  },
  
  // 옷장 페이지
  wardrobe: {
    title: '내 옷장',
    addCloth: '옷 추가',
    noClothes: '아직 옷이 없습니다. 추가하세요',
    uploadSuccess: '업로드 성공',
    uploadFailed: '업로드 실패',
    deleteConfirm: '이 아이템을 삭제하시겠습니까?',
    deleteSuccess: '삭제 성공',
    editCloth: '옷 편집',
    clothName: '옷 이름',
    clothCategory: '옷 카테고리',
    saveChanges: '변경 저장'
  },
  
  // 착용 페이지
  tryon: {
    title: '가상 착용',
    uploadPhoto: '사진 업로드',
    uploadCloth: '옷 선택',
    startTryon: '착용 시작',
    tryonSuccess: '착용 성공',
    tryonFailed: '착용 실패',
    saveResult: '결과 저장',
    shareResult: '결과 공유',
    tryAnother: '다른 것 착용',
    selectPhoto: '사진을 선택하세요',
    selectCloth: '옷을 선택하세요',
    processing: '처리 중...',
    clothingRequired: '먼저 옷을 선택하세요',
    photoRequired: '먼저 사진을 업로드하세요',
    guideTitle: '예시 이미지',
    clearFrontPhoto: '명확한 정면 사진',
    cleanBackground: '깨끗한 배경',
    goodLighting: '충분한 조명',
    iKnowStartUpload: '알겠어요, 업로드 시작',
    dontShowAgain: '다시 표시하지 않기',
    uploadYourPhoto: '사진 업로드',
    uploadFullBodyHint: '최상의 착용 효과를 얻으려면 전신 정면 사진을 업로드하세요',
    upper: '상의',
    lower: '하의',
    suit: '정장',
    shoes: '신발 및 모자',
    accessories: '악세서리',
    addUpper: '상의 추가',
    addLower: '하의 추가',
    addSuit: '정장 추가',
    addShoes: '신발 및 모자 추가',
    addAccessories: '악세서리 추가',
    empty: '비어있음',
    addClothHint: '왼쪽 상단 버튼을 클릭하여 옷을 추가하세요',
    tryonEffect: '착용 효과',
    saveEffect: '효과 저장',
    shareEffect: '효과 공유'
  },
  
  // 기록 페이지
  history: {
    title: '착용 기록',
    noHistory: '아직 착용 기록이 없습니다',
    deleteHistory: '기록 삭제',
    deleteAllConfirm: '모든 기록을 삭제하시겠습니까?',
    deleteSuccess: '삭제 성공',
    viewDetail: '상세 보기'
  },
  
  // 프로필 페이지
  profile: {
    title: '프로필',
    bodyProfile: '신체 정보',
    height: '키',
    weight: '몸무게',
    gender: '성별',
    settings: '설정',
    about: '회사 소개',
    feedback: '피드백',
    logout: '로그아웃',
    login: '로그인',
    myAccount: '내 계정',
    myBody: '내 신체 데이터',
    myWardrobe: '내 옷장',
    clothingCount: '24개 아이템',
    tryonHistory: '착용 기록',
    tryonCount: '128회 착용',
    contactUs: '연락하기'
  },
  
  // 설정 페이지
  settings: {
    title: '설정',
    accountSection: '계정',
    personalInfo: '개인 정보',
    language: '언어',
    preferencesSection: '설정',
    fitOptimization: '착용 효과 최적화',
    fitOptimizationDesc: '신체 정보를 활용하여 착용 효과 최적화',
    faceProtection: '얼굴 보호',
    faceProtectionDesc: '마스크로 얼굴을 가리고 얼굴 정보를 저장하지 않음',
    backgroundRemoval: '배경 제거',
    backgroundRemovalDesc: '자동으로 배경을 감지하고 제거하여 주체를 강조',
    legalSection: '도움 & 지원',
    privacyPolicy: '개인정보 처리방침',
    helpCenter: '피드백 & 제안'
  },
  
  // 신체 정보 페이지
  bodyProfile: {
    title: '신체 정보',
    height: '키 (cm)',
    weight: '몸무게 (kg)',
    bust: '가슴둘레 (cm)',
    waist: '허리둘레 (cm)',
    hips: '엉덩이둘레 (cm)',
    saveProfile: '신체 정보 저장',
    profileSaved: '신체 정보가 성공적으로 저장되었습니다',
    enterHeight: '키를 입력하세요',
    enterWeight: '몸무게를 입력하세요',
    enterBust: '가슴둘레를 입력하세요',
    enterWaist: '허리둘레를 입력하세요',
    enterHips: '엉덩이둘레를 입력하세요'
  },
  
  // 회사 소개 페이지
  about: {
    title: '회사 소개',
    version: '버전',
    description: 'Fitting Room AI+는 인공지능 기술 기반의 가상 착용 애플리케이션으로, 집에서 다양한 옷 스타일을 경험할 수 있습니다.',
    features: '주요 기능',
    feature1: '• 가상 착용',
    feature2: '• 신체 정보 관리',
    feature3: '• 옷장 관리',
    feature4: '• 착용 기록',
    contact: '연락하기',
    email: '이메일',
    website: '웹사이트'
  },
  
  // 언어 옵션
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