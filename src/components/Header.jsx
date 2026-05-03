import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

/**
 * Componente Header (Cabeçalho)
 * Exibido no topo de todas as páginas para navegação.
 * O Dashboard Administrativo foi removido do menu para ficar oculto ao público,
 * sendo acessível apenas digitando '/#/extensao' na barra de endereços.
 */
const Header = () => {
  return (
    // 'sticky top-0 z-50' garante que o menu fique fixo no topo ao rolar a página
    <header className="bg-cyber-card border-b border-cyber-border py-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        
        {/* Logo Defesa Digital - Link que volta para a Home */}
        <Link to="/" className="flex items-center gap-2 group">
          <ShieldCheck className="w-8 h-8 text-primary-400 group-hover:text-cyber-neon transition-colors duration-300" />
          <h1 className="text-2xl font-bold font-display tracking-wide glow-text text-white">Defesa Digital</h1>
        </Link>
        
        {/* Menu de navegação à direita */}
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              {/* Link para a página inicial */}
              <Link to="/" className="text-slate-300 hover:text-cyber-neon transition-colors font-medium">
                Início
              </Link>
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
};

export default Header;


