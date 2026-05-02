// Importa a função para criar o cliente de conexão com o Supabase
import { createClient } from '@supabase/supabase-js'

// Pega as variáveis de ambiente (Configuradas no arquivo .env localmente ou na hospedagem)
// O import.meta.env é a forma que o Vite usa para acessar variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

// Cria e exporta a instância do supabase para ser usada em qualquer parte do projeto
// Isso permite consultar ou inserir dados no banco de dados
export const supabase = createClient(supabaseUrl, supabaseKey)
