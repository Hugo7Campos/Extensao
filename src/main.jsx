// Importações principais do React
import React from 'react'
import ReactDOM from 'react-dom/client'
// Importa o componente principal da aplicação
import App from './App.jsx'
// Importa os estilos globais do Tailwind e customizações CSS
import './index.css'

// Ponto de entrada (Entry point) da aplicação React
// Renderiza o componente <App /> dentro da div com id 'root' no index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode ajuda a encontrar bugs potenciais na aplicação durante o desenvolvimento
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
