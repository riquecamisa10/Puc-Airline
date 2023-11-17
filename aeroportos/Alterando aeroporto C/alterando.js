function codigoValido(){
    let resultado = false;
    const strCodigo = document.getElementById("codigo").value;
    const codigo = parseInt(strCodigo);
    if (codigo > 0){
    resultado = true;
    }
    return resultado; 
}

function preencheuNome(){
    let resultado = false;
    const nome = document.getElementById("nome").value;
    if (nome.length > 0){
    resultado = true;
    }
    return resultado; 
}

function selecionouSigla(){
    let resultado = false; 
    const sigla = document.getElementById("sigla").value;
    if (sigla.length > 0){
        resultado = true;
    }
    return resultado;
}

function preencheuCidade(){
    let resultado = false;
    const cidade = document.getElementById("cidade").value;
    if(cidade.length > 0){
        resultado = true;
    }
    return resultado;
}

function preencheuPais(){
    let resultado = false;
    const pais = document.getElementById("pais").value;
    if(pais.length > 0){
        resultado = true;
    }
    return resultado;
}

function showStatusMessage(msg, error){
    var pStatus = document.getElementById("status");

    pStatus.className = error ? "statusError" : "statusSuccess";
    pStatus.textContent = msg;
}

function fetchAlterar(body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    return fetch('http://localhost:3000/alterarAeroporto', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Erro durante a chamada da API:", error);
            throw error;
        });
}

window.Aeronave = function(){

    if(!codigoValido()){
        showStatusMessage("Codigo inexistente", true);
        return;
    }


    if(!preencheuNome()){
        showStatusMessage("Preencha corretamente o nome", true);
        return;
    }

    if(!selecionouSigla()){
        showStatusMessage("Preencha a sigla", true);  
        return;
    }

    if(!preencheuCidade()){
        showStatusMessage("Preencha a cidade", true);
        return;
    }

    if(!preencheuPais()){
        showStatusMessage("Preencha o país", true);
        return;
    }

    const codigo = document.getElementById("codigo").value;
    const nome = document.getElementById("nome").value;
    const sigla = document.getElementById("sigla").value;
    const cidade = document.getElementById("cidade").value;
    const pais = document.getElementById("pais").value;

    console.log(JSON.stringify({
        codigo: codigo,
        nome: nome,
        sigla: sigla,
        cidade: cidade,
        pais: pais,
    }));    

    fetchAlterar({
        codigo: codigo,
        nome: nome,
        sigla: sigla,
        cidade: cidade,
        pais: pais,
    })
    .then(resultado => {
        if (resultado.status === "SUCCESS") {
            showStatusMessage("Aeroporto alterado. ", false);
            fetchAlterar();
        } else {
            showStatusMessage(`Erro ao alterar aeroporto: ${resultado.message}`, true);
            console.log(resultado.message);
        }
    })
    .catch(error => {
        showStatusMessage(`Erro durante a chamada da API: ${error.message}`, true);
        console.error("Erro durante a chamada da API:", error);
    });    
}