function selecionouCodigo(){
    let resultado = false;
    const strCodigo = document.getElementById("codigo").value;
    const codigo = parseInt(strCodigo);
    if (codigo > 0){
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

function fetchExcluir(body) {
    const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
};

return fetch('http://localhost:3000/excluirAeronave', requestOptions)
.then(T => T.json())
}

function excluirAeronave(){

    if(!selecionouCodigo()){
        showStatusMessage("Selecione o Código da Aeronave", true);
        return;
    }

    const codigoAeronave = document.getElementById("codigo").value;

    fetchExcluir({
        codigo: codigoAeronave,
    })
    .then(resultado => {
        if(resultado.status === "SUCCESS"){
        showStatusMessage("Aeronave excluida", false);
        }else{
        showStatusMessage("Erro ao excluir aeronave...: " + message, true);
        console.log(resultado.message);
        }
    })
    .catch(()=>{
        showStatusMessage("Erro técnico ao excluir. Contate o suporte.", true);
        console.log("Falha grave ao cadastrar.")
    });
}