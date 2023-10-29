function fetchAlunos(){
    let voos = [];
    const a1 = { codigo: '100', origem: "Campinas", destino: "São Paulo", horario: "11:00", assentos: "2"};
    const a2 = { codigo: '101', origem: "São Paulo", destino: "Campinas", horario: "12:00", assentos: "2"};
    const a3 = { codigo: '102', origem: "Rio de Janeiro", destino: "São Paulo", horario: "13:00", assentos: "2"};
    const a4 = { codigo: '103', origem: "São Paulo", destino: "Rio de Janeiro", horario: "14:00", assentos: "2"};

    voos.push(a1);
    voos.push(a2);
    voos.push(a3);
    voos.push(a4);
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
    const voos = fetchAlunos();
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