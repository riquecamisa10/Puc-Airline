function selecionouCodigo() {
    let resultado = false;
    const codigo = document.getElementById("codigo").value;
    if (codigo !== "0") {
        resultado = true;
    }
    return resultado;
}

function preencheuNome() {
    let resultado = false;
    const nome = document.getElementById("nome").value;
    if (nome.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuSigla() {
    let resultado = false;
    const sigla = document.getElementById("sigla").value;
    if (sigla.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function cidade() {
    let resultado = false;
    const cidade = document.getElementById("cidade").value;
    if (cidade.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuPais() {
    let resultado = false;
    const pais = document.getElementById("pais").value;
    if (pais.trim().length > 0) {
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
    
    return fetch('http://localhost:3000/incluirAeroporto', requestOptions)
    .then(response => response.json())
}

function inserirAeroporto() {
    if (!selecionouCodigo()) {
        showStatusMessage("Selecione o codigo", true);  
        return;
    }

    if (!preencheuNome()) {
        showStatusMessage("Preencha o nome", true);
        return;
    }

    if (!preencheuNome()) {
        showStatusMessage("Preencha o nome do aeropoorto", true);
        return;
    }

    if (!preencheuSigla()) {
        showStatusMessage("Preencha a sigla", true);
        return;
    }

    if (!cidade()) {
        showStatusMessage("Preencha a cidade", true);
        return;
    }

    if (!preencheuPais()) {
        showStatusMessage("Preencha o país", true);
        return;
    }

    const codigo = document.getElementById("codigo").value;
    const nome = document.getElementById("nome").value;
    const sigla = document.getElementById("sigla").value;
    const cidade = document.getElementById("cidade").value;
    const pais = document.getElementById("pais").value;

    fetchInserir({
        codigo: codigo,
        nome: nome,
        sigla: sigla,
        cidade: cidade,
        pais: pais,
    })
    .then(resultado => {
        if (resultado.status === "SUCCESS") {
            showStatusMessage("Aeroporto cadastrada...", false);
        } else {
            showStatusMessage("Erro ao cadastrar Aeroporto: " + resultado.message, true);
            console.log(resultado.message);
        }
    })
    .catch(() => {
        showStatusMessage("Erro técnico ao cadastrar... Contate o suporte.", true);
        console.log("Falha grave ao cadastrar.");
    });
}