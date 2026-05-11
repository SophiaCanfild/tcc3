function entrarSistema() {

    const crm = document.getElementById('crm-medico').value.trim();
    const senha = document.getElementById('senha-medico').value.trim();

    if(crm === '' || senha === ''){

        alert('Preencha todos os campos.');
        return;
    }

    document.getElementById('page-login-medico').classList.add('hidden');
    document.getElementById('page-dashboard').classList.remove('hidden');

    atualizarDashboard();
}

function logoutMedico(){

    document.getElementById('page-dashboard').classList.add('hidden');
    document.getElementById('page-login-medico').classList.remove('hidden');
}

function atualizarDashboard(){

    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

    const lista = document.getElementById('lista-dashboard');

    const totalPacientes = document.getElementById('total-pacientes');
    const totalEmergencias = document.getElementById('total-emergencias');
    const totalAtendimento = document.getElementById('total-atendimento');
    const contadorFila = document.getElementById('contador-fila');

    lista.innerHTML = '';

    let emergencias = 0;
    let atendimento = 0;

    pacientes.forEach((paciente,index)=>{

        if(paciente.prioridade === 'Vermelho'){
            emergencias++;
        }

        if(paciente.status === 'Em atendimento'){
            atendimento++;
        }

        const li = document.createElement('li');

        li.className =
        'p-5 rounded-3xl border border-slate-100 mb-4 cursor-pointer hover:shadow-lg transition bg-white';

        li.innerHTML = `
            <div class="flex justify-between items-center">

                <div>

                    <h4 class="text-lg font-bold text-slate-800">
                        ${paciente.nome}
                    </h4>

                    <p class="text-slate-500 mt-1">
                        ${paciente.sintomas}
                    </p>

                </div>

                <div class="text-right">

                    <span class="px-4 py-2 rounded-full text-sm font-bold ${corPrioridade(paciente.prioridade)}">
                        ${paciente.prioridade}
                    </span>

                    <p class="text-xs text-slate-400 mt-2">
                        ${paciente.status || 'Aguardando'}
                    </p>

                </div>

            </div>
        `;

        li.onclick = ()=> mostrarDetalhes(paciente,index);

        lista.appendChild(li);
    });

    totalPacientes.innerText = pacientes.length;
    totalEmergencias.innerText = emergencias;
    totalAtendimento.innerText = atendimento;
    contadorFila.innerText = pacientes.length + ' pacientes';
}

function mostrarDetalhes(paciente,index){

    const box = document.getElementById('detalhes-paciente');

    box.innerHTML = `
    
        <div class="space-y-6">

            <div>

                <div class="flex justify-between items-start mb-4">

                    <div>

                        <h2 class="text-3xl font-bold text-slate-800">
                            ${paciente.nome}
                        </h2>

                        <p class="text-slate-500 mt-2">
                            Paciente em triagem
                        </p>

                    </div>

                    <span class="px-5 py-2 rounded-full font-bold ${corPrioridade(paciente.prioridade)}">
                        ${paciente.prioridade}
                    </span>

                </div>

            </div>

            <div class="grid grid-cols-2 gap-4">

                <div class="bg-slate-50 rounded-2xl p-5">
                    <p class="text-slate-400 text-sm">Telefone</p>
                    <h4 class="font-bold mt-2">${paciente.telefone}</h4>
                </div>

                <div class="bg-slate-50 rounded-2xl p-5">
                    <p class="text-slate-400 text-sm">Nascimento</p>
                    <h4 class="font-bold mt-2">${paciente.nascimento}</h4>
                </div>

            </div>

            <div class="bg-slate-50 rounded-2xl p-5">

                <p class="text-slate-400 text-sm mb-3">
                    Sintomas
                </p>

                <p class="text-slate-700 leading-relaxed">
                    ${paciente.sintomas}
                </p>

            </div>

            <div class="bg-slate-50 rounded-2xl p-5">

                <p class="text-slate-400 text-sm mb-3">
                    Alergias
                </p>

                <p class="text-slate-700">
                    ${paciente.alergias || 'Nenhuma informada'}
                </p>

            </div>

            <div class="grid grid-cols-2 gap-4 pt-4">

                <button
                    onclick="iniciarAtendimento(${index})"
                    class="h-14 rounded-2xl bg-emerald-600 text-white font-bold">

                    Iniciar atendimento

                </button>

                <button
                    onclick="finalizarAtendimento(${index})"
                    class="h-14 rounded-2xl bg-red-500 text-white font-bold">

                    Finalizar

                </button>

            </div>

        </div>
    `;
}

function iniciarAtendimento(index){

    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

    pacientes[index].status = 'Em atendimento';

    localStorage.setItem('pacientes',JSON.stringify(pacientes));

    atualizarDashboard();
    mostrarDetalhes(pacientes[index],index);
}

function finalizarAtendimento(index){

    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

    pacientes.splice(index,1);

    localStorage.setItem('pacientes',JSON.stringify(pacientes));

    atualizarDashboard();

    document.getElementById('detalhes-paciente').innerHTML = `
    
        <div class="empty-state">

            <div class="empty-icon">
                ✅
            </div>

            <h3>
                Atendimento finalizado
            </h3>

        </div>
    `;
}

function corPrioridade(prioridade){

    if(prioridade === 'Vermelho'){
        return 'bg-red-100 text-red-600';
    }

    if(prioridade === 'Amarelo'){
        return 'bg-yellow-100 text-yellow-700';
    }

    if(prioridade === 'Verde'){
        return 'bg-green-100 text-green-700';
    }

    return 'bg-blue-100 text-blue-700';
}