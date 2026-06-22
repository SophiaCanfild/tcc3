// =========================
// BANCO DE DADOS SIMULADO (mantido como fallback)
// =========================

let pacientes = [

    {
        nome: "Sophia Santos",
        intensidade: "Intensa",
        prioridade: "Vermelho",
        peso: 0
    },

    {
        nome: "Ricardo Oliveira",
        intensidade: "Forte",
        prioridade: "Amarelo",
        peso: 1
    },

    {
        nome: "Ana Julia",
        intensidade: "Moderada",
        prioridade: "Verde",
        peso: 2
    }
];

let intensidadeSelecionada = "";

// paciente que está usando a tela atual
let pacienteAtual = null;


// =========================
// SUPABASE
// =========================

let supabaseClient = null; // será preenchido pelo supabase.js

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

    const nome =
        document.getElementById('nome-paciente');

    const nascimento =
        document.getElementById('nascimento-paciente');

    const telefone =
        document.getElementById('telefone-paciente');

    // verifica usando validação nativa HTML
    if (
        !nome.checkValidity() ||
        !nascimento.checkValidity() ||
        !telefone.checkValidity()
    ) {

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

    // Define prioridade
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
            // Fallback local caso supabase falhe
            pacientes.push(novoPaciente);
            pacienteAtual = novoPaciente;
            alert("Cadastro realizado com sucesso! (modo local)");
            goToPage('page-fila');
            atualizarFilaPublica();
            return;
        }

        const { data, error } = await window.supabaseClient
            .from('pacientes')
            .insert([novoPaciente])
            .select();

        if (error) throw error;

        console.log("✅ Paciente cadastrado no Supabase:", data[0]);

        pacienteAtual = data[0];

        alert("Cadastro realizado com sucesso! Você foi adicionado à fila.");
        
        goToPage('page-fila');
        carregarPacientesDoSupabase(); // Atualiza a fila

    } catch (error) {
        console.error("Erro ao cadastrar no Supabase:", error);
        alert("Erro ao salvar no banco. Tentando modo local...");
        // Fallback local
        pacientes.push(novoPaciente);
        pacienteAtual = novoPaciente;
        goToPage('page-fila');
        atualizarFilaPublica();
    }
}

// =========================
// CARREGAR PACIENTES DO SUPABASE
// =========================
async function carregarPacientesDoSupabase() {
    try {
        if (!window.supabaseClient) {
            atualizarFilaPublica();
            return;
        }

        const { data, error } = await window.supabaseClient
            .from('pacientes')
            .select('*')
            .order('peso', { ascending: true })
            .order('created_at', { ascending: true });

        if (error) throw error;

        pacientes = data || [];
        atualizarFilaPublica();

    } catch (err) {
        console.error("Erro ao carregar pacientes:", err);
        atualizarFilaPublica();
    }
}

// =========================
// ATUALIZAR FILA
// =========================

function atualizarFilaPublica() {

    const lista =
        document.getElementById('lista-pacientes');

    const posElem =
        document.getElementById('posicao-fila');

    const statusElem =
        document.getElementById('status-prioridade');

    const contador =
        document.getElementById('contador-pacientes');

    if (!lista) return;

    lista.innerHTML = '';

    pacientes.forEach((p, i) => {

        // primeiro da fila = atendimento atual
        const emAtendimento = i === 0;

        const li = document.createElement('li');

        li.className = `
            rounded-2xl
            p-5
            flex
            items-center
            justify-between
            ${emAtendimento
                ? 'bg-emerald-700 text-white'
                : 'bg-[#f7faf8] text-slate-800'}
        `;

        li.innerHTML = `
            <div class="flex items-center gap-4">

                <div class="
                    min-w-[40px]
                    h-[40px]
                    rounded-full
                    flex
                    items-center
                    justify-center
                    font-bold
                    ${emAtendimento
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-700 text-white'}
                ">
                    ${i + 1}
                </div>

                <div>

                    <h3 class="font-bold">
                        ${ocultarSobrenome(p.nome)}
                    </h3>

                    <p class="
                        text-sm
                        ${emAtendimento
                            ? 'text-white/70'
                            : 'text-slate-400'}
                    ">
                        ${emAtendimento
                            ? 'Em atendimento'
                            : '~ ' + (i * 12) + ' min'}
                    </p>

                </div>

            </div>

            <span class="
                px-3
                py-1
                rounded-full
                text-xs
                font-bold
                ${getCorPrioridade(p.prioridade)}
            ">
                ${p.prioridade}
            </span>
        `;

        lista.appendChild(li);
    });

    // 🛡️ CORREÇÃO: Proteção contra pacienteAtual null ou indefinido
    if (!pacienteAtual && pacientes.length > 0) {
        pacienteAtual = pacientes[0];
    }

    if (pacienteAtual && pacientes.length > 0) {
        const posicaoAtual = pacientes.findIndex(p => 
            p.id === pacienteAtual.id || p.nome === pacienteAtual.nome
        ) + 1;

        if (posElem) {
            posElem.innerText = String(posicaoAtual).padStart(2, '0') + 'º';
        }
        if (statusElem) {
            statusElem.innerText = pacienteAtual.prioridade || "Aguardando";
        }
    } else {
        if (posElem) posElem.innerText = "—";
        if (statusElem) statusElem.innerText = "—";
    }

    if (contador) {
        contador.innerText = `${pacientes.length} pacientes`;
    }
}


// =========================
// OCULTAR SOBRENOME
// =========================

function ocultarSobrenome(nomeCompleto) {

    const partes = nomeCompleto.trim().split(" ");

    if (partes.length === 1) {
        return partes[0];
    }

    const primeiroNome = partes[0];

    const sobrenomeOculto =
        "•".repeat(partes[1].length);

    return `${primeiroNome} ${sobrenomeOculto}`;
}


// =========================
// CANCELAR ATENDIMENTO
// =========================

function confirmarCancelamento() {

    const primeiraConfirmacao = confirm(
        "Tem certeza que deseja cancelar seu atendimento?"
    );

    if (!primeiraConfirmacao) return;

    const segundaConfirmacao = confirm(
        "Seu atendimento será removido da fila. Deseja realmente continuar?"
    );

    if (!segundaConfirmacao) return;

    alert("Atendimento cancelado.");

    goToPage('page-home');
}


// =========================
// CORES PRIORIDADE
// =========================

function getCorPrioridade(prioridade) {

    if (prioridade === "Vermelho") {
        return "bg-red-500 text-white";
    }

    if (prioridade === "Amarelo") {
        return "bg-yellow-400 text-yellow-900";
    }

    if (prioridade === "Verde") {
        return "bg-emerald-500 text-white";
    }

    return "bg-blue-400 text-white";
}


// =========================
// INICIALIZAÇÃO
// =========================

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Sistema Vida+ inicializado");

    // Tenta inicializar Supabase
    if (typeof initSupabase === 'function') {
        initSupabase();
    }

    // Carrega dados do Supabase (com delay para dar tempo de inicializar)
    setTimeout(() => {
        carregarPacientesDoSupabase();
    }, 600);
});