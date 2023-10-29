function anoValido(){
    let resultado = false;
    // obter o texto preenchido no campo anoFab
    var strAno = document.getElementById("anoFab").value;
    const ano = parseInt(strAno);
    console.log("Ano aeronave: " + ano.toString());
    if (ano >= 1990 && ano <= 2026){
      resultado = true;
    }
    return resultado; 
}

// verifica se o campo total de assentos é numerico e válido
function totalAssentosValido(){
    let resultado = false;
    const strAssentos = document.getElementById("totalAssentos").value;
    const assentos = parseInt(strAssentos);
    if (assentos > 0){
    resultado = true;
    }
    return resultado; 
}

// funcao que verifica se selecionou ou não o fabricante.
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

// funcao que verifica se preencheu o modelo.
function preencheuModelo(){
    let resultado = false;
    const modeloInformado = document.getElementById("modelo").value;
    if(modeloInformado.length > 0){
        resultado = true;
    }
    return resultado;
}

// funcao para verificar se preencheu o registro de referencia. 
function preencheuRegistro(){
    let resultado = false;
    const registroReferencia = document.getElementById("referencia").value;
    if(registroReferencia.length > 0){
        resultado = true;
    }
    return resultado;
}

// funcao para exibir mensagem de status... seja qual for. 
function showStatusMessage(msg, error){
    var pStatus = document.getElementById("status");

    if (error === true){
        pStatus.className = "statusError";
    }else{
        pStatus.className = "statusSuccess";
    }
    pStatus.textContent = msg;
}

function fetchInserir(body) {
    const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
};

return fetch('http://localhost:3000/incluirAeronave', requestOptions)
.then(T => T.json())
}

function inserirAeronave(){

    if(!selecionouFabricante()){
        showStatusMessage("Selecione o fabricante", true);  
        return;
    }

    if(!preencheuModelo()){
        showStatusMessage("Preencha o modelo", true);
        return;
    }

    if(!preencheuRegistro()){
        showStatusMessage("Preencha o registro da aeronave", true);
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

    const fabricante = document.getElementById("comboFabricantes").value;
    const modelo = document.getElementById("modelo").value;
    const anoFab = document.getElementById("anoFab").value;
    const registro = document.getElementById("referencia").value;
    const totalAssentos = document.getElementById("totalAssentos").value;

    fetchInserir({
        marca: fabricante, 
        modelo: modelo,
        anoFab: anoFab,
        qtdeAssentos: totalAssentos,
        registro: registro,
    })
    .then(resultado => {
        if(resultado.status === "SUCCESS"){
        showStatusMessage("Aeronave cadastrada... ", false);
        }else{
        showStatusMessage("Erro ao cadastrar aeronave...: " + message, true);
        console.log(resultado.message);
        }
    })
    .catch(()=>{
        showStatusMessage("Erro técnico ao cadastrar... Contate o suporte.", true);
        console.log("Falha grave ao cadastrar.")
    });
}