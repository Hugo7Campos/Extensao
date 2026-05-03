import React, { useEffect, useState } from 'react';
// Importação da conexão configurada do Supabase para interagir com o banco de dados
import { supabase } from '../services/supabase';
// Ícones do Lucide para ilustrar o painel
import { BarChart3, Users, ShieldAlert, Activity, Lock, Calendar, Star } from 'lucide-react';
// Framer Motion para animações suaves de entrada
import { motion } from 'framer-motion';

/**
 * Componente Dashboard
 * Responsável por exibir estatísticas e o histórico de avaliações dos usuários.
 */
const Dashboard = () => {
  /**
   * ESTADOS DE AUTENTICAÇÃO
   * Controlam se o usuário pode ver o conteúdo do dashboard.
   */
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Tenta recuperar o estado de login do navegador para não deslogar ao dar F5
    return localStorage.getItem('dashboard_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  /**
   * ESTADOS DE DADOS
   * stats: Guarda o resumo calculado (médias, totais, etc)
   * records: Guarda a lista completa de linhas vindas do banco
   * loading: Controla a exibição do ícone de carregamento
   */
  const [stats, setStats] = useState({
    totalTests: 0,
    avgScore: 0,
    highRiskCount: 0,
    avgRating: 0
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * EFEITO DE BUSCA DE DADOS
   * É executado toda vez que o estado 'isAuthenticated' muda para true.
   */
  useEffect(() => {
    // Se não estiver logado, nem tenta buscar os dados
    if (!isAuthenticated) return;
    
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Busca todos os registros da tabela 'resultados' no Supabase
        const { data, error } = await supabase
          .from('resultados')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error; // Se houver erro na consulta, vai para o catch

        if (data && data.length > 0) {
          // --- PROCESSAMENTO DOS DADOS PARA AS ESTATÍSTICAS ---
          const total = data.length;
          // Calcula a média das pontuações (0 a 50)
          const avg = data.reduce((acc, curr) => acc + (curr.score_total || 0), 0) / total;
          // Conta quantos usuários foram classificados como 'Alto Risco'
          const highRisk = data.filter(r => r.nivel_risco === 'Alto Risco').length;
          
          // Calcula a média das estrelas (apenas de quem deixou avaliação)
          const ratedTests = data.filter(r => r.avaliacao_estrelas > 0);
          const avgStar = ratedTests.length > 0 
            ? ratedTests.reduce((acc, curr) => acc + curr.avaliacao_estrelas, 0) / ratedTests.length 
            : 0;

          // Atualiza os estados com os valores calculados
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
        // Desativa o spinner de carregamento
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated]);

  /**
   * StatCard (Sub-componente)
   * Renderiza os pequenos cartões de resumo no topo do dashboard.
   */
  const StatCard = ({ title, value, icon, color, delay }) => (
    <motion.div 
      className="bg-cyber-card border border-cyber-border p-6 rounded-xl relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
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

  /**
   * FUNÇÕES DE LOGIN E LOGOUT
   */
  const handleLogin = (e) => {
    e.preventDefault();
    // Verificação simples (admin/admin) - Idealmente isso viria de uma tabela de admins
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

  /**
   * Formata a data do banco (ISO) para o padrão brasileiro
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  /**
   * TELA DE LOGIN (Caso não esteja autenticado)
   */
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
        <motion.div 
          className="bg-cyber-card border border-cyber-border p-8 rounded-xl max-w-md w-full shadow-[0_0_20px_rgba(0,240,255,0.1)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-slate-800 rounded-full text-primary-400 border border-slate-700">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          
          <h2 className="text-2xl font-display font-bold text-white text-center mb-2 glow-text">Acesso Restrito</h2>
          <p className="text-slate-400 text-sm text-center mb-6">Painel administrativo do Projeto de Extensão</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Usuário</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Ex: admin"
              />
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm mb-2">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Ex: admin"
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-sm text-center font-medium bg-red-950/20 py-2 rounded">Usuário ou senha incorretos!</p>
            )}

            <button 
              type="submit"
              className="mt-4 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-primary-900/20"
            >
              Entrar no Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  /**
   * TELA PRINCIPAL DO DASHBOARD (Caso logado)
   */
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Cabeçalho do Painel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary-400 shrink-0" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white glow-text">Dashboard Administrativo</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-slate-800 hover:bg-red-900/30 hover:text-red-400 hover:border-red-500/50 text-white rounded-lg border border-slate-600 transition-all text-sm font-medium"
        >
          Sair do Painel
        </button>
      </div>

      {loading ? (
        // Efeito de carregamento (Spinner rodando)
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="text-slate-400 animate-pulse">Sincronizando com Supabase...</p>
        </div>
      ) : (
        <>
          {/* Grade de Cartões de Estatísticas */}
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
              color="bg-red-500" 
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

          {/* Seção do Histórico (Tabela/Cards) */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 sm:p-8 mb-8 overflow-hidden shadow-2xl">
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-400" />
              Histórico Detalhado de Avaliações
            </h3>
            
            {records.length === 0 ? (
              // Caso não existam dados no banco ainda
              <div className="bg-primary-900/20 border border-primary-500/30 text-primary-200 p-6 rounded-lg text-center">
                <p className="font-medium mb-1">Nenhum dado encontrado no Supabase.</p>
                <p className="text-sm opacity-80">As avaliações aparecerão aqui assim que os usuários finalizarem o teste.</p>
              </div>
            ) : (
              <div className="w-full">
                {/* Visualização para Celulares (Layout em Cartões) */}
                <div className="block lg:hidden space-y-4">
                  {records.map((record) => {
                    let vulns = [];
                    try {
                      // Tenta converter a string de recomendações (JSON) em Array
                      if (record.recomendacoes) {
                        vulns = typeof record.recomendacoes === 'string' ? JSON.parse(record.recomendacoes) : record.recomendacoes;
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
                            <span className="text-slate-400 text-sm">Golpes Críticos:</span>
                            {vulns.length > 0 ? (
                              <ul className="list-disc list-inside text-slate-300 text-sm pl-2">
                                {vulns.slice(0, 3).map((v, i) => (
                                  <li key={i} className="truncate">
                                    {v.nomeGolpe || v.categoria}
                                  </li>
                                ))}
                                {vulns.length > 3 && <li className="text-slate-500 text-xs italic">Mais {vulns.length - 3} itens...</li>}
                              </ul>
                            ) : (
                              <span className="text-green-400 text-sm font-medium">Nenhuma vulnerabilidade crítica</span>
                            )}
                          </div>

                          {record.comentario && (
                            <div className="mt-2 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                              <span className="text-slate-500 text-xs uppercase tracking-wider block mb-1">Feedback</span>
                              <span className="text-slate-300 text-sm italic">"{record.comentario}"</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Visualização para Desktop (Tabela) */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-cyber-border">
                        <th className="py-4 px-4 text-slate-400 font-medium text-sm">Nome do Usuário</th>
                        <th className="py-4 px-4 text-slate-400 font-medium text-sm">Data e Hora</th>
                        <th className="py-4 px-4 text-slate-400 font-medium text-sm text-center">Score</th>
                        <th className="py-4 px-4 text-slate-400 font-medium text-sm">Nível de Risco</th>
                        <th className="py-4 px-4 text-slate-400 font-medium text-sm text-center">Nota</th>
                        <th className="py-4 px-4 text-slate-400 font-medium text-sm">Vulnerabilidades</th>
                        <th className="py-4 px-4 text-slate-400 font-medium text-sm">Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record) => {
                        let vulns = [];
                        try {
                          if (record.recomendacoes) {
                            vulns = typeof record.recomendacoes === 'string' ? JSON.parse(record.recomendacoes) : record.recomendacoes;
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
                            <td className="py-4 px-4 text-white font-bold text-center">
                              {record.score_total} <span className="text-slate-500 text-xs font-normal">/ 50</span>
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
                            <td className="py-4 px-4 text-slate-300 text-center">
                              {record.avaliacao_estrelas > 0 ? (
                                <div className="flex items-center justify-center gap-1 text-yellow-400">
                                  {record.avaliacao_estrelas} <Star className="w-4 h-4 fill-yellow-400" />
                                </div>
                              ) : (
                                <span className="text-slate-500">-</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-slate-400 text-sm">
                              {vulns.length > 0 ? (
                                <ul className="list-disc list-inside">
                                  {vulns.slice(0, 2).map((v, i) => (
                                    <li key={i} className="truncate max-w-[150px] xl:max-w-xs" title={v.nomeGolpe || v.categoria}>
                                      {v.nomeGolpe || v.categoria}
                                    </li>
                                  ))}
                                  {vulns.length > 2 && <li className="text-xs italic">+ {vulns.length - 2} outros</li>}
                                </ul>
                              ) : (
                                <span className="text-green-400 font-medium">Nenhuma</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-slate-300 text-sm italic max-w-[200px] truncate" title={record.comentario || ''}>
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

