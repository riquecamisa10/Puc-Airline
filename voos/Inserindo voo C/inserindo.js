function selecionouCodigo() {
    let resultado = false;
    const codigo = document.getElementById("codigo").value;
    if (codigo !== "0") {
        resultado = true;
    }
    return resultado;
}

function preencheuAeronave() {
    let resultado = false;
    const aeronave = document.getElementById("aeronave").value;
    if (aeronave.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuAeroportoPartida() {
    let resultado = false;
    const aeroportoPartida = document.getElementById("aeroportoPartida").value;
    if (aeroportoPartida.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuAeroportoDestino() {
    let resultado = false;
    const aeroportoDestino = document.getElementById("aeroportoDestino").value;
    if (aeroportoDestino.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuEscalas() {
    let resultado = false;
    const escalas = document.getElementById("escalas").value;
    if (escalas.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuValorPassagem(){
    let resultado = false;
    const valor = document.getElementById("valor").value;
    if(valor.trim().length > 0){
        resultado = true;
    }
    return resultado;
}

function preencheuDataSaida(){
    let resultado = false;
    const dataSaida = document.getElementById("dataSaida").value;
    if(dataSaida.length > 0){
        resultado = true;
    }
    return resultado;
}

function preencheuHoraSaida(){
    let resultado = false;
    const horaSaida = document.getElementById("horaSaida").value;
    if(horaSaida.length > 0){
        resultado = true;
    }
    return resultado;
}

function preencheuDataChegada(){
    let resultado = false;
    const dataChegada = document.getElementById("dataChegada").value;
    if(dataChegada.trim().length != 0){
        resultado = true;
    }
    return resultado;
}

function preencheuHoraChegada(){
    let resultado = false;
    const horaChegada = document.getElementById("horaChegada").value;
    if(horaChegada.trim().length != 0){
        resultado = true;
    }
    return resultado;
}

function showStatusMessage(msg, error) {
    var pStatus = document.getElementById("status");
    
    if (error === true) {
        pStatus.className = "statusError";
    } else {
        pStatus.className = "statusSuccess";
    }
    pStatus.textContent = msg;
}

function fetchInserir(body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    
    return fetch('http://localhost:3000/incluirVoo', requestOptions)
    .then(response => response.json())
}

function inserirVoo() {

    if (!selecionouCodigo()) {
        showStatusMessage("Selecione o codigo", true);  
        return;
    }

    if (!preencheuAeronave()) {
        showStatusMessage("Preencha a aeronave", true);
        return;
    }

    if (!preencheuAeroportoPartida()) {
        showStatusMessage("Preencha o aeroporto de partida", true);
        return;
    }

    if (!preencheuAeroportoDestino()) {
        showStatusMessage("Preencha o aeroporto de destino", true);
        return;
    }

    if (!escalas()) {
        showStatusMessage("Preencha corretamente o total de escalas", true);
        return;
    }

    if(!preencheuValorPassagem()){
        showStatusMessage("Preencha corretamente o valor da passagem", true);
        return;
    }

    if(!preencheuDataSaida()){
        showStatusMessage("Preencha corretamente a data de saida do voo", true);
        return;
    }

    if(!preencheuHoraSaida()){
        showStatusMessage("Preencha corretamente a hora de saida do voo", true);
        return;
    }

    if(!preencheuDataChegada()){
        showStatusMessage("Preencha corretamente a data de chegada do voo", true);
        return;
    }

    if(!preencheuHoraChegada()){
        showStatusMessage("Preencha corretamente a hora de chegada do voo", true);
        return;
    }

    const codigo = document.getElementById("codigo").value;
    const aeronave = document.getElementById("aeronave").value;
    const aeroportoPartida = document.getElementById("aeroportoPartida").value;
    const aeroportoDestino = document.getElementById("aeroportoDestino").value;
    const escalas = document.getElementById("escalas").value;
    const valor = document.getElementById("valor").value;
    const dataSaida = document.getElementById("dataSaida").value;
    const horaSaida = document.getElementById("horaSaida").value;
    const dataChegada = document.getElementById("dataChegada").value;
    const horaChegada = document.getElementById("horaChegada").value;

    fetchInserir({
        codigo: codigo,
        aeronave: aeronave,
        aeroportoPartida: aeroportoPartida,
        aeroportoDestino: aeroportoDestino,
        escalas: escalas,
        valor: valor,
        dataSaida: dataSaida,
        horaSaida: horaSaida,
        dataChegada: dataChegada,
        horaChegada: horaChegada,
    })
    .then(resultado => {
        if (resultado.status === "SUCCESS") {
            showStatusMessage("Voo cadastrado...", false);
        } else {
            showStatusMessage("Erro ao cadastrar Voo: " + resultado.message, true);
            console.log(resultado.message);
        }
    })
    .catch(() => {
        showStatusMessage("Erro técnico ao cadastrar... Contate o suporte.", true);
        console.log("Falha grave ao cadastrar.");
    });
}