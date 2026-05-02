import React, { useEffect, useState } from 'react';
// Hooks para pegar a rota atual e navegar
import { useLocation, useNavigate, Link } from 'react-router-dom';
// Importa as lógicas de pontuação e Supabase
import { calculateRisk, analyzeVulnerabilities } from '../utils/scoreCalculator';
import { questions } from '../data/questions';
import { supabase } from '../services/supabase';
// Componentes visuais e de ícones
import ResultCard from '../components/ResultCard';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';

const Result = () => {
  const location = useLocation(); // location.state contém os dados passados pelo navigate() do useQuizLogic
  const navigate = useNavigate();
  
  // Extrai o scoreTotal e as respostas passados pelo Quiz, se não existir, usa valores padrão
  const { scoreTotal, respostas } = location.state || { scoreTotal: 0, respostas: [] };
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
  // Processa as informações: Calcula se é baixo, médio ou alto risco
  const resultado = calculateRisk(scoreTotal);
  
  // Executa a "IA" para descobrir os pontos psicológicos vulneráveis baseados nas respostas
  const vulnerabilidades = analyzeVulnerabilities(respostas, questions);

  // UseEffect roda assim que a tela de resultados carrega
  useEffect(() => {
    // Se o usuário tentar acessar a tela de resultados direto pela URL sem ter feito o quiz, manda ele pra Home
    if (!location.state) {
      navigate('/');
      return;
    }

    // Função assíncrona para salvar o resultado no banco de dados (Supabase)
    const saveResult = async () => {
      setIsSaving(true);
      try {
        // Tenta inserir na tabela 'resultados'
        const { error } = await supabase
          .from('resultados')
          .insert([
            { 
              score_total: scoreTotal, 
              nivel_risco: resultado.nivel,
              recomendacoes: JSON.stringify(vulnerabilidades) // Transforma a lista em texto para salvar no banco
            }
          ]);
          
        if (error) throw error; // Se der erro no supabase, joga para o Catch
      } catch (err) {
        console.error('Erro ao salvar resultado:', err);
        // Não travamos o usuário caso o banco falhe, só exibimos no console.
        setSaveError('Não foi possível salvar os resultados na nuvem, mas você pode visualizá-los abaixo.');
      } finally {
        setIsSaving(false);
      }
    };

    saveResult(); // Chama a função de salvar
  }, [location.state, navigate, resultado.nivel, scoreTotal, vulnerabilidades]);

  // Se não tiver location.state, retorna nulo para não quebrar a tela enquanto o useEffect redireciona
  if (!location.state) return null;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-10 glow-text">
        Seu Relatório de Segurança
      </h1>
      
      {/* Componente visual do cartão de Score principal */}
      <ResultCard scoreTotal={scoreTotal} resultado={resultado} />

      {/* Renderiza as vulnerabilidades apenas se a análise detectar alguma (length > 0) */}
      {vulnerabilidades.length > 0 && (
        <motion.div 
          className="mt-12 bg-cyber-dark border border-cyber-border rounded-xl p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-cyber-alert" />
            <h3 className="text-2xl font-display font-bold text-white">Vulnerabilidades Detectadas</h3>
          </div>
          
          <div className="grid gap-4">
            {/* Um loop map() para desenhar cada ponto fraco detectado na tela */}
            {vulnerabilidades.map((vuln, index) => (
              <div key={index} className="bg-cyber-card p-4 rounded-lg border-l-4 border-cyber-alert">
                <h4 className="font-bold text-primary-400 mb-2 uppercase text-sm tracking-wider">{vuln.categoria}</h4>
                <p className="text-slate-300">{vuln.mensagem}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Se o usuário gabaritou o teste (nenhuma vulnerabilidade) */}
      {vulnerabilidades.length === 0 && (
        <motion.div 
          className="mt-12 bg-cyber-dark border border-cyber-border rounded-xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-display font-bold text-green-400 mb-2">Excelente!</h3>
          <p className="text-slate-300">Nenhuma vulnerabilidade crítica foi detectada nas suas respostas. Continue com as boas práticas de segurança.</p>
        </motion.div>
      )}

      {/* Botões para refazer teste ou ver Dashboard */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/quiz" 
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-cyber-card border border-cyber-border text-slate-300 hover:text-white hover:border-primary-500 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Refazer Teste
        </Link>
        <Link 
          to="/dashboard" 
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors shadow-[0_0_15px_rgba(14,165,233,0.3)]"
        >
          Ver Estatísticas
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default Result;
