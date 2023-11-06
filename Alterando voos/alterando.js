function codigoValido(){
    let resultado = false;
    const strCodigo = document.getElementById("codigo").value;
    const codigo = parseInt(strCodigo);
    if (codigo > 0){
    resultado = true;
    }
    return resultado; 
}

function anoValido(){
    let resultado = false;
    var strAno = document.getElementById("anoFab").value;
    const ano = parseInt(strAno);
    console.log("Ano aeronave: " + ano.toString());
    if (ano >= 1990 && ano <= 2026){
      resultado = true;
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
    var listaFabricantes = document.getElementById("comboFabricantes");
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

function showStatusMessage(msg, error){
    var pStatus = document.getElementById("status");

    if (error === true){
        pStatus.className = "statusError";
    }else{
        pStatus.className = "statusSuccess";
    }
    pStatus.textContent = msg;
}


function fetchAlterar(body) {
    const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
};

return fetch('http://localhost:3000/alterarAeronave', requestOptions)
.then(T => T.json())
}

function alterarAeronave(){

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

    if(!anoValido()){
        showStatusMessage("Ano deve de 1990 até 2026", true);
        return;
    }

    if(!totalAssentosValido()){
        showStatusMessage("Preencha corretamente o total de assentos", true);
        return;
    }

    const codigo = document.getElementById("codigo").value;
    const fabricante = document.getElementById("comboFabricantes").value;
    const modelo = document.getElementById("modelo").value;
    const anoFab = document.getElementById("anoFab").value;
    const referencia = document.getElementById("referencia").value;
    const totalAssentos = document.getElementById("totalAssentos").value;

    fetchAlterar({
        codigo: codigo,
        marca: fabricante, 
        modelo: modelo, 
        anoFab: anoFab,
        qtdeAssentos: totalAssentos,
        referencia: referencia,
    })
    .then(resultado => {
        if(resultado.status === "SUCCESS"){
            showStatusMessage("Aeronave alterada. ", false);
        } else {
            showStatusMessage("Erro ao alterar aeronave: " + resultado.message, true);
            console.log(resultado.message);
        }
    })
    .catch(() => {
        showStatusMessage("Erro técnico ao alterar... Contate o suporte.", true);
        console.log("Falha grave ao alterar.")
    });
}