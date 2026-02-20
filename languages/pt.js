// Configuração linguística portuguesa
module.exports = {
  // Comum
  common: {
    appName: 'Fitting Room AI+',
    save: 'Salvar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Excluir',
    edit: 'Editar',
    back: 'Voltar',
    loading: 'Carregando...',
    success: 'Sucesso',
    error: 'Erro',
    warning: 'Aviso',
    info: 'Informação'
  },
  
  // Navegação
  navigation: {
    wardrobe: 'Roupas',
    tryon: 'Experimentar',
    history: 'Histórico',
    profile: 'Perfil'
  },
  
  // Página de roupas
  wardrobe: {
    title: 'Meu Guardouro',
    addCloth: 'Adicionar Roupas',
    noClothes: 'Ainda não há roupas, clique para adicionar',
    uploadSuccess: 'Upload bem-sucedido',
    uploadFailed: 'Falha no upload',
    deleteConfirm: 'Tem certeza que deseja excluir este item?',
    deleteSuccess: 'Excluído com sucesso',
    editCloth: 'Editar Roupas',
    clothName: 'Nome da Roupa',
    clothCategory: 'Categoria da Roupa',
    saveChanges: 'Salvar Alterações'
  },
  
  // Página de experimentação
  tryon: {
    title: 'Experimentação Virtual',
    uploadPhoto: 'Enviar Foto',
    uploadCloth: 'Selecionar Roupas',
    startTryon: 'Iniciar Experimentação',
    tryonSuccess: 'Experimentação bem-sucedida',
    tryonFailed: 'Falha na experimentação',
    saveResult: 'Salvar Resultado',
    shareResult: 'Compartilhar Resultado',
    tryAnother: 'Experimentar Outro',
    selectPhoto: 'Por favor, selecione uma foto',
    selectCloth: 'Por favor, selecione roupas',
    processing: 'Processando...',
    clothingRequired: 'Por favor, selecione roupas primeiro',
    photoRequired: 'Por favor, envie uma foto primeiro',
    guideTitle: 'Exemplo de Imagem',
    clearFrontPhoto: 'Foto frontal clara',
    cleanBackground: 'Fundo limpo',
    goodLighting: 'Boa iluminação',
    iKnowStartUpload: 'Eu sei, iniciar upload',
    dontShowAgain: 'Não mostrar novamente',
    uploadYourPhoto: 'Envie sua foto',
    uploadFullBodyHint: 'Envie uma foto frontal do corpo inteiro para obter os melhores resultados',
    upper: 'Superior',
    lower: 'Inferior',
    suit: 'Traje',
    shoes: 'Sapatos e Chapéus',
    accessories: 'Acessórios',
    addUpper: 'Adicionar Superior',
    addLower: 'Adicionar Inferior',
    addSuit: 'Adicionar Traje',
    addShoes: 'Adicionar Sapatos e Chapéus',
    addAccessories: 'Adicionar Acessórios',
    empty: 'Vazio',
    addClothHint: 'Clique no botão superior esquerdo para adicionar roupas',
    tryonEffect: 'Efeito de Experimentação',
    saveEffect: 'Salvar Efeito',
    shareEffect: 'Compartilhar Efeito'
  },
  
  // Página de histórico
  history: {
    title: 'Histórico de Experimentação',
    noHistory: 'Ainda não há registros de experimentação',
    deleteHistory: 'Excluir Histórico',
    deleteAllConfirm: 'Tem certeza que deseja excluir todos os registros do histórico?',
    deleteSuccess: 'Excluído com sucesso',
    viewDetail: 'Ver Detalhes'
  },
  
  // Página de perfil
  profile: {
    title: 'Perfil',
    bodyProfile: 'Informações Corporais',
    height: 'Altura',
    weight: 'Peso',
    gender: 'Gênero',
    settings: 'Configurações',
    about: 'Sobre Nós',
    feedback: 'Feedback',
    logout: 'Sair',
    login: 'Entrar',
    myAccount: 'Minha Conta',
    myBody: 'Meus Dados Corporais',
    myWardrobe: 'Meu Guardouro',
    clothingCount: '24 itens',
    tryonHistory: 'Histórico de Experimentação',
    tryonCount: '128 experimentações',
    contactUs: 'Fale Conosco'
  },
  
  // Página de configurações
  settings: {
    title: 'Configurações',
    accountSection: 'Conta',
    personalInfo: 'Informações Pessoais',
    language: 'Idioma',
    preferencesSection: 'Preferências',
    fitOptimization: 'Otimização do Ajuste',
    fitOptimizationDesc: 'Otimizar resultados de experimentação com informações corporais',
    faceProtection: 'Proteção Facial',
    faceProtectionDesc: 'Cobrir rosto com máscara, não manter informações faciais',
    backgroundRemoval: 'Remoção de Fundo',
    backgroundRemovalDesc: 'Detectar e remover automaticamente o fundo, destacar o sujeito',
    legalSection: 'Ajuda & Suporte',
    privacyPolicy: 'Política de Privacidade',
    helpCenter: 'Feedback & Sugestões'
  },
  
  // Página de informações corporais
  bodyProfile: {
    title: 'Informações Corporais',
    height: 'Altura (cm)',
    weight: 'Peso (kg)',
    bust: 'Busto (cm)',
    waist: 'Cintura (cm)',
    hips: 'Quadril (cm)',
    saveProfile: 'Salvar Informações Corporais',
    profileSaved: 'Informações corporais salvas com sucesso',
    enterHeight: 'Por favor, insira a altura',
    enterWeight: 'Por favor, insira o peso',
    enterBust: 'Por favor, insira o busto',
    enterWaist: 'Por favor, insira a cintura',
    enterHips: 'Por favor, insira o quadril'
  },
  
  // Página Sobre Nós
  about: {
    title: 'Sobre Nós',
    version: 'Versão',
    description: 'Fitting Room AI+ é um aplicativo de experimentação virtual baseado em tecnologia de inteligência artificial, que permite experimentar diversos estilos de roupas em casa.',
    features: 'Recursos Principais',
    feature1: '• Experimentação Virtual',
    feature2: '• Gerenciamento de Informações Corporais',
    feature3: '• Gerenciamento de Guardouro',
    feature4: '• Histórico de Experimentação',
    contact: 'Fale Conosco',
    email: 'Email',
    website: 'Website'
  },
  
  // Opções de idioma
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