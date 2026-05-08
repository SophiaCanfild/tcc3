// Banco de dados simulado (Estado Global)
let pacientes = [
    { nome: "Sophia Santos", intensidade: "Intensa", prioridade: "Emergência" },
    { nome: "Ricardo Oliveira", intensidade: "Forte", prioridade: "Alta" },
    { nome: "Ana Julia", intensidade: "Moderada", prioridade: "Média" }
];

let intensidadeSelecionada = "";

// Navegação Principal
function goToPage(pageId) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    
    // Se for para o dashboard, atualiza os dados
    if(pageId === 'page-dashboard') popularDashboard();
    window.scrollTo(0, 0);
}

// Lógica de Triagem
function selecionarIntensidade(botao, valor) {
    // Remove classe de todos
    document.querySelectorAll('.btn-intensidade').forEach(b => b.classList.remove('intensidade-active'));
    // Adiciona no clicado
    botao.classList.add('intensidade-active');
    intensidadeSelecionada = valor;
}

function entrarNaFila() {
    const nome = document.getElementById('nome-paciente').value || "Paciente Anônimo";
    
    // Determina prioridade baseada na intensidade
    let prioridade = "Média";
    if (intensidadeSelecionada === "Intensa") prioridade = "Emergência";
    else if (intensidadeSelecionada === "Forte") prioridade = "Alta";

    const novoPaciente = {
        nome: nome,
        intensidade: intensidadeSelecionada || "Não informada",
        prioridade: prioridade
    };

    pacientes.push(novoPaciente);
    atualizarFilaPublica();
    goToPage('page-fila');
}

// Atualiza a visão do Paciente
function atualizarFilaPublica() {
    const lista = document.getElementById('lista-pacientes');
    const posElem = document.getElementById('posicao-fila');
    const statusElem = document.getElementById('status-prioridade');

    lista.innerHTML = '';
    
    pacientes.forEach((p, i) => {
        const li = document.createElement('li');
        li.className = "flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100";
        li.innerHTML = `
            <span class="font-medium text-slate-700">${i + 1}. ${p.nome}</span>
            <span class="text-xs font-bold px-2 py-1 rounded ${getCorPrioridade(p.prioridade)}">${p.prioridade}</span>
        `;
        lista.appendChild(li);
    });

    const ultimaPos = pacientes.length;
    posElem.innerText = String(ultimaPos).padStart(2, '0') + 'º';
    statusElem.innerText = `Prioridade: ${pacientes[ultimaPos-1].prioridade}`;
}

// Lógica do Médico
function logarMedico() {
    // Simulação simples de login
    const crm = document.getElementById('crm-medico').value;
    if(crm.length > 2) {
        goToPage('page-dashboard');
    } else {
        alert("Digite um CRM válido");
    }
}

function popularDashboard() {
    const ul = document.getElementById('lista-dashboard');
    const totalP = document.getElementById('total-pacientes');
    const totalE = document.getElementById('total-emergencias');
    
    ul.innerHTML = '';
    let emergencias = 0;

    pacientes.forEach((p, i) => {
        if(p.prioridade === 'Emergência') emergencias++;
        
        const li = document.createElement('li');
        li.className = "fila-item flex justify-between p-4 bg-white border rounded-xl cursor-pointer shadow-sm";
        li.innerHTML = `
            <div>
                <p class="font-bold text-slate-800">${p.nome}</p>
                <p class="text-sm text-slate-500">Sintoma: ${p.intensidade}</p>
            </div>
            <span class="font-bold ${getCorTextoPrioridade(p.prioridade)}">${p.prioridade}</span>
        `;
        li.onclick = () => mostrarDetalhes(p);
        ul.appendChild(li);
    });

    totalP.innerText = pacientes.length;
    totalE.innerText = emergencias;
}

function mostrarDetalhes(p) {
    const box = document.getElementById('detalhes-paciente');
    box.innerHTML = `
        <h3 class="text-xl font-bold text-slate-800 mb-4">Prontuário</h3>
        <div class="space-y-3">
            <p><strong>Paciente:</strong> ${p.nome}</p>
            <p><strong>Estado:</strong> ${p.intensidade}</p>
            <p><strong>Classificação:</strong> <span class="px-2 py-1 rounded text-white ${getCorPrioridade(p.prioridade)}">${p.prioridade}</span></p>
            <hr class="my-4">
            <button onclick="alert('Atendimento iniciado')" class="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold">Chamar Paciente</button>
        </div>
    `;
}

// Helpers de Estilo
function getCorPrioridade(p) {
    if (p === "Emergência") return "bg-red-500 text-white";
    if (p === "Alta") return "bg-orange-400 text-white";
    return "bg-yellow-400 text-slate-800";
}

function getCorTextoPrioridade(p) {
    if (p === "Emergência") return "text-red-600";
    if (p === "Alta") return "text-orange-500";
    return "text-yellow-600";
}

// Inicializa a fila ao carregar
atualizarFilaPublica();

