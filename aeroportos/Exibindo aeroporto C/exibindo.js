document.addEventListener("DOMContentLoaded", function () {
    
    const btnCarregarDados = document.getElementById("btnCarregarDados");
    btnCarregarDados.addEventListener("click", fetchListar);

    console.log('exibindo.js foi carregado');
});

function fetchListar() {
    return fetch('http://localhost:3000/listarTrecho', { cache: 'no-store' })
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            preencherTabela(data.payload);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

function preencherTabela(trecho) {
    console.log('Função preencherTabela() foi chamada');
    console.log(trecho)
    const tbody = document.getElementById("tblAlunosDados");
    let count = 0;

    tbody.innerHTML = '';

    if (trecho) {
        trecho.forEach((trecho) => {
            let estilo = (count % 2 === 0) ? "linhaPar" : "linhaImpar";
            let linha = `
                <tr class="${estilo}">
                <td>${trecho.codigo}</td>
                <td>${trecho.nome}</td>
                <td>${trecho.sigla}</td>
                <td>${trecho.cidade}</td>
                <td>${trecho.pais}</td>sss
                </tr>`;
            tbody.innerHTML += linha;
            count++;
        });
    }
}