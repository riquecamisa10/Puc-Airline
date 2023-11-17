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

return fetch('http://localhost:3000/excluirVoo', requestOptions)
.then(T => T.json())
}

function excluirVoo(){

    if(!selecionouCodigo()){
        showStatusMessage("Selecione o Código do Voo", true);
        return;
    }

    const codigoVoo = document.getElementById("codigo").value;

    fetchExcluir({
        codigo: codigoVoo,
    })
    .then(resultado => {
        if(resultado.status === "SUCCESS"){
        showStatusMessage("Voo excluido", false);
        }else{
        showStatusMessage("Erro ao excluir Voo...: " + message, true);
        console.log(resultado.message);
        }
    })
    .catch(()=>{
        showStatusMessage("Erro técnico ao excluir. Contate o suporte.", true);
        console.log("Falha grave ao cadastrar.")
    });
}