let usuarios = [];
let idContador = 1;

const form = document.getElementById('cadastroForm');
const tabela = document.getElementById('tabelaUsuarios');
const mensagemVazia = document.getElementById('mensagemVazia');

function atualizarTabelaAdmin() {
    tabela.innerHTML = '';
    if (usuarios.length === 0) {
        mensagemVazia.style.display = 'block';
        return;
    }
    mensagemVazia.style.display = 'none';

    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.perfil}</td>
            <td>
                <button class="btn-delete" onclick="deletarUsuario(${usuario.id})">Excluir</button>
            </td>
        `;
        tabela.appendChild(tr);
    });
}

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nomeValue = document.getElementById('nome').value;
    const emailValue = document.getElementById('email').value;
    const perfilValue = document.getElementById('perfil').value;

    const novoUsuario = {
        id: idContador++,
        nome: nomeValue,
        email: emailValue,
        perfil: perfilValue
    };

    usuarios.push(novoUsuario);
    form.reset();
    atualizarTabelaAdmin();
    
    // Opcional: Redireciona para a aba do painel após cadastrar
    abrirAba('admin');
});

function deletarUsuario(id) {
    usuarios = usuarios.filter(usuario => usuario.id !== id);
    atualizarTabelaAdmin();
}

// NOVA FUNÇÃO: Controla a troca de abas
function abrirAba(idAba) {
    // Esconde todos os conteúdos das abas
    document.querySelectorAll('.tab-content').forEach(aba => {
        aba.classList.remove('active');
    });

    // Desativa todos os botões
    document.querySelectorAll('.tab-btn').forEach(botao => {
        botao.classList.remove('active');
    });

    // Mostra a aba atual e ativa o botão correto
    document.getElementById(idAba).classList.add('active');
    event.currentTarget.classList.add('active');
}
