// Banco de dados simulado (Estado Global)
let pacientes = [
    { nome: "Sophia Santos", intensidade: "Intensa", prioridade: "Emergência" },
    { nome: "Ricardo Oliveira", intensidade: "Forte", prioridade: "Alta" },
    { nome: "Ana Julia", intensidade: "Moderada", prioridade: "Média" }
];

let intensidadeSelecionada = "";

// Navegação Principal
function goToPage(pageId) {
    document.querySelectorAll('section').forEach(s =>
        s.classList.add('hidden')
    );

    document.getElementById(pageId).classList.remove('hidden');

    // Atualiza dashboard
    if (pageId === 'page-dashboard') {
        popularDashboard();
    }

    window.scrollTo(0, 0);
}

// Selecionar intensidade
function selecionarIntensidade(botao, valor) {

    document.querySelectorAll('.btn-intensidade').forEach(b => {
        b.classList.remove('intensidade-active');
    });

    botao.classList.add('intensidade-active');

    intensidadeSelecionada = valor;
}

// Entrar na fila
function entrarNaFila() {

    const nome =
        document.getElementById('nome-paciente').value ||
        "Paciente Anônimo";

    // prioridade
    let prioridade = "Média";

    if (intensidadeSelecionada === "Intensa") {
        prioridade = "Emergência";
    }

    else if (intensidadeSelecionada === "Forte") {
        prioridade = "Alta";
    }

    const novoPaciente = {
        nome: nome,
        intensidade: intensidadeSelecionada || "Não informada",
        prioridade: prioridade
    };

    pacientes.push(novoPaciente);

    atualizarFilaPublica();

    goToPage('page-fila');
}

// Atualiza fila pública
function atualizarFilaPublica() {

    const lista = document.getElementById('lista-pacientes');

    const posElem =
        document.getElementById('posicao-fila');

    const statusElem =
        document.getElementById('status-prioridade');

    const contador =
        document.getElementById('contador-pacientes');

    lista.innerHTML = '';

    pacientes.forEach((p, i) => {

        const li = document.createElement('li');

        // destaque primeiro paciente
        const destaque =
            i === 0
                ? "bg-emerald-700 text-white"
                : "bg-[#f7faf8] text-slate-800";

        li.className =
            `rounded-2xl p-5 flex items-center justify-between ${destaque}`;

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
                    ${i === 0 ? 'bg-white/20 text-white' : 'bg-emerald-700 text-white'}
                ">
                    ${i + 1}
                </div>

                <div>
                    <h3 class="font-bold">
                        ${ocultarSobrenome(p.nome)}
                        ${i === pacientes.length - 1 ? '<span class="text-xs ml-2 opacity-70">você</span>' : ''}
                    </h3>

                    <p class="${i === 0 ? 'text-white/70' : 'text-slate-400'} text-sm">
                        ~ ${i * 12} min de espera
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

    // posição do último paciente (usuário atual)
    const ultimaPos = pacientes.length;

    posElem.innerText =
        String(ultimaPos).padStart(2, '0') + 'º';

    statusElem.innerText =
        pacientes[ultimaPos - 1].prioridade;

    contador.innerText =
        `${pacientes.length} pacientes`;
}

// Oculta sobrenome
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

// Login médico
function logarMedico() {

    const crm =
        document.getElementById('crm-medico').value;

    if (crm.length > 2) {

        goToPage('page-dashboard');

    } else {

        alert("Digite um CRM válido");
    }
}

// Popular dashboard
function popularDashboard() {

    const ul =
        document.getElementById('lista-dashboard');

    const totalP =
        document.getElementById('total-pacientes');

    const totalE =
        document.getElementById('total-emergencias');

    ul.innerHTML = '';

    let emergencias = 0;

    pacientes.forEach((p) => {

        if (p.prioridade === 'Emergência') {
            emergencias++;
        }

        const li = document.createElement('li');

        li.className =
            "fila-item flex justify-between p-4 bg-white border rounded-xl cursor-pointer shadow-sm";

        li.innerHTML = `
            <div>
                <p class="font-bold text-slate-800">
                    ${p.nome}
                </p>

                <p class="text-sm text-slate-500">
                    Sintoma: ${p.intensidade}
                </p>
            </div>

            <span class="font-bold ${getCorTextoPrioridade(p.prioridade)}">
                ${p.prioridade}
            </span>
        `;

        li.onclick = () => mostrarDetalhes(p);

        ul.appendChild(li);
    });

    totalP.innerText = pacientes.length;

    totalE.innerText = emergencias;
}

// Mostrar detalhes paciente
function mostrarDetalhes(p) {

    const box =
        document.getElementById('detalhes-paciente');

    box.innerHTML = `
        <h3 class="text-xl font-bold text-slate-800 mb-4">
            Prontuário
        </h3>

        <div class="space-y-3">

            <p>
                <strong>Paciente:</strong> ${p.nome}
            </p>

            <p>
                <strong>Estado:</strong> ${p.intensidade}
            </p>

            <p>
                <strong>Classificação:</strong>

                <span class="
                    px-2
                    py-1
                    rounded
                    text-white
                    ${getCorPrioridade(p.prioridade)}
                ">
                    ${p.prioridade}
                </span>
            </p>

            <hr class="my-4">

            <button
                onclick="alert('Atendimento iniciado')"
                class="
                    w-full
                    bg-emerald-600
                    text-white
                    py-2
                    rounded-lg
                    font-bold
                "
            >
                Chamar Paciente
            </button>

        </div>
    `;
}

// Confirmar cancelamento
function confirmarCancelamento() {

    const primeiraConfirmacao = confirm(
        "Tem certeza que deseja cancelar seu atendimento?"
    );

    if (!primeiraConfirmacao) return;

    const segundaConfirmacao = confirm(
        "Seu atendimento será removido da fila. Deseja realmente continuar?"
    );

    if (!segundaConfirmacao) return;

    alert("Atendimento cancelado com sucesso.");

    goToPage('page-home');
}

// Helpers prioridade
function getCorPrioridade(p) {

    if (p === "Emergência") {
        return "bg-red-500 text-white";
    }

    if (p === "Alta") {
        return "bg-orange-400 text-white";
    }

    return "bg-yellow-300 text-yellow-900";
}

function getCorTextoPrioridade(p) {

    if (p === "Emergência") {
        return "text-red-600";
    }

    if (p === "Alta") {
        return "text-orange-500";
    }

    return "text-yellow-600";
}

// Inicializa
atualizarFilaPublica();