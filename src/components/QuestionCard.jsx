import React from 'react';
import { motion } from 'framer-motion';

// Recebe via "props": 'question' (objeto da pergunta inteira) e 'onAnswer' (a função pra onde enviaremos a resposta)
const QuestionCard = ({ question, onAnswer }) => {
  return (
    // Componente principal do cartão com animação ao renderizar
    <motion.div 
      className="bg-cyber-card border border-cyber-border rounded-xl p-6 md:p-8 shadow-lg w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }} // Nasce invisível e mais abaixo
      animate={{ opacity: 1, y: 0 }}  // Sobe e fica visível
      exit={{ opacity: 0, x: -20 }}   // Desliza para a esquerda e some quando o usuário clica numa opção
      key={question.id} // Fundamental para que o Framer Motion saiba qual animação tocar em qual cartão
    >
      {/* Etiqueta com a categoria da pergunta (Ex: "Phishing") */}
      <div className="mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-400 bg-primary-900/30 px-3 py-1 rounded-full border border-primary-500/30">
          {question.categoria}
        </span>
      </div>
      
      {/* O texto grandão da pergunta */}
      <h2 className="text-xl md:text-2xl font-display font-medium text-white mb-8">
        {question.pergunta}
      </h2>
      
      {/* Área das Opções de Resposta */}
      <div className="flex flex-col gap-3">
        {/* Mapeia as opções disponíveis para desenhar os botões na tela */}
        {question.opcoes.map((opcao, index) => (
          <button
            key={index}
            // Ao clicar, chama a função handleAnswer (vinda do useQuizLogic) e manda a pontuação dela e o texto
            onClick={() => onAnswer(opcao.pontuacao, opcao.texto)}
            className="text-left w-full p-4 rounded-lg border border-cyber-border bg-cyber-dark/50 hover:bg-primary-900/20 hover:border-primary-500/50 transition-all duration-200 group"
          >
            <span className="text-slate-300 group-hover:text-white transition-colors">{opcao.texto}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
