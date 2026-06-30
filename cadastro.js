// Array global para simular o banco de dados em memória
let usuarios = [];
let idContador = 1;

// Mapeamento dos elementos do HTML
const form = document.getElementById('cadastroForm');
const tabela = document.getElementById('tabelaUsuarios');
const mensagemVazia = document.getElementById('mensagemVazia');

// Função para atualizar a tabela na área administrativa
function atualizarTabelaAdmin() {
    // Limpa as linhas atuais da tabela
    tabela.innerHTML = '';

    // Se não houver usuários, exibe o texto de tabela vazia
    if (usuarios.length === 0) {
        mensagemVazia.style.display = 'block';
        return;
    }

    mensagemVazia.style.display = 'none';

    // Alimenta a tabela construindo as linhas (tr) dinamicamente
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

// Função para capturar o envio do formulário
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o recarregamento da página

    // Captura os valores digitados nos inputs
    const nomeValue = document.getElementById('nome').value;
    const emailValue = document.getElementById('email').value;
    const perfilValue = document.getElementById('perfil').value;

    // Cria o objeto do novo usuário
    const novoUsuario = {
        id: idContador++,
        nome: nomeValue,
        email: emailValue,
        perfil: perfilValue
    };

    // Salva o objeto no array
    usuarios.push(novoUsuario);

    // Reseta todos os campos de digitação do formulário
    form.reset();

    // Atualiza o painel do administrador
    atualizarTabelaAdmin();
});

// Função para excluir um usuário pelo ID
function deletarUsuario(id) {
    // Filtra e remove o usuário correspondente do array
    usuarios = usuarios.filter(usuario => usuario.id !== id);
   
    // Atualiza a tabela na tela
    atualizarTabelaAdmin();
}
