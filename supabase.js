const SUPABASE_URL ="https://ofqyqorsedxveersqful.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mcXlxb3JzZWR4dmVlcnNxZnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NjYwNTUsImV4cCI6MjA5NjQ0MjA1NX0.ZKz40dXHnloi0w8n87MvExq1RQZe_nyThfxqvGIj-lc";

const supabaseclient =
window.supabase.createClient(
    SUPABASE_KEY,
    SUPABASE_URL
);

window.supabaseclient = supabaseclient;