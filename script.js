// =========================
// BANCO DE DADOS SIMULADO
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
        document.getElementById('nome-paciente').value.trim();

    const nascimento =
        document.getElementById('nascimento-paciente').value;

    const telefone =
        document.getElementById('telefone-paciente').value.trim();

    if (!nome || !nascimento || !telefone) {

        alert("Preencha todos os campos obrigatórios.");

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
// ENTRAR NA FILA
// =========================

function entrarNaFila() {

    const nome =
        document.getElementById('nome-paciente').value.trim();

    const sintomas =
        document.getElementById('sintomas').value.trim();

    const tempo =
        document.getElementById('tempo-sintomas').value;

    const alergias =
        document.getElementById('alergias').value.trim();

    // validação
    if (!sintomas || !tempo || !intensidadeSelecionada) {

        alert("Preencha todos os campos obrigatórios.");

        return;
    }

    // prioridade hospitalar
    let prioridade = "Azul";
    let peso = 3;

    if (intensidadeSelecionada === "Intensa") {

        prioridade = "Vermelho";
        peso = 0;
    }

    else if (intensidadeSelecionada === "Forte") {

        prioridade = "Amarelo";
        peso = 1;
    }

    else if (intensidadeSelecionada === "Moderada") {

        prioridade = "Verde";
        peso = 2;
    }

    else if (intensidadeSelecionada === "Leve") {

        prioridade = "Azul";
        peso = 3;
    }

    const novoPaciente = {

        nome,
        sintomas,
        tempo,
        alergias,
        intensidade: intensidadeSelecionada,
        prioridade,
        peso
    };

    pacientes.push(novoPaciente);

    // ordena por prioridade
    pacientes.sort((a, b) => a.peso - b.peso);

    atualizarFilaPublica();

    goToPage('page-fila');
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

    // posição do último paciente
    const ultimaPos = pacientes.length;

    posElem.innerText =
        String(ultimaPos).padStart(2, '0') + 'º';

    statusElem.innerText =
        pacientes[ultimaPos - 1].prioridade;

    contador.innerText =
        `${pacientes.length} pacientes`;
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
// INICIALIZAR
// =========================

atualizarFilaPublica();