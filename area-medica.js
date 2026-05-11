function loginMedico() {

    const crm = document.getElementById('crm-medico');

    const senha = document.getElementById('senha-medico');

    // validação
    if (!crm.checkValidity() || !senha.checkValidity()) {

        crm.reportValidity();

        senha.reportValidity();

        return;
    }

    document
        .getElementById('page-medico-login')
        .classList.add('hidden');

    document
        .getElementById('page-medico-dashboard')
        .classList.remove('hidden');
}


function voltarLogin() {

    document
        .getElementById('page-medico-dashboard')
        .classList.add('hidden');

    document
        .getElementById('page-medico-login')
        .classList.remove('hidden');
}