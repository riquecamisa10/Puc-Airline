function selecionouFabricante() {
    let resultado = false;
    const valorSelecionado = document.getElementById("comboFabricantes").value;
    if (valorSelecionado !== "0") {
        resultado = true;
    }
    return resultado;
}

function preencheuModelo() {
    let resultado = false;
    const modeloInformado = document.getElementById("modelo").value;
    if (modeloInformado.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuRegistro() {
    let resultado = false;
    const registroReferencia = document.getElementById("referencia").value;
    if (registroReferencia.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function anoValido(){
    let resultado = false;
    const strAno = document.getElementById("anoFab").value;
    const ano = parseInt(strAno);
    console.log("Ano aeronave: " + ano.toString());
    if (!isNaN(ano) && ano >= 1990 && ano <= 2026) {
        resultado = true;
    }
    return resultado; 
}

function totalAssentosValido() {
    let resultado = false;
    const strAssentos = document.getElementById("totalAssentos").value;
    const assentos = parseInt(strAssentos);
    if (!isNaN(assentos) && assentos > 0) {
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
    
    return fetch('http://localhost:3000/incluirAeronave', requestOptions)
    .then(response => response.json())
}

function inserirAeronave() {
    if (!selecionouFabricante()) {
        showStatusMessage("Selecione o fabricante", true);  
        return;
    }

    if (!preencheuModelo()) {
        showStatusMessage("Preencha o modelo", true);
        return;
    }

    if (!preencheuRegistro()) {
        showStatusMessage("Preencha o registro da aeronave", true);
        return;
    }

    if (!anoValido()) {
        showStatusMessage("Ano deve ser entre 1990 e 2026", true);
        return;
    }

    if (!totalAssentosValido()) {
        showStatusMessage("Preencha corretamente o total de assentos", true);
        return;
    }

    const fabricante = document.getElementById("comboFabricantes").value;
    const modelo = document.getElementById("modelo").value;
    const anoFab = document.getElementById("anoFab").value;
    const registro = document.getElementById("referencia").value;
    const totalAssentos = document.getElementById("totalAssentos").value;

    fetchInserir({
        marca: fabricante,
        modelo: modelo,
        strAnoFab: anoFab,
        qtdeAssentos: totalAssentos,
        referencia: registro,
    })
    .then(resultado => {
        if (resultado.status === "SUCCESS") {
            showStatusMessage("Aeronave cadastrada...", false);
        } else {
            showStatusMessage("Erro ao cadastrar aeronave: " + resultado.message, true);
            console.log(resultado.message);
        }
    })
    .catch(() => {
        showStatusMessage("Erro técnico ao cadastrar... Contate o suporte.", true);
        console.log("Falha grave ao cadastrar.");
    });
}