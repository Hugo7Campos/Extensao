import React, { useEffect, useState, useRef } from 'react';
// Hooks do React Router para acessar o estado da navegação e trocar de rota
import { useLocation, useNavigate, Link } from 'react-router-dom';
// Utilitários que processam as respostas e calculam o nível de risco
import { calculateRisk, analyzeVulnerabilities } from '../utils/scoreCalculator';
// Dados das perguntas para referência
import { questions } from '../data/questions';
// Cliente Supabase para salvar os dados no banco
import { supabase } from '../services/supabase';
// Componentes de interface
import ResultCard from '../components/ResultCard';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Star } from 'lucide-react';

/**
 * Página de Resultados
 * Exibe a análise final baseada nas respostas do usuário e permite deixar feedback.
 */
const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Extração dos dados passados pela navegação do Quiz
   * scoreTotal: Pontuação acumulada
   * respostas: Lista com as IDs das opções escolhidas
   * userName: Nome informado pelo usuário na Home
   */
  const { scoreTotal, respostas, userName } = location.state || { scoreTotal: 0, respostas: [], userName: 'Anônimo' };

  /**
   * ESTADOS DO COMPONENTE
   * rating: Nota dada pelo usuário (estrelas de 1 a 5)
   * hoverRating: Estado visual temporário ao passar o mouse sobre as estrelas
   * comentario: Texto escrito pelo usuário no campo de feedback
   * isRated: Define se o feedback já foi enviado (muda a UI para mensagem de sucesso)
   * isSubmittingFeedback: Estado de carregamento do botão de envio
   * saveError: Armazena mensagens de erro caso o Supabase falhe
   */
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [isRated, setIsRated] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [saveError, setSaveError] = useState(null);

  /**
   * CÁLCULOS DOS RESULTADOS
   * resultado: Objeto com o nível (Baixo, Médio, Alto), cor e descrição do risco
   * vulnerabilidades: Lista de golpes específicos que o usuário demonstrou ser vulnerável
   */
  const resultado = calculateRisk(scoreTotal);
  const vulnerabilidades = analyzeVulnerabilities(respostas, questions);

  /**
   * useRef 'hasSaved'
   * Garante que o registro no banco não seja duplicado se o componente renderizar novamente.
   */
  const hasSaved = useRef(false);

  /**
   * SEGURANÇA DE ACESSO
   * Se o usuário tentar entrar em /result sem ter feito o quiz (sem dados no state),
   * ele é redirecionado automaticamente para a Home.
   */
  useEffect(() => {
    if (!location.state) {
      navigate('/');
    }
  }, [location.state, navigate]);

  /**
   * FUNÇÃO PARA SALVAR NO SUPABASE
   * Envia o nome, pontuação, nível de risco, vulnerabilidades (em JSON) e o feedback do usuário.
   */
  const handleSubmitFeedback = async () => {
    // Evita múltiplos envios simultâneos ou duplicados
    if (hasSaved.current) return; 
    
    setIsSubmittingFeedback(true);
    setSaveError(null);

    try {
      // Faz o INSERT na tabela 'resultados' do Supabase
      const { error } = await supabase
        .from('resultados')
        .insert([{
          nome: userName,
          score_total: scoreTotal,
          nivel_risco: resultado.nivel,
          // Convertemos a lista de vulnerabilidades em uma string JSON para o banco
          recomendacoes: JSON.stringify(vulnerabilidades),
          avaliacao_estrelas: rating || null,
          comentario: comentario || null,
        }]);

      if (error) throw error;

      // Se deu tudo certo, marca como salvo e atualiza a UI
      hasSaved.current = true;
      setIsRated(true);
    } catch (err) {
      console.error('Erro ao salvar resultado:', err);
      setSaveError('Desculpe, não conseguimos salvar seus resultados no servidor. Tente novamente mais tarde.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Se não houver dados, não renderiza nada (o useEffect já cuidará do redirect)
  if (!location.state) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Título com animação suave e brilho */}
      <h1 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-10 glow-text">
        Seu Relatório de Segurança Digital
      </h1>

      {/* Alerta de Erro de Rede/Banco */}
      {saveError && (
        <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-sm font-medium animate-pulse">
          ⚠️ {saveError}
        </div>
      )}

      {/* CARD PRINCIPAL: Exibe o Score Circular e o Resumo do Risco */}
      <ResultCard scoreTotal={scoreTotal} resultado={resultado} />

      {/* SEÇÃO DE DETALHAMENTO: Lista de Vulnerabilidades */}
      {vulnerabilidades.length > 0 && (
        <motion.div
          className="mt-12 bg-cyber-dark border border-cyber-border rounded-xl p-6 md:p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-cyber-alert" />
            <h3 className="text-2xl font-display font-bold text-white">Pontos de Atenção</h3>
          </div>

          <div className="grid gap-6">
            {/* Mapeia cada vulnerabilidade encontrada para um card explicativo */}
            {vulnerabilidades.map((vuln, index) => (
              <div key={index} className="bg-cyber-card p-5 rounded-lg border-l-4 border-cyber-alert flex flex-col gap-3 shadow-lg hover:border-l-primary-500 transition-all">
                <div>
                  <span className="font-bold text-cyber-alert mb-1 uppercase text-[10px] tracking-widest">{vuln.categoria}</span>
                  <h5 className="text-xl font-display font-bold text-white">{vuln.nomeGolpe}</h5>
                </div>

                <div>
                  <h6 className="text-primary-400 font-bold text-xs mb-1 uppercase tracking-tighter">O que é este golpe:</h6>
                  <p className="text-slate-300 text-sm leading-relaxed">{vuln.oQueE}</p>
                </div>

                <div className="bg-primary-900/20 p-4 rounded-lg border border-primary-500/20 mt-1">
                  <h6 className="text-green-400 font-bold text-xs mb-1 uppercase tracking-tighter">Como se proteger:</h6>
                  <p className="text-slate-200 text-sm leading-relaxed italic">{vuln.recomendacao}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* MENSAGEM PARA USUÁRIOS SEGUROS */}
      {vulnerabilidades.length === 0 && (
        <motion.div
          className="mt-12 bg-cyber-dark border border-cyber-border rounded-xl p-8 text-center shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-2xl font-display font-bold text-green-400 mb-2">Segurança em Dia! 🛡️</h3>
          <p className="text-slate-300 leading-relaxed">Você demonstrou um comportamento exemplar. Nenhuma vulnerabilidade crítica foi detectada nas suas respostas para os cenários testados.</p>
        </motion.div>
      )}

      {/* SEÇÃO DE FEEDBACK E SALVAMENTO NO BANCO */}
      <motion.div
        className="mt-12 bg-cyber-dark border border-cyber-border rounded-xl p-8 text-center max-w-2xl mx-auto shadow-2xl border-t-primary-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-bold text-white mb-2 font-display">Avalie sua Experiência</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Sua avaliação ajuda a melhorar este projeto de extensão. Ao clicar em enviar, seus resultados serão salvos anonimamente em nosso banco de dados.
        </p>

        {!isRated ? (
          <div className="flex flex-col gap-5">
            {/* Estrelas Interativas */}
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
                    className={`w-10 h-10 transition-all duration-300 ${
                      (hoverRating || rating) >= star
                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Campo de Comentário Opcional */}
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Deixe um comentário ou sugestão... (opcional)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-primary-500 min-h-[100px] resize-none transition-all placeholder:text-slate-600"
            />

            {/* Botão de Envio Principal */}
            <button
              onClick={handleSubmitFeedback}
              disabled={isSubmittingFeedback}
              className="bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-primary-900/20"
            >
              {isSubmittingFeedback ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" /> Salvando...
                </span>
              ) : 'Enviar Avaliação e Salvar'}
            </button>
            <p className="text-slate-600 text-[10px] uppercase tracking-widest font-medium">
              ⚠️ Seus dados só serão salvos ao confirmar no botão acima
            </p>
          </div>
        ) : (
          /* Mensagem de Sucesso pós-salvamento */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-green-400 font-bold bg-green-950/20 py-6 px-4 rounded-xl border border-green-500/30"
          >
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-lg">Resultados salvos com sucesso!</p>
            <p className="text-sm font-normal text-slate-400 mt-1">Obrigado por contribuir com a pesquisa do projeto de extensão.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Botões de Ação Final */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-cyber-card border border-cyber-border text-slate-300 hover:text-white hover:border-primary-500 transition-all duration-300"
        >
          <RefreshCw className="w-5 h-5" />
          Fazer um Novo Teste
        </Link>
      </div>
    </div>
  );
};

export default Result;