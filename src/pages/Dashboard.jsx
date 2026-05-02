import React, { useEffect, useState } from 'react';
// Conexão com o banco de dados Supabase
import { supabase } from '../services/supabase';
import { BarChart3, Users, ShieldAlert, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  // Estado que guarda as informações resumidas coletadas do banco
  const [stats, setStats] = useState({
    totalTests: 0,
    avgScore: 0,
    highRiskCount: 0
  });
  
  // Controle para exibir uma tela de carregamento enquanto o banco responde
  const [loading, setLoading] = useState(true);

  // Assim que a tela abrir, busca os dados no Supabase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Pega as colunas 'score_total' e 'nivel_risco' da tabela 'resultados'
        const { data, error } = await supabase
          .from('resultados')
          .select('score_total, nivel_risco');

        if (error) throw error; // Se a tabela não existir, cai no Catch

        // Se encontrou dados no banco
        if (data && data.length > 0) {
          const total = data.length; // Quantidade de usuários que fizeram
          const avg = data.reduce((acc, curr) => acc + curr.score_total, 0) / total; // Soma todos e divide para ter a média
          const highRisk = data.filter(r => r.nivel_risco === 'Alto Risco').length; // Conta quantos caíram em "Alto Risco"

          // Salva os dados processados no Estado da tela
          setStats({
            totalTests: total,
            avgScore: Math.round(avg),
            highRiskCount: highRisk
          });
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false); // Retira a tela de carregamento, mesmo se der erro
      }
    };

    fetchStats();
  }, []); // O [] vazio significa que o useEffect só roda UMA VEZ ao entrar na tela

  // Um componente menor criado aqui dentro mesmo só para facilitar a criação dos quadradinhos de informação
  const StatCard = ({ title, value, icon, color, delay }) => (
    <motion.div 
      className="bg-cyber-card border border-cyber-border p-6 rounded-xl relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }} // Adiciona um atraso para as cartas aparecerem em escadinha (efeito cascata)
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 ${color}`}></div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-display font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-cyber-dark border border-cyber-border ${color.replace('bg-', 'text-')}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-10">
        <Activity className="w-8 h-8 text-primary-400" />
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white glow-text">Dashboard Administrativo</h1>
      </div>

      {loading ? (
        // Efeito de carregamento (Spinner rodando)
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Seção das cartinhas de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard 
              title="Avaliações Realizadas" 
              value={stats.totalTests || '0'} 
              icon={<Users className="w-6 h-6" />} 
              color="bg-primary-500" 
              delay={0.1}
            />
            <StatCard 
              title="Score Médio Geral" 
              value={stats.totalTests ? `${stats.avgScore}/50` : '0/50'} 
              icon={<BarChart3 className="w-6 h-6" />} 
              color="bg-purple-500" 
              delay={0.2}
            />
            <StatCard 
              title="Usuários em Alto Risco" 
              value={stats.highRiskCount || '0'} 
              icon={<ShieldAlert className="w-6 h-6" />} 
              color="bg-cyber-alert" 
              delay={0.3}
            />
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-8">
            <h3 className="text-xl font-display font-bold text-white mb-6">Visão Geral da Plataforma</h3>
            <p className="text-slate-400 mb-4">
              O painel administrativo coleta dados de forma anônima para entender o nível de conscientização digital.
              Estes dados estão conectados em tempo real ao Supabase.
            </p>
            {/* Aviso quando não existe nenhum dado no banco ainda */}
            {stats.totalTests === 0 && (
              <div className="bg-primary-900/20 border border-primary-500/30 text-primary-200 p-4 rounded-lg mt-4">
                Nenhum dado encontrado. Faça uma avaliação ou verifique se as tabelas foram criadas no banco de dados para ver as estatísticas aparecerem aqui.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
