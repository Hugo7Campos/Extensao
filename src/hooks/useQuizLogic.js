// Importa hooks do React. useState para estados e useNavigate para mudar de página
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { questions } from '../data/questions';

// Hook customizado que controla toda a lógica do formulário interativo (o "motor" do Quiz)
export const useQuizLogic = () => {
  // Estado que guarda o índice da pergunta atual (começa na 0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Estado que guarda as respostas que o usuário já escolheu
  const [respostas, setRespostas] = useState([]);
  
  // Usado para redirecionar o usuário para a página de resultados ao final e pegar parâmetros
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extrai o nome do usuário passado na URL
  const searchParams = new URLSearchParams(location.search);
  const userName = searchParams.get('name') || 'Anônimo';

  // Função chamada toda vez que o usuário clica em uma resposta
  const handleAnswer = (pontuacao, respostaTexto) => {
    // Pega a pergunta atual baseada no índice
    const currentQuestion = questions[currentQuestionIndex];
    
    // Cria um objeto com os dados da resposta atual
    const novaResposta = {
      pergunta_id: currentQuestion.id,
      resposta: respostaTexto,
      pontuacao: pontuacao
    };

    // Adiciona a nova resposta na lista de respostas anteriores
    const novasRespostas = [...respostas, novaResposta];
    setRespostas(novasRespostas); // Atualiza o estado

    // Verifica se ainda existem mais perguntas
    if (currentQuestionIndex < questions.length - 1) {
      // Se tiver, vai para a próxima pergunta
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Se for a última pergunta:
      // Soma a pontuação de todas as respostas usando a função reduce()
      const scoreTotal = novasRespostas.reduce((acc, curr) => acc + curr.pontuacao, 0);
      
      // Navega para a página de resultado ('/result') e envia os dados (score, respostas, nome) junto
      navigate('/result', { state: { scoreTotal, respostas: novasRespostas, userName } });
    }
  };

  // O Hook retorna as variáveis e funções para serem usadas no componente visual
  return {
    currentQuestion: questions[currentQuestionIndex], // Pergunta a ser exibida agora
    currentQuestionIndex, // Índice atual
    totalQuestions: questions.length, // Quantidade total de perguntas
    handleAnswer, // Função para registrar resposta
    progress: ((currentQuestionIndex) / questions.length) * 100 // Calcula a porcentagem da barra de progresso
  };
};
