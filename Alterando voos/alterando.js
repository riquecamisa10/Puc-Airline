function codigoValido(){
    let resultado = false;
    const strCodigo = document.getElementById("codigo").value;
    const codigo = parseInt(strCodigo);
    if (codigo > 0){
    resultado = true;
    }
    return resultado; 
}

function anoValido() {
    let resultado = false;
    const strAno = document.getElementById("anoFab").value; // Retrieve the value from the input field
    const anoValue = parseInt(strAno); // Parse the value to an integer
    
    console.log("Valor de strAno: " + strAno); // Use the correct variable name
    console.log("Valor de anoValue: " + anoValue); // Use the correct variable name

    if (!isNaN(anoValue) && anoValue >= 1990 && anoValue <= 2026) {
        resultado = true;
    } else {
        showStatusMessage("Ano de fabricação não informado ou fora do intervalo válido (1990-2026)", true);
    }

    return resultado;
}

function totalAssentosValido(){
    let resultado = false;
    const strAssentos = document.getElementById("totalAssentos").value;
    const assentos = parseInt(strAssentos);
    if (assentos > 0){
    resultado = true;
    }
    return resultado; 
}

function selecionouFabricante(){
    let resultado = false; 
    var listaFabricantes = document.getElementById("comboFabricantes").value;
    var valorSelecionado = listaFabricantes.value;
    // se quiséssemos obter o TEXTO selecionado. 
    // var text = listaFabricantes.options[listaFabricantes.selectedIndex].text;
    if (valorSelecionado !== "0"){
        resultado = true;
    }
    return resultado;
}

function preencheuModelo(){
    let resultado = false;
    const modeloInformado = document.getElementById("modelo").value;
    if(modeloInformado.length > 0){
        resultado = true;
    }
    return resultado;
}

function preencheuReferencia(){
    let resultado = false;
    const referenciaReferencia = document.getElementById("referencia").value;
    if(referenciaReferencia.length > 0){
        resultado = true;
    }
    return resultado;
}

function preencheuCidadeOrigem(){
    let resultado = false;
    const cidadeOrigem = document.getElementById("cidadeOrigem").value;
    if(cidadeOrigem.trim().length > 3){
        resultado = true;
    }
    return resultado;
}

function preencheuDataSaida(){
    let resultado = false;
    const dataSaida = document.getElementById("dataSaida").value;
    if(dataSaida.trim().length != 0){
        resultado = true;
    }
    return resultado;
}

function preencheuHoraSaida(){
    let resultado = false;
    const horaSaida = document.getElementById("horaSaida").value;
    if(horaSaida.trim().length != 0){
        resultado = true;
    }
    return resultado;
}

function preencheuCidadeDestino(){
    let resultado = false;
    const cidadeDestino = document.getElementById("cidadeDestino").value;
    if(cidadeDestino.trim().length > 3){
        resultado = true;
    }
    return resultado;
}

function preencheuDataChegada(){
    let resultado = false;
    const dataChegada = document.getElementById("dataChegada").value;
    if(dadaChegada.trim().length != 0){
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

function showStatusMessage(msg, error){
    var pStatus = document.getElementById("status");

    if (error === true){
        pStatus.className = "statusError";
    }else{
        pStatus.className = "statusSuccess";
    }
    pStatus.textContent = msg;
}

document.addEventListener("DOMContentLoaded", function() {

    var elemento = document.getElementById("strAnoFab");
    if (elemento) {
        var valor = elemento.value;
    
    } else {
        console.log("Elemento não encontrado");
    } 
});

function fetchAlterar(body) {
    const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
    }

    return fetch('http://localhost:3000/alterarAeronave', requestOptions)
    .then(T => T.json())
};

window.Aeronave = function(){

    if(!codigoValido()){
        showStatusMessage("Codigo inexistente", true);
        return;
    }

    if(!selecionouFabricante()){
        showStatusMessage("Selecione o fabricante", true);  
        return;
    }

    if(!preencheuModelo()){
        showStatusMessage("Preencha o modelo", true);
        return;
    }

    if(!preencheuReferencia()){
        showStatusMessage("Preencha o registro de referencia da aeronave", true);
        return;
    }

    if (!anoValido()) {
        showStatusMessage("Ano de fabricação deve estar entre 1990 e 2026", true);
        return;
    }    

    if(!totalAssentosValido()){
        showStatusMessage("Preencha corretamente o total de assentos", true);
        return;
    }

    if(!preencheuCidadeOrigem()){
        showStatusMessage("Preencha corretamente a cidade de origem do voo", true);
        return;
    }

    if(!preencheuDataSaida()){
        showStatusMessage("Preencha corretamente a data de saida do voo", true);
        return;
    }

    if(!(preencheuHoraSaida)){
        showStatusMessage("Preencha corretamente a hora de saida do voo", true);
        return;
    }

    if(!(preencheuCidadeDestino)){
        showStatusMessage("Preencha corretamente a cidade de destino do voo", true);
        return;
    }

    if(!(preencheuDataChegada)){
        showStatusMessage("Preencha corretamente a data de chegada do voo", true);
        return;
    }

    if(!(preencheuHoraChegada)){
        showStatusMessage("Preencha corretamente a hora de chegada do voo", true);
        return;
    }

    const fabricante = document.getElementById("comboFabricantes").value;
    const modelo = document.getElementById("modelo").value;
    const strAnoFab = document.getElementById("anoFab").value;
    const referencia = document.getElementById("referencia").value;
    const totalAssentos = document.getElementById("totalAssentos").value;
    const cidadeOrigem = document.getElementById("cidadeOrigem").value;
    const dataSaida = document.getElementById("dataSaida").value;
    const horaSaida = document.getElementById("horaSaida").value;
    const cidadeDestino = document.getElementById("cidadeDestino").value;
    const dataChegada = document.getElementById("dataChegada").value;
    const horaChegada = document.getElementById("horaChegada").value;

    fetchAlterar({
        codigo: codigo,
        marca: fabricante,
        modelo: modelo,
        strAnoFab: strAnoFab,
        qtdeAssentos: totalAssentos,
        referencia: referencia,
        cidadeOrigem: cidadeOrigem,
        dataSaida: dataSaida,
        horaSaida: horaSaida,
        cidadeDestino: cidadeDestino,
        dataChegada: dataChegada,
        horaChegada: horaChegada,
    })
    .then(resultado => {
        if(resultado.status === "SUCCESS"){
            showStatusMessage("Aeronave alterada. ", false);
            // Após a atualização bem-sucedida, buscar os dados atualizados
            fetchListar();
        } else {
            showStatusMessage("Erro ao alterar aeronave: " + resultado.message, true);
            console.log(resultado.message);
        }
    })
}  