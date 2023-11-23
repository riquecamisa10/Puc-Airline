function mostrarFormulario(){

    var metodoPagamento = document.getElementById("metodoPagamento").value;
    
    document.getElementById("cartaoForm").style.display = 'none';
    document.getElementById("pixForm").style.display = 'none';
    document.getElementById("boletoForm").style.display = 'none';

    if(metodoPagamento == '2'){
        document.getElementById("pixForm").style.display = 'block';
    }else if(metodoPagamento == '3'){
        document.getElementById("cartaoForm").style.display = 'block';
    }else if(metodoPagamento == '4'){
        document.getElementById("boletoForm").style.display = 'block';
    }
}

function limitarNumero(exampleInputNumero){

    exampleInputNumero.value = exampleInputNumero.value.replace(/\D/g, '');
    
    if(exampleInputNumero.value.length > 16){
        exampleInputNumero.value = exampleInputNumero.value.slice(0, 16);
    }
}

function showStatusMessage(msg, error){

    var pStatus = document.getElementById("status");

    if(error === true){
        pStatus.className = "statusError";
    }else{
        pStatus.className = "statusSuccess";
    }
    pStatus.textContent = msg;
}

function preencheuEmail(){
    let resultado = false;
    const email = document.getElementById("email").value;
    if(email.trim().length > 0){
        resultado = true;
    }
    return resultado;
}

function preencheuCartao(){
    let resultado = false;
    const numeroCartao = document.getElementById("cartao").value;
    if(numeroCartao.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuNome(){
    let resultado = false;
    const nomeCartao = document.getElementById("nome").value;
    if(nomeCartao.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuSobrenome(){
    let resultado = false;
    const sobrenomeCartao = document.getElementById("sobrenome").value;
    if(sobrenomeCartao.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuNumero(){
    let resultado = false;
    const numeroCartao = document.getElementById("numero").value;
    if(numeroCartao.trim().length > 15) {
        resultado = true;
    }
    return resultado;
}

function preencheuCVC(){
    let resultado = false;
    const numeroCVC = document.getElementById("CVC").value;
    if(numeroCVC.trim().length > 2) {
        resultado = true;
    }
    return resultado;
}

function alocarAssento(body){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    return fetch('https://localhost:3000/alocarAssento')
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

function verificar(){

    if(!preencheuEmail()){
        showStatusMessage("Selecione um Email Válido", true);
        return;
    }

    if(!preencheuCartao()){
        showStatusMessage("Selecione um Modelo de Cartão", true);
        return;
    }

    if(!preencheuNome()){
        showStatusMessage("Preencha o Nome Corretamente", true);
        return;
    }

    if(!preencheuSobrenome()){
        showStatusMessage("Preencha o Sobrenome Corretamente", true);
        return;
    }

    if(!preencheuNumero()){
        showStatusMessage("Preencha o Número Corretamente", true);
        return;
    }

    if(!preencheuCVC()){
        showStatusMessage("Preencha o CVC Corretamente", true);
        return;
    }

    const resultado = { status: "SUCCESS" };

    Promise.resolve(resultado)

    .then((resultado) => {
        if(resultado.status === "SUCCESS") {
            showStatusMessage("Pagamento Concluido com Sucesso", false);
            alocarAssento();
        } else {
            showStatusMessage("Erro ao realizar pagamento: " + resultado.message, true);
            console.log(resultado.message);
        }
    })
    .catch(() => {
        showStatusMessage("Erro técnico ao realizar o pagamento... Contate o suporte.", true);
        console.log("Falha grave ao realizar o pagamento.");
    });
}