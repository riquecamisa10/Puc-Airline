function listarBanco(){
   
    return voos;
}

function fetchListar(body) {
    const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
};

return fetch('http://localhost:3000/listarAeronave', requestOptions)
.then(T => T.json())
}

function preencherTabela(){
    console.log('Função preencherTabela() foi chamada');
    const voos = listarBanco();
    let tbody = document.getElementById("tblAlunosDados");
    let count = 0;

    tbody.innerHTML = '';

    voos.forEach((voos) => {
        let estilo = (count % 2 === 0) ? "linhaPar" : "linhaImpar";
        let linha = `
            <tr class="${estilo}">
                <td>${voos.codigo}</td>
                <td>${voos.origem}</td>
                <td>${voos.destino}</td>
                <td>${voos.horario}</td>
                <td>${voos.assentos}</td>
            </tr>`;
        tbody.innerHTML += linha;
        count++;
    });
}