import React from 'react';
import { motion } from 'framer-motion';
// Ícones correspondentes a cada nível de risco
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

const ResultCard = ({ scoreTotal, resultado }) => {
  // Função auxiliar que decide qual ícone desenhar com base no nível
  const getIcon = () => {
    if (resultado.nivel === 'Baixo Risco') return <ShieldCheck className="w-16 h-16 text-green-400" />;
    if (resultado.nivel === 'Risco Médio') return <Shield className="w-16 h-16 text-yellow-400" />;
    return <ShieldAlert className="w-16 h-16 text-cyber-alert" />;
  };

  return (
    // Caixa principal do resultado
    <motion.div 
      className="bg-cyber-card border border-cyber-border rounded-xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] text-center relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Uma linha colorida no topo do card que muda de cor (Verde/Amarelo/Vermelho) */}
      <div className={`absolute top-0 left-0 w-full h-2 ${resultado.corBg}`}></div>
      
      <div className="flex justify-center mb-6">
        <div className={`p-4 rounded-full bg-cyber-dark border ${resultado.cor.replace('text', 'border')} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
          {getIcon()}
        </div>
      </div>
      
      {/* Exibe o texto Score e o número do lado */}
      <h2 className="text-3xl font-display font-bold text-white mb-2">
        Score: <span className={resultado.cor}>{scoreTotal}</span>/50
      </h2>
      
      {/* Título de Alto/Médio/Baixo risco */}
      <h3 className={`text-2xl font-bold font-display uppercase tracking-widest mb-6 ${resultado.cor}`}>
        {resultado.nivel}
      </h3>
      
      {/* Mensagem principal de feedback */}
      <p className="text-slate-300 text-lg mb-8 max-w-md mx-auto">
        {resultado.mensagem}
      </p>
    </motion.div>
  );
};

export default ResultCard;
