import React, { useEffect, useState } from 'react';
// useNavigate é o hook do React Router para trocar de página via código
import { useNavigate } from 'react-router-dom';
// Biblioteca de ícones
import { Shield, AlertTriangle, UserCheck, ChevronRight } from 'lucide-react';
// Biblioteca para animações
import { motion } from 'framer-motion';
// Instância do Supabase para interações com o banco
import { supabase } from '../services/supabase';

/**
 * Página Inicial (Home)
 * Ponto de entrada do usuário onde ele informa o nome para começar o teste.
 */
const Home = () => {
  const navigate = useNavigate();
  // Estado para armazenar o nome digitado no input
  const [userName, setUserName] = useState('');
  // Estado para gerenciar mensagens de erro de validação
  const [error, setError] = useState('');

  /**
   * Teste de conexão silencioso
   * Apenas para verificar no console se o Supabase está respondendo.
   */
  useEffect(() => {
    const testarConexao = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ Falha na conexão com Supabase:', error.message);
        } else {
          console.log('✅ Conectado ao Supabase com sucesso!');
        }
      } catch (err) {
        console.error('❌ Erro na conexão:', err.message);
      }
    };
    
    testarConexao();
  }, []);

  /**
   * Função chamada ao clicar no botão "Começar"
   * Valida se o nome foi preenchido e redireciona para o Quiz.
   */
  const handleStart = () => {
    const finalName = userName.trim();
    if (!finalName) {
      setError('Por favor, digite seu nome para continuar.');
      return;
    }
    
    // Navega para a rota /quiz e passa o nome como parâmetro na URL (Query String)
    navigate(`/quiz?name=${encodeURIComponent(finalName)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 px-4 sm:px-6 text-center">
      
      {/* Seção Hero - Destaque principal da página com animação de escala */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl"
      >
        <Shield className="w-20 h-20 text-cyber-neon mx-auto mb-6 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display text-white">
          Descubra o seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyber-neon glow-text">Nível de Risco</span> na Internet
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          A cada segundo, uma pessoa cai em um golpe online no Brasil. Você está realmente seguro? 
          Faça nosso teste interativo baseado em situações reais e receba uma análise do seu perfil digital.
        </p>
        
        {/* Bloco de Entrada do Usuário */}
        <div className="mt-8 max-w-md mx-auto bg-cyber-dark p-6 rounded-xl border border-cyber-border shadow-2xl relative overflow-hidden">
          {/* Brilho de fundo sutil */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <label htmlFor="userName" className="block text-slate-300 mb-3 text-left font-medium">
            Digite seu nome para começar:
          </label>
          <input 
            type="text" 
            id="userName"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              if (error) setError(''); // Limpa o erro enquanto o usuário digita
            }}
            placeholder="Seu nome completo ou apelido"
            className={`w-full bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-lg p-3 text-white focus:outline-none focus:border-primary-500 mb-2 transition-all outline-none`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleStart(); // Permite iniciar apertando Enter
              }
            }}
          />
          {error && <p className="text-red-400 text-sm text-left mb-4 font-medium">{error}</p>}
          
          <button 
            onClick={handleStart}
            className={`w-full flex items-center justify-center gap-2 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform glow-box ${!userName.trim() ? 'bg-slate-600 cursor-not-allowed opacity-50' : 'bg-primary-600 hover:bg-primary-500 hover:scale-[1.03] active:scale-95'}`}
            disabled={!userName.trim()}
          >
            Começar Avaliação Gratuitamente
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Grid de Diferenciais/Recursos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full">
        
        {/* Card: Cenários Reais */}
        <motion.div 
          className="bg-cyber-card border border-cyber-border p-6 rounded-xl text-left"
          whileHover={{ y: -5, borderColor: '#00f0ff', backgroundColor: 'rgba(2, 6, 23, 0.8)' }}
        >
          <AlertTriangle className="w-10 h-10 text-yellow-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-display">Cenários Reais</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Responda a perguntas baseadas nos golpes de WhatsApp, PIX e phishing mais comuns no país.</p>
        </motion.div>
        
        {/* Card: Análise Comportamental */}
        <motion.div 
          className="bg-cyber-card border border-cyber-border p-6 rounded-xl text-left"
          whileHover={{ y: -5, borderColor: '#0ea5e9', backgroundColor: 'rgba(2, 6, 23, 0.8)' }}
        >
          <UserCheck className="w-10 h-10 text-primary-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-display">Perfil Digital</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Identificamos se você tem um perfil mais cauteloso ou se costuma agir por impulso sob pressão.</p>
        </motion.div>
        
        {/* Card: Dicas Práticas */}
        <motion.div 
          className="bg-cyber-card border border-cyber-border p-6 rounded-xl text-left"
          whileHover={{ y: -5, borderColor: '#00f0ff', backgroundColor: 'rgba(2, 6, 23, 0.8)' }}
        >
          <Shield className="w-10 h-10 text-green-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-display">Dicas de Defesa</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Ao final, receba recomendações personalizadas para blindar suas contas e redes sociais.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

