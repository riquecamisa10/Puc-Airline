let logId = 1; 

function log(message) {
    console.log(`Log ${logId++}: ${message}`);
}

function mostrarFormulario() {
    log("Função mostrarFormulario sendo chamada");
    var metodoPagamento = document.getElementById("metodoPagamento").value;

    document.getElementById("creditoForm").style.display = 'none';

    if (metodoPagamento == '2') {
        document.getElementById("debitoForm").style.display = 'block';
    } else if (metodoPagamento == '3') {
        document.getElementById("creditoForm").style.display = 'block';
    }
}

function limitarNumero(exampleInputNumero) {
    exampleInputNumero.value = exampleInputNumero.value.replace(/\D/g, '');

    if (exampleInputNumero.value.length > 16) {
        exampleInputNumero.value = exampleInputNumero.value.slice(0, 16);
    }
}

function showStatusMessage(msg, error) {
    log(`Função showStatusMessage sendo chamada com mensagem: ${msg} e error: ${error}`);
    var pStatus = document.getElementById("status");

    if (error === true) {
        pStatus.className = "statusError";
    } else {
        pStatus.className = "statusSuccess";
    }

    pStatus.textContent = msg;
}

function preencheuEmail() {
    let resultado = false;
    const email = document.getElementById("email").value;
    if (email.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuCartao() {
    let resultado = false;
    const numeroCartao = document.getElementById("cartao").value;
    if (numeroCartao.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuNome() {
    let resultado = false;
    const nomeCartao = document.getElementById("nome").value;
    if (nomeCartao.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuSobrenome() {
    let resultado = false;
    const sobrenomeCartao = document.getElementById("sobrenome").value;
    if (sobrenomeCartao.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuNumero() {
    let resultado = false;
    const numeroCartao = document.getElementById("numero").value;
    if (numeroCartao.trim().length > 15) {
        resultado = true;
    }
    return resultado;
}

function preencheuCVC() {
    let resultado = false;
    const numeroCVC = document.getElementById("CVC").value;
    if (numeroCVC.trim().length > 2) {
        resultado = true;
    }
    return resultado;
}

async function alocarAssento(body) {
    console.log("função alocarAssento sendo chamada");
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };

    try {
        const response = await fetch('http://localhost:3000/comprarAssentos', requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        console.log('Resposta do backend:', result);

        if (result.status === 'SUCCESS') {
            console.log("Assentos comprados com sucesso!");
            showStatusMessage("Assentos comprados com sucesso!", false);
        } else {
            console.error("Erro ao comprar assentos. Resposta do backend:", result);
            throw new Error(`Erro ao comprar assentos: ${result.message || 'Mensagem não fornecida pelo servidor.'}`);
        }
    } catch (error) {
        console.error("Erro durante a chamada da API:", error);
        throw error;
    }
}

async function comprarAssento(codigoVoo, assentosSelecionados) {
    log(`Função comprarAssento sendo chamada com códigoVoo: ${codigoVoo} e assentosSelecionados: ${JSON.stringify(assentosSelecionados)}`);
    try {
        const body = {
            assentos: assentosSelecionados.map((assento) => ({
                codigo: codigoVoo,
                assento: assento,
            })),
        };
        await alocarAssento(body);
        log("Assentos comprados com sucesso!");
        showStatusMessage("Assentos comprados com sucesso!", false);
    } catch (error) {
        log(`Erro ao comprar assentos: ${error}`);
        showStatusMessage("Erro ao comprar assentos!", true);
    }
}

async function verificar() {
    console.log("Função verificar sendo chamada");

    if (!preencheuEmail()) {
        showStatusMessage("Selecione um Email Válido", true);
        return;
    }

    if (!preencheuCartao()) {
        showStatusMessage("Selecione um Modelo de Cartão", true);
        return;
    }

    if (!preencheuNome()) {
        showStatusMessage("Preencha o Nome Corretamente", true);
        return;
    }

    if (!preencheuSobrenome()) {
        showStatusMessage("Preencha o Sobrenome Corretamente", true);
        return;
    }

    if (!preencheuNumero()) {
        showStatusMessage("Preencha o Número Corretamente", true);
        return;
    }

    if (!preencheuCVC()) {
        showStatusMessage("Preencha o CVC Corretamente", true);
        return;
    }

    console.log("Dados antes de enviar a solicitação:", {
        codigoVoo: codigoVoo,
        assentos: assentosSelecionados,
    });

    try {
        await comprarAssento(codigoVoo, assentosSelecionados);
        console.log("Assentos comprados com sucesso!");
    } catch (error) {
        console.error("Erro ao comprar assentos:", error);
        showStatusMessage("Erro ao comprar assentos!", true);
    }
}

let codigoVoo;
let assentosSelecionados;

document.addEventListener("DOMContentLoaded", async function () {
    try {
        var urlParams = new URLSearchParams(window.location.search);
        codigoVoo = urlParams.get("codigoVoo");
        assentosSelecionados = JSON.parse(urlParams.get("assentos"));

        if (!codigoVoo || !assentosSelecionados) {
            console.error("Nenhum dado de pagamento fornecido na URL.");
            return;
        }

        console.log("Dados recuperados da URL:", { codigoVoo, assentosSelecionados });

        mostrarFormulario();

        document.getElementById("btnPagar").addEventListener("click", async function () {
            console.log("codigoVoo antes de chamar verificar:", codigoVoo);
            console.log("assentosSelecionados antes de chamar verificar:", assentosSelecionados);

            await verificar();
        });
    } catch (error) {
        console.error("Erro durante a inicialização:", error);
    }
});
