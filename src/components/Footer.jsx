import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-cyber-card border-t border-cyber-border py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Defesa Digital. Plataforma de conscientização sobre golpes online.
        </p>
        <p className="text-slate-500 text-xs mt-2">
          Não solicitamos dados bancários nem senhas em nenhum momento.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
