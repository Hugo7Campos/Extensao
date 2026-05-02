import React from 'react';
// Hook customizado com toda a lógica (o "motor" das perguntas que construímos)
import { useQuizLogic } from '../hooks/useQuizLogic';
// Componentes criados para o layout ficar organizado
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
// Permite que componentes que somem da tela tenham uma animação de saída suave
import { AnimatePresence } from 'framer-motion';

const Quiz = () => {
  // Pega todas as variáveis e funções necessárias do nosso motor
  const { currentQuestion, currentQuestionIndex, totalQuestions, handleAnswer, progress } = useQuizLogic();

  return (
    <div className="max-w-3xl mx-auto w-full py-8 flex flex-col min-h-[60vh]">
      
      {/* Cabeçalho do Quiz com título e contador */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-2xl font-display font-bold text-white">Avaliação de Risco</h2>
          {/* Exemplo: Pergunta 1 de 5 */}
          <span className="text-primary-400 text-sm font-medium">
            Pergunta {currentQuestionIndex + 1} de {totalQuestions}
          </span>
        </div>
        
        {/* Exibe a barra de progresso verde/azul passando a porcentagem atual calculada no Hook */}
        <ProgressBar progress={progress} />
      </div>

      {/* Área onde a pergunta em si vai renderizar */}
      <div className="flex-grow flex items-center justify-center relative w-full">
        {/* AnimatePresence mode="wait" garante que a pergunta atual suma antes da próxima aparecer */}
        <AnimatePresence mode="wait">
          {/* Se currentQuestion existir (não for nulo), desenha o cartão da pergunta na tela */}
          {currentQuestion && (
            <QuestionCard 
              key={currentQuestion.id} // key é importante para o Framer Motion saber que o item mudou e disparar a animação
              question={currentQuestion} // Passa os textos da pergunta e opções
              onAnswer={handleAnswer}    // Passa a função que executa quando o usuário clicar numa opção
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
