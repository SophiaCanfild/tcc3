// supabase.js
const SUPABASE_URL = "https://ofqyqorsedxveersqful.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mcXlxb3JzZWR4dmVlcnNxZnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NjYwNTUsImV4cCI6MjA5NjQ0MjA1NX0.ZKz40dXHnloi0w8n87MvExq1RQZe_nyThfxqvGIj-lc";

let supabaseClient = null;

function initSupabase() {
    if (window.supabaseClient) {
        console.log("✅ Supabase já estava inicializado.");
        return window.supabaseClient;
    }

    if (typeof window.supabase === "undefined") {
        console.error("❌ Biblioteca Supabase não carregada!");
        return null;
    }

    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        window.supabaseClient = supabaseClient;
        console.log("✅ Supabase inicializado com sucesso!");
        return supabaseClient;
    } catch (error) {
        console.error("❌ Erro ao criar cliente:", error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', initSupabase);
window.initSupabase = initSupabase;