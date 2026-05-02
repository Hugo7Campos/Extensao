import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Header = () => {
  return (
    // 'sticky top-0 z-50' faz o cabeçalho grudar no topo da tela, ficando sempre visível
    <header className="bg-cyber-card border-b border-cyber-border py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        
        {/* Link para a página inicial clicando no Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <ShieldCheck className="w-8 h-8 text-primary-400 group-hover:text-cyber-neon transition-colors duration-300" />
          <h1 className="text-2xl font-bold font-display tracking-wide glow-text text-white">Defesa Digital</h1>
        </Link>
        
        {/* Menu de navegação */}
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-slate-300 hover:text-cyber-neon transition-colors">Início</Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-slate-300 hover:text-cyber-neon transition-colors">Dashboard</Link>
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
};

export default Header;
