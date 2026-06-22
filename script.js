// =========================
// VARIÁVEIS GLOBAIS
// =========================
let pacientes = [];
let pacienteAtual = null;
let intensidadeSelecionada = "";

// =========================
// NAVEGAÇÃO
// =========================
function goToPage(pageId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
    window.scrollTo(0, 0);
}

// =========================
// VALIDAR CADASTRO
// =========================
function validarCadastro() {
    const nome = document.getElementById('nome-paciente');
    const nascimento = document.getElementById('nascimento-paciente');
    const telefone = document.getElementById('telefone-paciente');

    if (!nome.checkValidity() || !nascimento.checkValidity() || !telefone.checkValidity()) {
        nome.reportValidity();
        nascimento.reportValidity();
        telefone.reportValidity();
        return;
    }
    goToPage('page-triagem');
}

// =========================
// SELECIONAR INTENSIDADE
// =========================
function selecionarIntensidade(botao, valor) {
    document.querySelectorAll('.btn-intensidade').forEach(btn => {
        btn.classList.remove('intensidade-active');
    });
    botao.classList.add('intensidade-active');
    intensidadeSelecionada = valor;
}

// =========================
// ENTRAR NA FILA (SUPABASE)
// =========================
async function entrarNaFila() {
    const nome = document.getElementById('nome-paciente').value.trim();
    const sintomas = document.getElementById('sintomas');
    const tempo = document.getElementById('tempo-sintomas');
    const alergias = document.getElementById('alergias').value.trim();

    if (!sintomas.checkValidity() || !tempo.checkValidity() || !intensidadeSelecionada) {
        sintomas.reportValidity();
        tempo.reportValidity();
        if (!intensidadeSelecionada) alert("Selecione a intensidade dos sintomas.");
        return;
    }

    let prioridade = "Azul";
    let peso = 3;
    if (intensidadeSelecionada === "Intensa") { prioridade = "Vermelho"; peso = 0; }
    else if (intensidadeSelecionada === "Forte") { prioridade = "Amarelo"; peso = 1; }
    else if (intensidadeSelecionada === "Moderada") { prioridade = "Verde"; peso = 2; }

    const novoPaciente = {
        nome,
        sintomas: sintomas.value,
        tempo: tempo.value,
        alergias,
        intensidade: intensidadeSelecionada,
        prioridade,
        peso,
        status: "Aguardando",
        created_at: new Date().toISOString()
    };

    try {
        if (!window.supabaseClient) {
            alert("Erro: Supabase não inicializado. Usando modo local.");
            pacientes.push(novoPaciente);
            pacienteAtual = novoPaciente;
            atualizarFilaPublica();
            goToPage('page-fila');
            return;
        }

        const { data, error } = await window.supabaseClient
            .from('pacientes')
            .insert([novoPaciente])
            .select();

        if (error) throw error;

        pacienteAtual = data[0];
        alert("✅ Cadastro realizado com sucesso!");
        goToPage('page-fila');
        carregarPacientesDoSupabase();

    } catch (error) {
        console.error("Erro Supabase:", error);
        alert("Erro no Supabase → usando modo local.");
        pacientes.push(novoPaciente);
        pacienteAtual = novoPaciente;
        atualizarFilaPublica();
        goToPage('page-fila');
    }
}

// =========================
// CARREGAR PACIENTES DO SUPABASE
// =========================
async function carregarPacientesDoSupabase() {
    try {
        if (!window.supabaseClient) return;

        const { data, error } = await window.supabaseClient
            .from('pacientes')
            .select('*')
            .order('peso', { ascending: true })
            .order('created_at', { ascending: true });

        if (error) throw error;

        pacientes = data || [];
        atualizarFilaPublica();
    } catch (err) {
        console.error("Erro ao carregar:", err);
    }
}

// =========================
// ATUALIZAR FILA (sua versão original mantida)
// =========================
function atualizarFilaPublica() {
    const lista = document.getElementById('lista-pacientes');
    const posElem = document.getElementById('posicao-fila');
    const statusElem = document.getElementById('status-prioridade');
    const contador = document.getElementById('contador-pacientes');

    if (!lista) return;
    lista.innerHTML = '';

    pacientes.forEach((p, i) => {
        const emAtendimento = i === 0;
        const li = document.createElement('li');
        li.className = `rounded-2xl p-5 flex items-center justify-between ${emAtendimento ? 'bg-emerald-700 text-white' : 'bg-[#f7faf8] text-slate-800'}`;
        
        li.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="min-w-[40px] h-[40px] rounded-full flex items-center justify-center font-bold ${emAtendimento ? 'bg-white/20 text-white' : 'bg-emerald-700 text-white'}">
                    ${i + 1}
                </div>
                <div>
                    <h3 class="font-bold">${ocultarSobrenome(p.nome)}</h3>
                    <p class="text-sm ${emAtendimento ? 'text-white/70' : 'text-slate-400'}">
                        ${emAtendimento ? 'Em atendimento' : '~ ' + (i * 12) + ' min'}
                    </p>
                </div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold ${getCorPrioridade(p.prioridade)}">
                ${p.prioridade}
            </span>
        `;
        lista.appendChild(li);
    });

    if (!pacienteAtual && pacientes.length > 0) pacienteAtual = pacientes[0];

    if (pacienteAtual) {
        const posicaoAtual = pacientes.findIndex(p => p.nome === pacienteAtual.nome) + 1;
        if (posElem) posElem.innerText = String(posicaoAtual).padStart(2, '0') + 'º';
        if (statusElem) statusElem.innerText = pacienteAtual.prioridade;
    }
    if (contador) contador.innerText = `${pacientes.length} pacientes`;
}

// Funções auxiliares (mantidas)
function ocultarSobrenome(nomeCompleto) {
    const partes = nomeCompleto.trim().split(" ");
    if (partes.length === 1) return partes[0];
    return `${partes[0]} ${"•".repeat(partes[1].length)}`;
}

function confirmarCancelamento() {
    if (!confirm("Tem certeza que deseja cancelar seu atendimento?")) return;
    if (!confirm("Deseja realmente continuar?")) return;
    alert("Atendimento cancelado.");
    goToPage('page-home');
}

function getCorPrioridade(prioridade) {
    if (prioridade === "Vermelho") return "bg-red-500 text-white";
    if (prioridade === "Amarelo") return "bg-yellow-400 text-yellow-900";
    if (prioridade === "Verde") return "bg-emerald-500 text-white";
    return "bg-blue-400 text-white";
}

// =========================
// INICIALIZAÇÃO
// =========================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initSupabase === 'function') {
        initSupabase();
    }
    setTimeout(() => {
        carregarPacientesDoSupabase();
    }, 800);
});