import React from 'react';
// Importação do Hook customizado que contém toda a lógica do Quiz (estado, pontuação, troca de perguntas)
import { useQuizLogic } from '../hooks/useQuizLogic';
// Componentes de interface (UI)
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
// Componente do Framer Motion para gerenciar animações de entrada e saída
import { AnimatePresence } from 'framer-motion';

/**
 * Componente Quiz
 * Esta é a tela onde as perguntas são exibidas uma a uma.
 */
const Quiz = () => {
  /**
   * Desestruturação do Hook useQuizLogic:
   * currentQuestion: Objeto com a pergunta atual
   * currentQuestionIndex: Posição da pergunta (0, 1, 2...)
   * totalQuestions: Quantidade total de perguntas no banco
   * handleAnswer: Função disparada quando o usuário escolhe uma opção
   * progress: Porcentagem de conclusão do quiz (0 a 100)
   */
  const { currentQuestion, currentQuestionIndex, totalQuestions, handleAnswer, progress } = useQuizLogic();

  return (
    <div className="max-w-3xl mx-auto w-full py-8 flex flex-col min-h-[60vh]">
      
      {/* SEÇÃO SUPERIOR: Título e Barra de Progresso */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-2xl font-display font-bold text-white glow-text">Avaliação de Risco</h2>
          {/* Exibição dinâmica do contador: Pergunta X de Y */}
          <span className="text-primary-400 text-sm font-medium bg-primary-950/30 px-3 py-1 rounded-full border border-primary-500/20">
            Questão {currentQuestionIndex + 1} / {totalQuestions}
          </span>
        </div>
        
        {/* Barra visual que enche conforme o usuário avança */}
        <ProgressBar progress={progress} />
      </div>

      {/* SEÇÃO CENTRAL: Área da Pergunta */}
      <div className="flex-grow flex items-center justify-center relative w-full overflow-hidden">
        {/* 
            AnimatePresence mode="wait" é essencial para o efeito de "slide":
            Ele garante que a pergunta atual termine sua animação de saída
            antes que a próxima pergunta comece a animação de entrada.
        */}
        <AnimatePresence mode="wait">
          {/* Só renderiza o QuestionCard se houver uma pergunta disponível */}
          {currentQuestion && (
            <QuestionCard 
              key={currentQuestion.id}    // Chave única para o React e Framer Motion identificarem a troca
              question={currentQuestion}  // Dados da pergunta (título, categoria, opções)
              onAnswer={handleAnswer}     // Callback para processar a resposta
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Dica de rodapé sutil */}
      <p className="text-center text-slate-500 text-xs mt-8">
        Responda com sinceridade para obter um resultado preciso sobre sua segurança digital.
      </p>
    </div>
  );
};

export default Quiz;

