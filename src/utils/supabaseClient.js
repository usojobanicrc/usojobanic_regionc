import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseApiKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseApiKey) {
    throw new Error('Faltan variables de entorno de Supabase. Por favor, configúralas correctamente.');
}

// 3. 🔥 EXPORTA LA INSTANCIA FINAL CON EL NOMBRE QUE USA TODA TU APP: 'supabase' 🔥
export const supabase = createClient(supabaseUrl, supabaseApiKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
});