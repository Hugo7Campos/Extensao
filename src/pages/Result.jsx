import React, { useEffect, useState, useRef } from 'react'; // Adicionado useRef aqui
// Hooks para pegar a rota atual e navegar
import { useLocation, useNavigate, Link } from 'react-router-dom';
// Importa as lógicas de pontuação e Supabase
import { calculateRisk, analyzeVulnerabilities } from '../utils/scoreCalculator';
import { questions } from '../data/questions';
import { supabase } from '../services/supabase';
// Componentes visuais e de ícones
import ResultCard from '../components/ResultCard';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, ChevronRight, Star } from 'lucide-react';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extrai o scoreTotal, as respostas e o userName
  const { scoreTotal, respostas, userName } = location.state || { scoreTotal: 0, respostas: [], userName: 'Anônimo' };
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
  // Estados para o sistema de avaliação
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [isRated, setIsRated] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [insertedId, setInsertedId] = useState(null); // Salva o ID da linha criada no banco
  
  // Criamos uma referência para controlar se o salvamento já foi feito
  // O useRef mantém o valor entre renderizações sem disparar novos ciclos de atualização
  const hasSaved = useRef(false);

  const handleSubmitFeedback = async () => {
    if (!rating && !comentario) return;
    setIsSubmittingFeedback(true);
    
    // Atualiza o registro existente com a nova nota de estrelas e comentário
    if (insertedId) {
      try {
        const { error } = await supabase
          .from('resultados')
          .update({ avaliacao_estrelas: rating, comentario: comentario })
          .eq('id', insertedId);
          
        if (error) console.error('Erro ao salvar avaliação:', error);
        else setIsRated(true); // Exibe mensagem de sucesso apenas após salvar
      } catch (err) {
        console.error('Erro inesperado ao salvar nota:', err);
      } finally {
        setIsSubmittingFeedback(false);
      }
    } else {
      // Caso ocorra o raro caso de enviar o feedback antes de o resultado ter sido salvo
      setIsSubmittingFeedback(false);
    }
  };

  const resultado = calculateRisk(scoreTotal);
  const vulnerabilidades = analyzeVulnerabilities(respostas, questions);

  useEffect(() => {
    if (!location.state) {
      navigate('/');
      return;
    }

    const saveResult = async () => {
      // REGRA DE OURO: Se já salvou com sucesso ou está salvando, não faz nada
      if (hasSaved.current || isSaving) return;

      setIsSaving(true);
      try {
        const { data, error } = await supabase
          .from('resultados')
          .insert([
            { 
              nome: userName, // Adiciona o nome do usuário capturado na home
              score_total: scoreTotal, 
              nivel_risco: resultado.nivel,
              recomendacoes: JSON.stringify(vulnerabilidades)
            }
          ])
          .select();
          
        if (error) throw error;

        // Armazena o ID do registro inserido para atualizar as estrelas depois
        if (data && data.length > 0) {
          setInsertedId(data[0].id);
        }

        // Marcamos como salvo com sucesso para que o efeito não rode novamente
        hasSaved.current = true;
        console.log('Resultado salvo com sucesso no Supabase!');
        
      } catch (err) {
        console.error('Erro ao salvar resultado:', err);
        setSaveError('Não foi possível salvar os resultados na nuvem.');
      } finally {
        setIsSaving(false);
      }
    };

    saveResult();

    // REMOVEMOS 'resultado.nivel' e 'vulnerabilidades' das dependências.
    // Como esses objetos são recriados a cada render, eles causavam o loop infinito.
  }, [location.state, navigate, scoreTotal]); 

  if (!location.state) return null;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-10 glow-text">
        Seu Relatório de Segurança
      </h1>
      
      {/* Exibe aviso caso o banco falhe, sem travar a tela */}
      {saveError && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-200 text-sm">
          {saveError}
        </div>
      )}

      <ResultCard scoreTotal={scoreTotal} resultado={resultado} />

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
          
          <div className="grid gap-6">
            {vulnerabilidades.map((vuln, index) => (
              <div key={index} className="bg-cyber-card p-5 rounded-lg border-l-4 border-cyber-alert flex flex-col gap-3 shadow-lg">
                <div>
                  <h4 className="font-bold text-cyber-alert mb-1 uppercase text-xs tracking-wider">{vuln.categoria}</h4>
                  <h5 className="text-xl font-display font-bold text-white">{vuln.nomeGolpe}</h5>
                </div>
                
                <div>
                  <h6 className="text-primary-400 font-semibold text-sm mb-1">O que é:</h6>
                  <p className="text-slate-300 text-sm leading-relaxed">{vuln.oQueE}</p>
                </div>
                
                <div className="bg-primary-900/20 p-3 rounded border border-primary-500/30 mt-1">
                  <h6 className="text-green-400 font-semibold text-sm mb-1">O que fazer / Recomendação:</h6>
                  <p className="text-slate-200 text-sm leading-relaxed">{vuln.recomendacao}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {vulnerabilidades.length === 0 && (
        <motion.div 
          className="mt-12 bg-cyber-dark border border-cyber-border rounded-xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-display font-bold text-green-400 mb-2">Excelente!</h3>
          <p className="text-slate-300">Nenhuma vulnerabilidade crítica foi detectada nas suas respostas.</p>
        </motion.div>
      )}

      {/* Avaliação do Usuário */}
      <motion.div 
        className="mt-12 bg-cyber-dark border border-cyber-border rounded-xl p-6 text-center max-w-xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-bold text-white mb-2 font-display">O quanto essa avaliação te ajudou?</h3>
        <p className="text-slate-400 text-sm mb-4">Deixe sua nota e, se quiser, um comentário sobre a sua experiência.</p>
        
        {!isRated ? (
          <div className="flex flex-col gap-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-125"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star 
                    className={`w-10 h-10 transition-colors ${
                      (hoverRating || rating) >= star 
                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]' 
                        : 'text-slate-600'
                    }`} 
                  />
                </button>
              ))}
            </div>
            
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="O que você achou do teste? Como podemos melhorar? (Opcional)"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-300 focus:outline-none focus:border-primary-500 min-h-[80px]"
            />
            
            <button
              onClick={handleSubmitFeedback}
              disabled={isSubmittingFeedback || (!rating && !comentario)}
              className="bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {isSubmittingFeedback ? 'Enviando...' : 'Enviar Avaliação'}
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-green-400 font-bold bg-green-900/30 p-3 rounded-lg border border-green-500/50 inline-block"
          >
            Obrigado pelo seu feedback! 🚀
          </motion.div>
        )}
      </motion.div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/quiz" 
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-cyber-card border border-cyber-border text-slate-300 hover:text-white hover:border-primary-500 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Refazer Teste
        </Link>
      </div>
    </div>
  );
};

export default Result;