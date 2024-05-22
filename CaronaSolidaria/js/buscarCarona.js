document.addEventListener('DOMContentLoaded', function() {
    const buscarButton = document.getElementById('buscar');

    buscarButton.addEventListener('click', function() {
        const cepDestino = document.getElementById('cepDestino').value.trim();
        if (cepDestino === '') {
            alert('Por favor, digite um CEP válido.');
            return;
        }
        buscarInformacoesCarona(cepDestino);
    });
});

function buscarInformacoesCarona(cepDestino) {
    buscarInformacoesViaCEP(cepDestino)
        .then(response => {
            console.log('Resposta do ViaCEP:', response);
            if (response.erro) {
                exibirErro();
            } else {
                exibirCaronas(response);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar informações do ViaCEP:', error);
            exibirErro();
        });
}

async function buscarInformacoesViaCEP(cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const response = await fetch(url);
    return await response.json();
}

function exibirCaronas(response) {
    const infoCaronaDiv = document.getElementById('infoCarona');
    infoCaronaDiv.innerHTML = '';

    const caronas = buscarInformacoesLocalStorage(response.cep);
    
    if (caronas.length === 0) {
        exibirErro();
        return;
    }

    caronas.forEach(carona => {
        // Cria um card para cada carona
        const caronaCard = document.createElement('div');
        caronaCard.classList.add('carona-card');

        const infoCaronaElement = document.createElement('div');
        infoCaronaElement.classList.add('carona-info');
        infoCaronaElement.innerHTML = `
            <h4>Caronas Disponíveis:</h4>
            <p>Nome: ${carona.nome}</p>
            <p>Horário de Partida: ${carona.horarioPartida}</p>
            <p>Assentos Disponíveis: ${carona.assentosDisponiveis}</p>
            <p>CEP: ${carona.cep}</p>
            <p>Bairro: ${response.bairro}</p>
            <p>Rua: ${response.logradouro}</p>
            <p>Município: ${response.localidade}</p>
           
        `;
        caronaCard.appendChild(infoCaronaElement);

        // Adicionar evento de clique para exibir detalhes da carona
        caronaCard.addEventListener('click', function() {
            exibirDetalhesCarona(carona);
        });

        infoCaronaDiv.appendChild(caronaCard);
    });
}

function exibirDetalhesCarona(carona) {
    const modal = document.getElementById('caronaModal');
    modal.style.display = "block";

    const modalContent = document.getElementById('caronaModalContent');
    modalContent.innerHTML = `
        <span class="close" onclick="fecharModal('caronaModal')">&times;</span>
        <h2>Detalhes da Carona</h2>
        <p><strong>Nome:</strong> ${carona.nome}</p>
        <p><strong>Telefone:</strong> ${formatarTelefone(carona.telefone)}</p>
        <p><strong>Horário de Partida:</strong> ${carona.horarioPartida}</p>
        <p><strong>Assentos Disponíveis:</strong> ${carona.assentosDisponiveis}</p>
        <p><strong>CEP:</strong> ${carona.cep}</p>
        <p><strong>Tipo de Usuário:</strong> ${carona.tipoUsuario}</p>
        <button id="solicitarCaronaBtn">Solicitar Carona</button>
    `;

     // Configurar evento de clique para o botão "Solicitar Carona"
     const solicitarCaronaBtn = document.getElementById('solicitarCaronaBtn');
     solicitarCaronaBtn.addEventListener('click', function() {
         solicitarCarona(carona);
     });
 }

 function solicitarCarona(carona) {
    const notification = {
        id: generateNotificationId(),
        message: 'Carona Disponível: ' + carona.nome // Mensagem da notificação
    };
    alert('Sua solicitação de carona foi enviada para: ' + carona.nome);

    // Armazenar a notificação localmente
    storeNotification(notification);

    // Atualizar a barra de notificações na tela inicial
    updateNotificationBar();
}


function exibirErro() {
    const infoCaronaDiv = document.getElementById('infoCarona');
    infoCaronaDiv.innerHTML = '<p>Nenhuma carona disponível para este CEP.</p>';
}

function buscarInformacoesLocalStorage(cep) {
    const caronas = JSON.parse(localStorage.getItem('caronas')) || [];
    console.log('Caronas armazenadas:', caronas);
    return caronas.filter(carona => carona.cep === cep);
}

function limparTodasCaronas() {
    localStorage.removeItem('caronas');
    alert('Todas as caronas foram removidas.');
}

// Função para formatar telefone
function formatarTelefone(telefone) {
    if (!telefone) return '';
    return telefone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
}

// Função para abrir o modal
function abrirModal(idModal) {
    var modal = document.getElementById(idModal);
    modal.style.display = "block";
}

// Função para fechar o modal
function fecharModal(idModal) {
    var modal = document.getElementById(idModal);
    modal.style.display = "none";
}

// Fechar o modal quando clicar fora do conteúdo
window.onclick = function(event) {
    var modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++) {
        var modal = modals[i];
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

// Função para gerar um ID único para a notificação
function generateNotificationId() {
    return 'notification_' + Date.now();
}

// Função para armazenar a notificação localmente
function storeNotification(notification) {
    // Obtém as notificações armazenadas localmente ou inicializa um array vazio se não houver notificações
    var notifications = JSON.parse(localStorage.getItem('notifications')) || [];

    // Adiciona a nova notificação ao array
    notifications.push(notification);

    // Armazena o array atualizado de notificações localmente
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

function updateNotificationBar() {
    try {
        // Obtém a barra de notificações
        var notificationBar = document.getElementById('notificationBar');

        // Verifica se a barra de notificações existe
        if (!notificationBar) {
            console.error('A barra de notificações não foi encontrada.');
            return;
        }

        // Obtém as notificações armazenadas localmente
        var notifications = JSON.parse(localStorage.getItem('notifications')) || [];

        // Limpa as notificações anteriores
        notificationBar.innerHTML = '';

        // Verifica se há notificações
        if (notifications.length > 0) {
            notifications.forEach(function(notification) {
                var notificationElement = document.createElement('div');
                notificationElement.classList.add('notification-item');
                notificationElement.textContent = notification.message;
                notificationBar.appendChild(notificationElement);
            });
        } else {
            // Se não houver notificações, exibe uma mensagem padrão
            var notificationElement = document.createElement('p');
            notificationElement.classList.add('notification-text');
            notificationElement.textContent = 'Sem notificações';
            notificationBar.appendChild(notificationElement);
        }

        // Exibe a barra de notificações
        notificationBar.classList.remove('hidden');
    } catch (error) {
        console.error('Ocorreu um erro ao atualizar a barra de notificações:', error);
    }
}


