import React, { useEffect, useState } from 'react';
// useNavigate é usado para navegar entre as telas sem dar "refresh" na página, comum no React
import { useNavigate } from 'react-router-dom';
// Ícones da biblioteca lucide-react para decorar a página
import { Shield, AlertTriangle, UserCheck, ChevronRight } from 'lucide-react';
// Framer-motion permite criar animações de entrada ou movimento facilmente
import { motion } from 'framer-motion';
// Cliente Supabase
import { supabase } from '../services/supabase';

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Teste de conexão invisível para o usuário final
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

  const handleStart = () => {
    const finalName = userName.trim();
    if (!finalName) {
      setError('Por favor, digite seu nome para continuar.');
      return;
    }
    
    // Navega para a página do quiz passando o nome pela URL
    navigate(`/quiz?name=${encodeURIComponent(finalName)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
      
      {/* Seção Principal (Hero). O motion.div faz essa parte aparecer dando um zoom e fade-in suave */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} // Estado inicial invisível e um pouco menor
        animate={{ opacity: 1, scale: 1 }}   // Estado final totalmente visível e em tamanho real
        transition={{ duration: 0.5 }}       // Duração da animação em segundos
        className="max-w-4xl"
      >
        {/* Ícone gigante com efeito neon no CSS personalizado */}
        <Shield className="w-20 h-20 text-cyber-neon mx-auto mb-6 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display text-white">
          Descubra o seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyber-neon glow-text">Nível de Risco</span> na Internet
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          A cada segundo, uma pessoa cai em um golpe online. Você está seguro? 
          Faça nosso teste interativo baseado em situações reais e receba uma análise do seu perfil digital.
        </p>
        
        {/* Formulário para capturar o nome antes de iniciar o teste */}
        <div className="mt-8 max-w-md mx-auto bg-cyber-dark p-6 rounded-xl border border-cyber-border shadow-lg">
          <label htmlFor="userName" className="block text-slate-300 mb-3 text-left font-medium">
            Digite seu nome para começar:
          </label>
          <input 
            type="text" 
            id="userName"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Seu nome completo ou apelido"
            className={`w-full bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-lg p-3 text-white focus:outline-none focus:border-primary-500 mb-2 transition-colors`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleStart();
              }
            }}
          />
          {error && <p className="text-red-400 text-sm text-left mb-4">{error}</p>}
          <button 
            onClick={handleStart}
            className={`w-full flex items-center justify-center gap-2 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform glow-box ${!userName.trim() ? 'bg-slate-600 cursor-not-allowed opacity-50' : 'bg-primary-600 hover:bg-primary-500 hover:scale-105'}`}
            disabled={!userName.trim()}
          >
            Começar Avaliação
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Grid de Informações: Explica como o sistema funciona */}
      {/* grid-cols-1 no celular e grid-cols-3 no computador */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full">
        
        {/* Card 1 */}
        <motion.div 
          className="bg-cyber-card border border-cyber-border p-6 rounded-xl text-left"
          whileHover={{ y: -5, borderColor: '#00f0ff' }} // Animação ao passar o mouse por cima (levanta e brilha a borda)
        >
          <AlertTriangle className="w-10 h-10 text-yellow-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-display">Cenários Reais</h3>
          <p className="text-slate-400 text-sm">Responda a perguntas baseadas nos golpes mais comuns que acontecem no Brasil todos os dias.</p>
        </motion.div>
        
        {/* Card 2 */}
        <motion.div 
          className="bg-cyber-card border border-cyber-border p-6 rounded-xl text-left"
          whileHover={{ y: -5, borderColor: '#0ea5e9' }}
        >
          <UserCheck className="w-10 h-10 text-primary-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-display">Análise Comportamental</h3>
          <p className="text-slate-400 text-sm">Nossa IA analisa suas respostas e identifica quais são suas maiores vulnerabilidades psicológicas.</p>
        </motion.div>
        
        {/* Card 3 */}
        <motion.div 
          className="bg-cyber-card border border-cyber-border p-6 rounded-xl text-left"
          whileHover={{ y: -5, borderColor: '#00f0ff' }}
        >
          <Shield className="w-10 h-10 text-green-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-display">Dicas Práticas</h3>
          <p className="text-slate-400 text-sm">Receba um relatório completo com recomendações de segurança fáceis de aplicar no seu dia a dia.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
