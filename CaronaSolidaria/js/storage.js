function salvarInformacoesCarona(horarioPartida, assentosDisponiveis, cepOffer, bairro, rua) {
    const carona = {
        horarioPartida: horarioPartida,
        assentosDisponiveis: assentosDisponiveis,
        bairro: bairro,
        rua: rua,
        cepOffer: cepOffer
    };
    localStorage.setItem(cepOffer, JSON.stringify(carona)); // Usando o CEP como chave
}
