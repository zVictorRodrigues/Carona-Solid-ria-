document.addEventListener('DOMContentLoaded', function() {
    const salvarButton = document.getElementById('salvar');

    // Recuperar informações do perfil do localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));

    // Preencher os campos Nome, CPF, Telefone e Tipo de Usuário
    document.getElementById('horario').value = '';
    document.getElementById('assentos').value = '';
    document.getElementById('cep').value = '';

    // Exibir CPF, Telefone e Tipo de Usuário
    document.getElementById('cpf').value = formatarCPF(userData.cpf) || '';
    document.getElementById('telefone').value = formatarTelefone(userData.telefone) || '';
    document.getElementById('tipoUsuario').value = obterTipoUsuario(userData) || ''; // Preencher o tipo de usuário

    salvarButton.addEventListener('click', function() {
        const nome = document.getElementById('nome').value.trim();
        const horario = document.getElementById('horario').value.trim();
        const assentos = document.getElementById('assentos').value.trim();
        const cep = document.getElementById('cep').value.trim();
        const cpf = userData.cpf; // CPF já está no formato correto
        const telefone = userData.telefone; // Telefone já está no formato correto
        const tipoUsuario = userData.tipoUsuario; // Tipo de usuário do perfil

        if (nome === '' || horario === '' || assentos === '' || cep === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        salvarInformacoesCarona(nome, horario, assentos, cep, cpf, telefone, tipoUsuario); // Incluído tipo de usuário
        alert('Informações da carona salvas com sucesso!');
        limparCampos();
    });
});

function salvarInformacoesCarona(nome, horario, assentos, cep, cpf, telefone, tipoUsuario) {
    const cepFormatado = cep.replace(/-/g, '');

    const carona = {
        nome: nome,
        horarioPartida: horario,
        assentosDisponiveis: assentos,
        cep: cep,
        cpf: cpf, // Incluído CPF
        telefone: telefone, // Incluído telefone
        tipoUsuario: tipoUsuario // Incluído tipo de usuário
    };

// Obtém todas as caronas já salvas no localStorage
const caronasJSON = localStorage.getItem('caronas');
const caronas = caronasJSON ? JSON.parse(caronasJSON) : [];

    // Adiciona a nova carona à lista de caronas
    caronas.push(carona);

    // Salva a lista atualizada de caronas de volta no localStorage
    localStorage.setItem('caronas', JSON.stringify(caronas));
}


function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('horario').value = '';
    document.getElementById('assentos').value = '';
    document.getElementById('cep').value = '';
}

// Função para formatar CPF
function formatarCPF(cpf) {
    if (!cpf) return '';
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

// Função para formatar telefone
function formatarTelefone(telefone) {
    if (!telefone) return '';
    return telefone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
}

// Função para obter o tipo de usuário
function obterTipoUsuario(userData) {
    if (userData.tipoUsuario === 'aluno') {
        return 'Aluno';
    } else if (userData.tipoUsuario === 'funcionario') {
        return 'Funcionário';
    } else {
        return '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep');

    cepInput.addEventListener('input', function() {
        let cep = cepInput.value.replace(/\D/g, '');
        if (cep.length > 5) {
            cep = cep.substring(0, 5) + '-' + cep.substring(5);
        }
        cepInput.value = cep;
    });
});
