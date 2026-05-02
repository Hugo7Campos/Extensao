// Função que avalia o score total e retorna um perfil de risco com cores e mensagens
export const calculateRisk = (scoreTotal) => {
  if (scoreTotal <= 15) {
    return {
      nivel: 'Baixo Risco',
      cor: 'text-green-400', // Classe CSS para cor do texto
      corBg: 'bg-green-400', // Classe CSS para cor de fundo
      mensagem: 'Você tem bons hábitos de segurança digital. Continue assim!'
    };
  } else if (scoreTotal <= 30) {
    return {
      nivel: 'Risco Médio',
      cor: 'text-yellow-400',
      corBg: 'bg-yellow-400',
      mensagem: 'Você tem conhecimento básico, mas ainda pode cair em golpes sofisticados.'
    };
  } else {
    return {
      nivel: 'Alto Risco',
      cor: 'text-cyber-alert',
      corBg: 'bg-cyber-alert',
      mensagem: 'Cuidado! Você está altamente vulnerável a golpes digitais.'
    };
  }
};

// Função de "IA Básica": Analisa o que o usuário respondeu
// Se ele escolheu opções de alto risco (>= 5 pontos), ele coleta a mensagem de vulnerabilidade
export const analyzeVulnerabilities = (respostas, questions) => {
  const vulnerabilidades = [];
  
  // Percorre todas as respostas do usuário
  respostas.forEach(resp => {
    // Busca a pergunta original baseada no ID
    const pergunta = questions.find(q => q.id === resp.pergunta_id);
    
    // Se a pontuação dessa resposta for alta, consideramos uma vulnerabilidade comportamental
    if (resp.pontuacao >= 5 && pergunta) {
      vulnerabilidades.push({
        categoria: pergunta.categoria,
        mensagem: pergunta.vulnerabilidade
      });
    }
  });

  return vulnerabilidades; // Retorna a lista de pontos fracos detectados
};
