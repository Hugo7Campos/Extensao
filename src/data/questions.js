// Array que armazena todas as perguntas do Quiz
// Isso facilita a manutenção: para adicionar novas perguntas, basta adicionar um objeto aqui
export const questions = [
  {
    id: 1,
    categoria: 'Phishing', // Categoria para classificar a estatística
    pergunta: 'Você recebe um e-mail informando que sua conta bancária foi bloqueada e pedindo para clicar em um link para verificar. O que você faz?',
    // Cada opção tem um texto e uma pontuação de risco. Quanto maior a pontuação, pior a ação.
    opcoes: [
      { texto: 'Clico no link para resolver logo', pontuacao: 10 },
      { texto: 'Respondo o e-mail perguntando o que aconteceu', pontuacao: 5 },
      { texto: 'Ignoro e acesso o app do meu banco para conferir', pontuacao: 0 },
      { texto: 'Acesso pelo link mas não coloco minha senha', pontuacao: 8 }
    ],
    // Mensagem de alerta caso o usuário escolha uma resposta com pontuação alta (risco)
    nomeGolpe: 'Phishing Bancário',
    oQueE: 'Phishing é uma técnica de engenharia social usada para enganar usuários e obter informações confidenciais, como senhas e dados bancários. Os golpistas se passam por entidades confiáveis.',
    recomendacao: 'Nunca clique em links enviados por e-mail ou SMS. Sempre abra o aplicativo oficial do banco ou digite o site no navegador para verificar notificações.'
  },
  {
    id: 2,
    categoria: 'Golpes em WhatsApp',
    pergunta: 'Um amigo manda mensagem no WhatsApp de um número novo pedindo dinheiro emprestado urgente. O que você faz?',
    opcoes: [
      { texto: 'Transfiro na hora, é meu amigo', pontuacao: 10 },
      { texto: 'Peço para mandar um áudio confirmando', pontuacao: 3 },
      { texto: 'Ligo para o número antigo dele para confirmar', pontuacao: 0 },
      { texto: 'Faço perguntas pessoais que só ele saberia', pontuacao: 1 }
    ],
    nomeGolpe: 'Golpe do WhatsApp Clonado / Falso Perfil',
    oQueE: 'Ocorre quando um golpista cria um perfil falso no WhatsApp com a foto de um conhecido ou clona a conta, pedindo transferências via PIX sob a desculpa de uma emergência.',
    recomendacao: 'Nunca transfira dinheiro sem antes ligar para a pessoa por chamada de voz (no número antigo) para confirmar a história.'
  },
  {
    id: 3,
    categoria: 'Senhas',
    pergunta: 'Você costuma reutilizar a mesma senha em vários sites?',
    opcoes: [
      { texto: 'Sim, em quase todos (é mais fácil lembrar)', pontuacao: 10 },
      { texto: 'Às vezes, nos sites menos importantes', pontuacao: 5 },
      { texto: 'Não, uso um gerenciador de senhas', pontuacao: 0 }
    ],
    nomeGolpe: 'Reutilização de Senhas (Credential Stuffing)',
    oQueE: 'A reutilização de senhas permite que cibercriminosos usem senhas vazadas de um site em outros serviços (Credential Stuffing), acessando várias contas com o mesmo login.',
    recomendacao: 'Use senhas únicas e fortes para cada serviço e utilize um gerenciador de senhas confiável.'
  },
  {
    id: 4,
    categoria: 'Compras Online',
    pergunta: 'Você vê um anúncio de um smartphone lançamento por 30% do preço original. A loja é desconhecida. Qual sua ação?',
    opcoes: [
      { texto: 'Compro imediatamente antes que acabe', pontuacao: 10 },
      { texto: 'Pesquiso no Reclame Aqui antes', pontuacao: 2 },
      { texto: 'Ignoro, parece bom demais para ser verdade', pontuacao: 0 }
    ],
    nomeGolpe: 'Golpe da Falsa Loja Virtual',
    oQueE: 'Criação de sites de e-commerce falsos que oferecem produtos por preços muito abaixo do mercado. O cliente paga, mas nunca recebe o produto.',
    recomendacao: 'Desconfie de preços muito baixos. Verifique a reputação da loja em sites como o Reclame Aqui e confirme se o site possui conexões seguras.'
  },
  {
    id: 5,
    categoria: 'Engenharia Social',
    pergunta: 'Alguém liga dizendo ser do suporte técnico da Microsoft, informando que seu PC tem um vírus e pede acesso remoto. O que você faz?',
    opcoes: [
      { texto: 'Dou o acesso, preciso resolver isso', pontuacao: 10 },
      { texto: 'Pergunto como eles descobriram', pontuacao: 5 },
      { texto: 'Desligo na hora, a Microsoft não liga para clientes assim', pontuacao: 0 }
    ],
    nomeGolpe: 'Golpe do Falso Suporte Técnico',
    oQueE: 'Golpistas entram em contato passando-se por empresas de tecnologia e afirmam que seu computador está com problemas, convencendo você a instalar um software de acesso remoto.',
    recomendacao: 'Nunca conceda acesso remoto a desconhecidos. Empresas como Microsoft não ligam para usuários de forma proativa para relatar problemas.'
  },
  {
    id: 6,
    categoria: 'Redes Sociais',
    pergunta: 'Alguém que você não conhece manda uma mensagem com um link dizendo "Olha essa foto sua que vazou!". Qual a sua reação?',
    opcoes: [
      { texto: 'Clico imediatamente para ver o que é', pontuacao: 10 },
      { texto: 'Pergunto quem é antes de clicar', pontuacao: 5 },
      { texto: 'Bloqueio o contato e não clico', pontuacao: 0 }
    ],
    nomeGolpe: 'Golpe do Link Malicioso',
    oQueE: 'Uso de links falsos enviados via DM que direcionam para páginas de login falsas (phishing) ou baixam malwares no dispositivo.',
    recomendacao: 'Não clique em links de desconhecidos ou links suspeitos enviados por amigos (a conta deles pode ter sido hackeada). Confirme com a pessoa antes.'
  },
  {
    id: 7,
    categoria: 'Wi-Fi Público',
    pergunta: 'Você está em um aeroporto e vê uma rede Wi-Fi aberta chamada "Wi-Fi Gratis Aeroporto". O que você faz?',
    opcoes: [
      { texto: 'Conecto e acesso meu banco para pagar contas', pontuacao: 10 },
      { texto: 'Conecto, mas só olho redes sociais', pontuacao: 5 },
      { texto: 'Não conecto ou uso apenas com uma VPN ativada', pontuacao: 0 }
    ],
    nomeGolpe: 'Interceptação de Dados (Man-in-the-Middle)',
    oQueE: 'Em redes Wi-Fi públicas e não seguras, criminosos podem interceptar o tráfego da rede, roubando senhas, dados de cartão e informações pessoais que você digita.',
    recomendacao: 'Evite acessar bancos ou digitar senhas em Wi-Fi público. Se for necessário, utilize uma VPN (Rede Privada Virtual) confiável.'
  },
  {
    id: 8,
    categoria: 'Sorteios Falsos',
    pergunta: 'Você é marcado no Instagram num sorteio de um iPhone. Para ganhar, pedem que clique no link da bio e insira seu CPF e telefone.',
    opcoes: [
      { texto: 'Preencho os dados, vai que eu ganho', pontuacao: 10 },
      { texto: 'Coloco dados falsos só para ver', pontuacao: 4 },
      { texto: 'Denuncio a página como spam ou fraude', pontuacao: 0 }
    ],
    nomeGolpe: 'Golpe do Falso Sorteio / Roubo de Identidade',
    oQueE: 'Páginas falsas prometem prêmios valiosos em troca de dados pessoais. Esses dados são posteriormente usados para abrir contas falsas, solicitar cartões de crédito ou aplicar golpes.',
    recomendacao: 'Não forneça dados pessoais (CPF, telefone) em links suspeitos ou perfis não verificados. Denuncie páginas falsas.'
  },
  {
    id: 9,
    categoria: 'Atualizações',
    pergunta: 'Seu celular ou computador pede para instalar uma atualização de sistema. Como você procede?',
    opcoes: [
      { texto: 'Ignoro sempre, ocupa muito espaço', pontuacao: 8 },
      { texto: 'Instalo apenas quando começa a travar', pontuacao: 5 },
      { texto: 'Instalo o mais rápido possível', pontuacao: 0 }
    ],
    nomeGolpe: 'Exploração de Vulnerabilidades Conhecidas (Exploits)',
    oQueE: 'Sistemas operacionais e aplicativos desatualizados possuem falhas de segurança já conhecidas, que hackers utilizam para invadir dispositivos e instalar malwares.',
    recomendacao: 'Mantenha o sistema operacional e todos os aplicativos sempre atualizados. Ative as atualizações automáticas sempre que possível.'
  },
  {
    id: 10,
    categoria: 'Autenticação',
    pergunta: 'Você utiliza Autenticação de Dois Fatores (2FA) nas suas contas principais (e-mail, redes sociais)?',
    opcoes: [
      { texto: 'Não, acho muito chato colocar código', pontuacao: 10 },
      { texto: 'Só em algumas, como no WhatsApp', pontuacao: 4 },
      { texto: 'Sim, em todas as contas importantes', pontuacao: 0 }
    ],
    nomeGolpe: 'Acesso Indevido por Falta de 2FA',
    oQueE: 'A ausência de Autenticação de Dois Fatores (2FA) significa que, se sua senha for descoberta, nada impede o invasor de acessar sua conta imediatamente.',
    recomendacao: 'Ative a Autenticação de Dois Fatores (2FA) em todas as contas possíveis, preferencialmente utilizando aplicativos autenticadores (como Google Authenticator) em vez de SMS.'
  }
];
