document.addEventListener("DOMContentLoaded", function () {
    
    const btnCarregarDados = document.getElementById("btnCarregarDados");
    btnCarregarDados.addEventListener("click", fetchListar);

    console.log('exibindo.js foi carregado');
});

function fetchListar() {
    return fetch('http://localhost:3000/listarVoo', { cache: 'no-store' })
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            preencherTabela(data.payload);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

function preencherTabela(voos) {
    console.log('Função preencherTabela() foi chamada');
    console.log(voos)
    const tbody = document.getElementById("tblAlunosDados");
    let count = 0;

    tbody.innerHTML = '';

    if (voos) {
        voos.forEach((voo) => {
            let estilo = (count % 2 === 0) ? "linhaPar" : "linhaImpar";
            let linha = `
                <tr class="${estilo}">
                <td>${voo.codigo}</td>
                <td>${voo.aeronave}</td>
                <td>${voo.aeroportoSaida}</td>
                <td>${voo.aeroportoDestino}</td>
                <td>${voo.escalas}</td>
                <td>${voo.valor}</td>
                <td>${voo.dataSaida}</td>
                <td>${voo.horaSaida}</td>
                <td>${voo.dataChegada}</td>
                <td>${voo.horaChegada}</td>
                </tr>`;
            tbody.innerHTML += linha;
            count++;
        });
    }
}