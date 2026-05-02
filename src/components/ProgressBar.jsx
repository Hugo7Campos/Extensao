import React from 'react';
import { motion } from 'framer-motion';

// Recebe o 'progress' que é um número de 0 a 100
const ProgressBar = ({ progress }) => {
  return (
    // Fundo cinza escuro da barra
    <div className="w-full bg-cyber-border rounded-full h-2.5 mb-6 overflow-hidden">
      {/* A parte azul (ou verde) que vai crescendo */}
      <motion.div 
        className="bg-primary-500 h-2.5 rounded-full glow-box"
        initial={{ width: 0 }} // Começa com largura zero
        animate={{ width: `${progress}%` }} // Cresce até a porcentagem que passamos
        transition={{ duration: 0.5, ease: "easeInOut" }} // Efeito suave
      ></motion.div>
    </div>
  );
};

export default ProgressBar;
