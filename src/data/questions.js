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
    vulnerabilidade: 'Você corre grande risco de cair em Phishing, onde criminosos se passam por instituições confiáveis.'
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
    vulnerabilidade: 'Risco alto de fraude no WhatsApp. Golpistas frequentemente clonam contas ou usam fotos reais em números novos.'
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
    vulnerabilidade: 'Reutilizar senhas significa que se um site for hackeado, todas as suas outras contas correm risco.'
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
    vulnerabilidade: 'Promoções milagrosas geralmente são lojas falsas que nunca entregam o produto.'
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
    vulnerabilidade: 'Acesso remoto permite que golpistas instalem malwares ou roubem dados bancários.'
  }
];
