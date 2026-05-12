function loginMedico(){

    const crm =
        document.getElementById('crm-medico').value;

    const senha =
        document.getElementById('senha-medico').value;


    if(!crm || !senha){

        alert('Preencha todos os campos.');

        return;
    }


    document
        .getElementById('page-login')
        .classList.add('hidden');


    document
        .getElementById('page-dashboard')
        .classList.remove('hidden');


    atualizarDashboard();
}
// ======================================
// RELÓGIO
// ======================================

function atualizarRelogio() {

    const agora = new Date();

    const horas = String(agora.getHours()).padStart(2, '0');

    const minutos = String(agora.getMinutes()).padStart(2, '0');

    document.getElementById('clock-box').innerText =
        `${horas}:${minutos}`;
}

setInterval(atualizarRelogio, 1000);

atualizarRelogio();


// ======================================
// LOGOUT
// ======================================

function logoutMedico() {

    const confirmar = confirm(
        'Deseja realmente encerrar a sessão médica?'
    );

    if(confirmar){

        window.location.href = 'index.html';
    }
}


// ======================================
// CARREGAR PACIENTES
// ======================================

function carregarPacientes() {

    return JSON.parse(
        localStorage.getItem('pacientes')
    ) || [];
}


// ======================================
// SALVAR PACIENTES
// ======================================

function salvarPacientes(pacientes) {

    localStorage.setItem(
        'pacientes',
        JSON.stringify(pacientes)
    );
}


// ======================================
// DASHBOARD
// ======================================

function atualizarDashboard() {

    const pacientes = carregarPacientes();

    const lista =
        document.getElementById('lista-dashboard');

    const totalPacientes =
        document.getElementById('total-pacientes');

    const totalEmergencias =
        document.getElementById('total-emergencias');

    const totalAtendimento =
        document.getElementById('total-atendimento');

    const contadorLista =
        document.getElementById('contador-lista');

    lista.innerHTML = '';

    let emergencias = 0;

    let emAtendimento = 0;


    pacientes.forEach((paciente, index) => {

        if(paciente.prioridade === 'Vermelho') {
            emergencias++;
        }

        if(paciente.status === 'Em atendimento') {
            emAtendimento++;
        }

        const li = document.createElement('li');

        li.className = 'patient-item';

        li.onclick = () => abrirPaciente(index);

        li.innerHTML = `

            <div class="patient-top">

                <div>

                    <h3 class="patient-name">
                        ${paciente.nome}
                    </h3>

                    <p class="patient-symptom">
                        ${paciente.sintomas}
                    </p>

                </div>

                <span class="priority ${paciente.prioridade.toLowerCase()}">
                    ${paciente.prioridade}
                </span>

            </div>

            <div class="patient-footer">

                <span>
                    ${paciente.intensidade}
                </span>

                <span>
                    ${paciente.status}
                </span>

            </div>

        `;

        lista.appendChild(li);
    });

    totalPacientes.innerText = pacientes.length;

    totalEmergencias.innerText = emergencias;

    totalAtendimento.innerText = emAtendimento;

    contadorLista.innerText =
        `${pacientes.length} pacientes`;
}


// ======================================
// ABRIR PACIENTE
// ======================================

function abrirPaciente(index) {

    const pacientes = carregarPacientes();

    const paciente = pacientes[index];

    const box =
        document.getElementById('detalhes-paciente');

    box.innerHTML = `

        <div class="patient-details">

            <div class="details-header">

                <div>

                    <p class="details-label">
                        Paciente
                    </p>

                    <h2>
                        ${paciente.nome}
                    </h2>

                </div>

                <span class="priority ${paciente.prioridade.toLowerCase()}">
                    ${paciente.prioridade}
                </span>

            </div>


            <div class="details-grid">

                <div class="detail-card">

                    <span>
                        Data de nascimento
                    </span>

                    <strong>
                        ${paciente.nascimento}
                    </strong>

                </div>

                <div class="detail-card">

                    <span>
                        Telefone
                    </span>

                    <strong>
                        ${paciente.telefone}
                    </strong>

                </div>

                <div class="detail-card">

                    <span>
                        Intensidade
                    </span>

                    <strong>
                        ${paciente.intensidade}
                    </strong>

                </div>

                <div class="detail-card">

                    <span>
                        Tempo dos sintomas
                    </span>

                    <strong>
                        ${paciente.tempo}
                    </strong>

                </div>

            </div>


            <div class="detail-section">

                <p>
                    Sintomas
                </p>

                <div class="detail-box">
                    ${paciente.sintomas}
                </div>

            </div>


            <div class="detail-section">

                <p>
                    Alergias
                </p>

                <div class="detail-box">

                    ${paciente.alergias || 'Nenhuma informada'}

                </div>

            </div>


            <div class="detail-section">

                <p>
                    Status atual
                </p>

                <div class="detail-box">

                    ${paciente.status}

                </div>

            </div>


            <div class="actions">

                <button
                    class="btn-start"
                    onclick="iniciarAtendimento(${index})">

                    ▶ Iniciar atendimento

                </button>

                <button
                    class="btn-finish"
                    onclick="finalizarAtendimento(${index})">

                    ✓ Finalizar atendimento

                </button>

            </div>

        </div>

    `;
}


// ======================================
// INICIAR ATENDIMENTO
// ======================================

function iniciarAtendimento(index) {

    const pacientes = carregarPacientes();

    pacientes[index].status = 'Em atendimento';

    salvarPacientes(pacientes);

    atualizarDashboard();

    abrirPaciente(index);
}


// ======================================
// FINALIZAR ATENDIMENTO
// ======================================

function finalizarAtendimento(index) {

    const confirmar = confirm(
        'Deseja finalizar este atendimento?'
    );

    if(!confirmar) return;

    const pacientes = carregarPacientes();

    pacientes[index].status = 'Finalizado';

    salvarPacientes(pacientes);

    atualizarDashboard();

    document.getElementById('detalhes-paciente').innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                ✅
            </div>

            <h3>
                Atendimento finalizado
            </h3>

            <p>
                O paciente foi marcado como finalizado.
            </p>

        </div>

    `;
}


// ======================================
// ATUALIZAÇÃO AUTOMÁTICA
// ======================================

setInterval(() => {

    atualizarDashboard();

}, 2000);


// ======================================
// INICIALIZAÇÃO
// ======================================

atualizarDashboard();