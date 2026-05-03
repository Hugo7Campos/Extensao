import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração principal do Vite: https://vitejs.dev/config/
export default defineConfig({
  // Plugins utilizados no projeto (React no nosso caso)
  plugins: [react()],
  
  /**
   * IMPORTANTE: A propriedade 'base' define o caminho base da aplicação.
   * Se você for hospedar no GitHub Pages, este valor deve ser exatamente o nome do seu repositório.
   * Por exemplo: se o repo é 'extensao', a base deve ser '/extensao/'.
   * Isso garante que os arquivos (CSS, JS, Imagens) sejam carregados corretamente.
   */
  base: '/Extensao/',
})


