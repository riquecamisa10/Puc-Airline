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
    var strAno = document.getElementById("anoFab");
    //const strAno = parseInt(strstrAno);
    
    console.log("Valor de strstrAno: " + strAno);
    console.log("Valor de strAno: " + strAno);

    if (!isNaN(strAno) && strAno >= 1990 && strAno <= 2026) {
        resultado = true;
    } else {
        showStatusMessage("strAno de fabricação não informado", true);
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

    if(!strAnoValido()){
        showStatusMessage("strAno deve de 1990 até 2026", true);
        return;
    }

    if(!totalAssentosValido()){
        showStatusMessage("Preencha corretamente o total de assentos", true);
        return;
    }

    const codigo = document.getElementById("codigo").value;
    const fabricante = document.getElementById("comboFabricantes").value;
    const modelo = document.getElementById("modelo").value;
    const strAnoFab = document.getElementById("strAnoFab").value;
    const referencia = document.getElementById("referencia").value;
    const totalAssentos = document.getElementById("totalAssentos").value;

    // Aqui você deve validar os valores dos campos antes de fazer a requisição
    // Certifique-se de que todos os campos estão corretamente preenchidos

    // Em seguida, faça a requisição para alterar a aeronave
    fetchAlterar({
        codigo: codigo,
        marca: fabricante,
        modelo: modelo,
        strAnoFab: strAnoFab,
        qtdeAssentos: totalAssentos,
        referencia: referencia,
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