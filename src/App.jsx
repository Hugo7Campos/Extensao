import React from 'react';
// HashRouter é necessário para o GitHub Pages (servidor estático não suporta rotas do BrowserRouter)
// Com HashRouter, as URLs ficam como: /#/quiz, /#/result, /#/dashboard
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Importa as páginas da aplicação
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';

// Importa os componentes fixos (que aparecem em todas as páginas)
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    // Router envolve toda a aplicação para permitir a navegação
    <Router>
      {/* Container principal que ocupa pelo menos a altura inteira da tela (min-h-screen) */}
      <div className="flex flex-col min-h-screen">
        {/* Cabeçalho do site */}
        <Header />
        
        {/* main flex-grow garante que o conteúdo empurre o rodapé para baixo se a página for curta */}
        <main className="flex-grow container mx-auto px-4 py-8">
          {/* Configuração das rotas (URLs) da aplicação */}
          <Routes>
            <Route path="/" element={<Home />} />           {/* Página Inicial */}
            <Route path="/quiz" element={<Quiz />} />       {/* Tela do Formulário/Quiz */}
            <Route path="/result" element={<Result />} />   {/* Tela de Resultados e Análise */}
            <Route path="/dashboard" element={<Dashboard />} /> {/* Painel Administrativo */}
          </Routes>
        </main>
        
        {/* Rodapé do site */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
