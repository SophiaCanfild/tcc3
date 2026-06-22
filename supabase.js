// =========================
// SUPABASE CONFIG
// =========================

const SUPABASE_URL = "https://ofqyqorsedxveersqful.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mcXlxb3JzZWR4dmVlcnNxZnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NjYwNTUsImV4cCI6MjA5NjQ0MjA1NX0.ZKz40dXHnloi0w8n87MvExq1RQZe_nyThfxqvGIj-lc";

let supabaseClient = null;

function initSupabase() {
    if (typeof window.supabase === "undefined") {
        console.error("❌ Erro: Biblioteca Supabase não foi carregada!");
        return null;
    }

    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        window.supabaseClient = supabaseClient;
        console.log("✅ Supabase inicializado com sucesso!");
        return supabaseClient;
    } catch (error) {
        console.error("❌ Erro ao criar cliente Supabase:", error);
        return null;
    }
}

// Inicializa automaticamente quando a página carregar
document.addEventListener('DOMContentLoaded', initSupabase);

// Exporta para usar em outros arquivos
export { supabaseClient, initSupabase };