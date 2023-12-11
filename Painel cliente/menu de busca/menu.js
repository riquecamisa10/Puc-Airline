document.addEventListener("DOMContentLoaded", function () {
    const btnCarregarDados = document.getElementById("btnCarregarDados");

    if (btnCarregarDados) {
        btnCarregarDados.addEventListener("click", fetchListar);
    }

    console.log('exibindo.js foi carregado');
});

function formatarDataParaOracle(data) {
    const partes = data.split('-');
    return `${partes[0]}-${partes[1]}-${partes[2]}`;
}

function obterDataFormatada() {
    const inputIda = document.getElementById('ida');
    const dataSelecionada = inputIda.value;

    const dataFormatada = formatarDataParaOracle(dataSelecionada);

    console.log(dataFormatada);
}

document.getElementById('ida').addEventListener('change', obterDataFormatada);

function mostrarVolta() {
    var radioIda = document.getElementById("idaRadio");
    var text = document.getElementById("voltaDiv");
    var inputVolta = document.getElementById("volta");
    if (radioIda.checked == true){
        text.style.display = "none";
    } else {
        text.style.display = "block";
        inputVolta.style.textAlign = "left"; 
    }
}

document.querySelector('form').addEventListener('reset', function() {
    document.getElementById('idaRadio').checked = true;
    mostrarVolta();
});

function preencheuDataIda(){
    let resultado = false;
    const ida = document.getElementById("ida").value;
    if(ida.trim().length != 0){
        resultado = true;
    }
    return resultado;
}

function preencheuDataVolta(){
    const volta = document.getElementById("volta").value;
    return volta.trim().length !== 0;
}

function preencheuPartida(){
    let resultado = false;
    const cidadePartida = document.getElementById("partida").value;
    if(cidadePartida.trim().length != 0){
        resultado = true;
    }
    return resultado;
}

function preencheuDestino(){
    let resultado = false;
    const cidadeDestino = document.getElementById("destino").value;
    if(cidadeDestino.trim().length != 0){
        resultado = true;
    }
    return resultado;
}

function showStatusMessage(msg, error){
    var pStatus = document.getElementById("status");

    pStatus.className = error ? "statusError" : "statusSuccess";
    pStatus.textContent = msg;
}

function limparCamposVolta() {
    const voltaInput = document.getElementById("volta");
    voltaInput.value = ""; 
}

function comprarAssento() {
    if (!preencheuDataIda()) {
        showStatusMessage("Preencha corretamente a data de ida do voo", true);
        return;
    }

    var voltaRadio = document.getElementById("voltaRadio");

    if (voltaRadio.checked == true && !preencheuDataVolta()) {
        showStatusMessage("Preencha corretamente a data de ida do voo", true);
        return;
    }

    if (!preencheuPartida()) {
        showStatusMessage("Preencha corretamente a cidade de partida", true);
        return;
    }

    if (!preencheuDestino()) {
        showStatusMessage("Preencha corretamente a cidade de destino", true);
        return;
    }

    const ida = document.getElementById("ida").value;
    const volta = document.getElementById("volta").value;
    const partida = document.getElementById("partida").value;
    const destino = document.getElementById("destino").value;

    const assento = {
        ida: formatarDataParaOracle(ida),
        volta: volta ? formatarDataParaOracle(volta) : undefined,
        partida,
        destino,
    };

    console.log(volta);

    const tabelaIda = document.getElementById("tabelaIda");
    const tabelaVolta = document.getElementById("tabelaVolta");

    fetchListar(assento)
        .then(resultado => {
            if (resultado.status === "ERROR") {
                showStatusMessage(resultado.message, true);
                console.log(resultado.message);
            } else if (resultado.status === "SUCCESS") {
                if (volta === undefined || volta === "") {
                    preencherTabelaIdaBody(resultado.payload);
                    showStatusMessage("Voos encontrados.", false);
                    tabelaIda.style.display = "table";
                    tabelaVolta.style.display = "none";  
                } else {
                    preencherTabelaVoltaBody(resultado.payload);
                    showStatusMessage("Voos encontrados.", false);
                    tabelaVolta.style.display = "table";
                    tabelaIda.style.display = "none";  
                }                
            } else {
                showStatusMessage("Resultado inesperado: " + resultado, true);
                console.log("Resultado inesperado:", resultado);
            }        
        })
        .catch(error => {
            showStatusMessage("Erro técnico ao buscar voos... Contate o suporte.", true);
            console.log("Falha grave ao buscar voos:", error);
        });
}

function fetchListar(assento) {
    return fetch('http://localhost:3000/buscarVoo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(assento),
        cache: 'no-store',
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
            throw error;
        });
}

function preencherTabelaIdaBody(assento) {
    const tbody = document.getElementById("tabelaIdaBody");
    console.log('Função preencherTabelaIda() foi chamada');
    console.log(assento);
    let count = 0;

    tbody.innerHTML = '';

    if (assento) {
        assento.forEach((assento) => {
            let estilo = (count % 2 === 0) ? "linhaPar" : "linhaImpar";

            let iconeHTML = `<a href="../mapa de assentos/index.html?codigoVoo=${assento.CODIGO_VOO}" class="icon-link"><i class="engrenagem" title="ADM"><ion-icon name="logo-usd"></ion-icon></i></a>`;

            let linha = `
                <tr class="${estilo}">
                <td>${assento.CODIGO_VOO}</td>
                <td>${assento.ESCALAS}</td>
                <td>${assento.AEROPORTO_SAIDA}</td>
                <td>${assento.AEROPORTO_DESTINO}</td>
                <td>${assento.DATA_SAIDA}</td>
                <td>${assento.HORA_SAIDA}</td>
                <td>${assento.DATA_CHEGADA}</td>
                <td>${assento.HORA_CHEGADA}</td>
                <td>${assento.VALOR_PASSAGEM}</td>
                <td>${iconeHTML}</td> 
                </tr>`;
            tbody.innerHTML += linha;
            count++;
        });
    }
}

function preencherTabelaVoltaBody(assento) {
    const tbody = document.getElementById("tabelaVoltaBody");
    console.log('Função preencherTabelaVolta() foi chamada');
    console.log(assento);
    let count = 0;

    tbody.innerHTML = '';

    if (assento) {
        assento.forEach((assento) => {
            let estilo = (count % 2 === 0) ? "linhaPar" : "linhaImpar";

            let iconeHTML = `<a href="../mapa de assentos/index.html?codigoVoo=${assento.CODIGO_VOO}" class="icon-link"><i class="engrenagem" title="ADM"><ion-icon name="logo-usd"></ion-icon></i></a>`;

            let linha = `
                <tr class="${estilo}">
                <td>${assento.CODIGO_VOO}</td>
                <td>${assento.ESCALAS}</td>
                <td>${assento.AEROPORTO_SAIDA}</td>
                <td>${assento.AEROPORTO_DESTINO}</td>
                <td>${assento.DATA_SAIDA}</td>
                <td>${assento.HORA_SAIDA}</td>
                <td>${assento.DATA_CHEGADA}</td>
                <td>${assento.HORA_CHEGADA}</td>
                <td>${assento.DATA_VOLTA}</td>
                <td>${assento.HORA_VOLTA}</td>
                <td>${assento.DATA_CHEGADA2}</td>
                <td>${assento.HORA_CHEGADA2}</td>
                <td>${assento.VALOR_PASSAGEM}</td>
                <td>${iconeHTML}</td>
                </tr>`;
            tbody.innerHTML += linha;
            count++;
        });
    }
}