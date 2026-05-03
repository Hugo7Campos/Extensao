import React from 'react';
// O HashRouter é usado para garantir que as rotas funcionem corretamente no GitHub Pages.
// Com ele, as URLs terão um '#' (ex: seu-site.com/#/extensao).
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Importação das páginas da aplicação
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';

// Importação dos componentes fixos que aparecem em todas as páginas
import Header from './components/Header';
import Footer from './components/Footer';

/**
 * Componente principal App
 * Aqui definimos a estrutura base do site e todas as rotas (páginas) disponíveis.
 */
function App() {
  return (
    // O Router envolve toda a aplicação para habilitar o sistema de navegação
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* O Header (cabeçalho) fica no topo de todas as páginas */}
        <Header />
        
        {/* O elemento <main> contém o conteúdo principal que muda conforme a rota */}
        {/* flex-grow garante que o conteúdo ocupe o espaço disponível, empurrando o footer para baixo */}
        <main className="flex-grow container mx-auto px-4 py-8">
          {/* O Routes define qual componente será exibido dependendo do caminho na URL */}
          <Routes>
            {/* Rota da Página Inicial */}
            <Route path="/" element={<Home />} />           
            
            {/* Rota do Quiz/Formulário de avaliação */}
            <Route path="/quiz" element={<Quiz />} />       
            
            {/* Rota dos Resultados após finalizar o quiz */}
            <Route path="/result" element={<Result />} />   
            
            {/* Rota do Painel Administrativo - Alterada para /extensao conforme solicitado */}
            <Route path="/extensao" element={<Dashboard />} /> 
          </Routes>
        </main>
        
        {/* O Footer (rodapé) fica na parte inferior de todas as páginas */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;

