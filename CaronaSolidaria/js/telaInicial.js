document.addEventListener('DOMContentLoaded', function() {
    verificarNotificacoesCarona();
});

function verificarNotificacoesCarona() {
    const notificacoesContainer = document.getElementById('notificacoes');
    notificacoesContainer.innerHTML = ''; // Limpa as notificações anteriores

    const notificacoes = JSON.parse(localStorage.getItem('notificacoesCarona')) || [];

    if (notificacoes.length === 0) {
        const mensagem = document.createElement('p');
        mensagem.textContent = 'Não há novas notificações de carona.';
        notificacoesContainer.appendChild(mensagem);
    } else {
        notificacoes.forEach(notificacao => {
            const notificacaoElement = document.createElement('div');
            notificacaoElement.classList.add('notificacao-item');
            notificacaoElement.textContent = notificacao.mensagem;
            notificacaoElement.addEventListener('click', function() {
                exibirDetalhesSolicitacaoCarona(notificacao.caronaId);
            });
            notificacoesContainer.appendChild(notificacaoElement);
        });
    }
}

function exibirDetalhesSolicitacaoCarona(caronaId) {
    // Aqui você deve implementar a lógica para abrir o modal com os detalhes da solicitação de carona
    // Você pode buscar os detalhes da solicitação no armazenamento local usando o caronaId
    // Após exibir os detalhes, você pode remover a notificação associada
    const notificacoes = JSON.parse(localStorage.getItem('notificacoesCarona')) || [];
    const updatedNotificacoes = notificacoes.filter(notificacao => notificacao.caronaId !== caronaId);
    localStorage.setItem('notificacoesCarona', JSON.stringify(updatedNotificacoes));
}


// Função para alternar a exibição da central de notificações
function toggleNotificacoes() {
    const notificacoesContainer = document.getElementById('notificacoes');
    if (notificacoesContainer.style.display === 'block') {
        notificacoesContainer.style.display = 'none';
    } else {
        notificacoesContainer.style.display = 'block';
        // Ao exibir as notificações, verifica se há novas notificações
        verificarNotificacoesCarona();
    }
}

// Evento para fechar a central de notificações ao clicar fora dela
window.addEventListener('click', function(event) {
    const notificacoesContainer = document.getElementById('notificacoes');
    if (!event.target.matches('.notificacao-icon') && !notificacoesContainer.contains(event.target)) {
        notificacoesContainer.style.display = 'none';
    }
});


