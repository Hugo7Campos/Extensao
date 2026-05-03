import React, { useEffect, useState } from 'react';
// Conexão com o banco de dados Supabase
import { supabase } from '../services/supabase';
import { BarChart3, Users, ShieldAlert, Activity, Lock, Calendar, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  // Estados de autenticação do painel (persistindo com localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('dashboard_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Estado que guarda as informações resumidas e os registros completos
  const [stats, setStats] = useState({
    totalTests: 0,
    avgScore: 0,
    highRiskCount: 0,
    avgRating: 0
  });
  const [records, setRecords] = useState([]);
  
  // Controle para exibir uma tela de carregamento enquanto o banco responde
  const [loading, setLoading] = useState(true);

  // Assim que o painel for autenticado, busca os dados no Supabase
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchStats = async () => {
      try {
        // Pega todos os dados da tabela 'resultados' ordenados do mais recente pro mais antigo
        const { data, error } = await supabase
          .from('resultados')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error; // Se a tabela não existir, cai no Catch

        // Se encontrou dados no banco
        if (data && data.length > 0) {
          const total = data.length; // Quantidade de avaliações
          const avg = data.reduce((acc, curr) => acc + curr.score_total, 0) / total; // Soma todos e divide para ter a média
          const highRisk = data.filter(r => r.nivel_risco === 'Alto Risco').length; // Conta quantos caíram em "Alto Risco"
          
          // Calcula a média de estrelas apenas para quem avaliou
          const ratedTests = data.filter(r => r.avaliacao_estrelas > 0);
          const avgStar = ratedTests.length > 0 
            ? ratedTests.reduce((acc, curr) => acc + curr.avaliacao_estrelas, 0) / ratedTests.length 
            : 0;

          // Salva os dados processados no Estado da tela
          setStats({
            totalTests: total,
            avgScore: Math.round(avg),
            highRiskCount: highRisk,
            avgRating: avgStar.toFixed(1)
          });
          
          setRecords(data);
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false); // Retira a tela de carregamento, mesmo se der erro
      }
    };

    fetchStats();
  }, [isAuthenticated]); // Executa quando a autenticação for aprovada

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

  const handleLogin = (e) => {
    e.preventDefault();
    // Verifica se usuário e senha são iguais
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      setLoginError(false);
      localStorage.setItem('dashboard_auth', 'true');
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dashboard_auth');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
        <motion.div 
          className="bg-cyber-card border border-cyber-border p-8 rounded-xl max-w-md w-full shadow-[0_0_20px_rgba(0,240,255,0.1)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-slate-800 rounded-full text-primary-400">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          
          <h2 className="text-2xl font-display font-bold text-white text-center mb-6 glow-text">Acesso Restrito</h2>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Usuário</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Digite o usuário"
              />
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm mb-2">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Digite a senha"
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-sm text-center">Usuário ou senha incorretos!</p>
            )}

            <button 
              type="submit"
              className="mt-4 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Entrar no Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary-400 shrink-0" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white glow-text">Dashboard Administrativo</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 transition-colors text-sm"
        >
          Sair
        </button>
      </div>

      {loading ? (
        // Efeito de carregamento (Spinner rodando)
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Seção das cartinhas de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
            <StatCard 
              title="Avaliação (Média)" 
              value={stats.avgRating > 0 ? `${stats.avgRating} / 5` : 'N/A'} 
              icon={<Star className="w-6 h-6" />} 
              color="bg-yellow-400" 
              delay={0.4}
            />
          </div>

          <div className="bg-cyber-card border border-cyber-border rounded-xl p-8 mb-8">
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-400" />
              Histórico de Avaliações
            </h3>
            
            {/* Aviso quando não existe nenhum dado no banco ainda */}
            {records.length === 0 ? (
              <div className="bg-primary-900/20 border border-primary-500/30 text-primary-200 p-4 rounded-lg">
                Nenhum dado encontrado. Faça uma avaliação ou verifique se as tabelas foram criadas no banco de dados para ver as estatísticas aparecerem aqui.
              </div>
            ) : (
              <div className="w-full">
                {/* Visualização Mobile (Cartões) */}
                <div className="block lg:hidden space-y-4">
                  {records.map((record) => {
                    let vulns = [];
                    try {
                      if (record.recomendacoes) {
                        vulns = JSON.parse(record.recomendacoes);
                      }
                    } catch (e) {
                      console.error('Erro ao parsear vulnerabilidades:', e);
                    }

                    return (
                      <div key={record.id} className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50 flex flex-col gap-3 shadow-sm">
                        <div className="flex justify-between items-start border-b border-slate-700/50 pb-3">
                          <div>
                            <span className="text-white font-bold text-lg block">{record.nome || 'Anônimo'}</span>
                            <span className="text-slate-400 text-xs">{formatDate(record.created_at)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-white font-bold block text-lg">{record.score_total}/50</span>
                            {record.avaliacao_estrelas > 0 && (
                              <div className="flex items-center justify-end gap-1 text-yellow-400 mt-1">
                                <span className="text-sm">{record.avaliacao_estrelas}</span>
                                <Star className="w-3 h-3 fill-yellow-400" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm">Nível de Risco:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              record.nivel_risco === 'Alto Risco' ? 'bg-red-900/30 text-red-400 border border-red-500/30' :
                              record.nivel_risco === 'Risco Médio' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' :
                              'bg-green-900/30 text-green-400 border border-green-500/30'
                            }`}>
                              {record.nivel_risco}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1 mt-2">
                            <span className="text-slate-400 text-sm">Vulnerabilidades:</span>
                            {vulns.length > 0 ? (
                              <ul className="list-disc list-inside text-slate-300 text-sm pl-2">
                                {vulns.map((v, i) => (
                                  <li key={i} className="truncate" title={v.nomeGolpe || v.categoria}>
                                    {v.nomeGolpe || v.categoria}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-green-400 text-sm font-medium">Nenhuma crítica</span>
                            )}
                          </div>

                          {record.comentario && (
                            <div className="mt-2 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                              <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Feedback do Usuário</span>
                              <span className="text-slate-300 text-sm italic">"{record.comentario}"</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Visualização Desktop (Tabela) */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-cyber-border">
                        <th className="py-4 px-4 text-slate-400 font-medium text-sm">Nome</th>
                        <th className="py-4 px-4 text-slate-400 font-medium text-sm">Data/Hora</th>
                        <th className="py-4 px-4 text-slate-400 font-medium text-sm">Pontuação</th>
                        <th className="py-4 px-4 text-slate-400 font-medium text-sm">Nível de Risco</th>
                        <th className="py-4 px-4 text-slate-400 font-medium text-sm">Nota (Estrelas)</th>
                        <th className="py-4 px-4 text-slate-400 font-medium text-sm">Vulnerabilidades Detectadas</th>
                        <th className="py-4 px-4 text-slate-400 font-medium text-sm">Comentário / Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record) => {
                        let vulns = [];
                        try {
                          if (record.recomendacoes) {
                            vulns = JSON.parse(record.recomendacoes);
                          }
                        } catch (e) {
                          console.error('Erro ao parsear vulnerabilidades:', e);
                        }

                        return (
                          <tr key={record.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                            <td className="py-4 px-4 text-white font-medium whitespace-nowrap">
                              {record.nome || 'Anônimo'}
                            </td>
                            <td className="py-4 px-4 text-slate-300 text-sm whitespace-nowrap">
                              {formatDate(record.created_at)}
                            </td>
                            <td className="py-4 px-4 text-white font-bold">
                              {record.score_total} / 50
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                record.nivel_risco === 'Alto Risco' ? 'bg-red-900/30 text-red-400 border border-red-500/30' :
                                record.nivel_risco === 'Risco Médio' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' :
                                'bg-green-900/30 text-green-400 border border-green-500/30'
                              }`}>
                                {record.nivel_risco}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-300">
                              {record.avaliacao_estrelas > 0 ? (
                                <div className="flex items-center gap-1 text-yellow-400">
                                  {record.avaliacao_estrelas} <Star className="w-4 h-4 fill-yellow-400" />
                                </div>
                              ) : (
                                <span className="text-slate-500">-</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-slate-400 text-sm">
                              {vulns.length > 0 ? (
                                <ul className="list-disc list-inside">
                                  {vulns.map((v, i) => (
                                    <li key={i} className="truncate max-w-xs xl:max-w-md" title={v.nomeGolpe || v.categoria}>
                                      {v.nomeGolpe || v.categoria}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-green-400">Nenhuma crítica</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-slate-300 text-sm italic max-w-xs xl:max-w-md truncate" title={record.comentario || ''}>
                              {record.comentario ? `"${record.comentario}"` : <span className="text-slate-600 not-italic">-</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
