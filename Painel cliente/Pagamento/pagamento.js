function mostrarFormulario() {
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
    var pStatus = document.getElementById("status");
  
    if (error === true) {
      pStatus.className = "statusError";
    } else {
      pStatus.className = "statusSuccess";
    }
  
    pStatus.textContent = msg;
  
    // Adicione logs para verificar se a função está sendo chamada e com os parâmetros corretos
    console.log("Função showStatusMessage chamada com mensagem:", msg, "e error:", error);
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
  
  function alocarAssento(body) {
    console.log("função alocarAssento sendo chamada")
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
  
    return fetch('http://localhost:3000/comprarAssentos', requestOptions)
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
  
  function comprarAssento(codigoVoo, assentosSelecionados) {
    // Crie o corpo da requisição
    const body = {
      assentos: assentosSelecionados.map((assento) => ({
        codigo: codigoVoo,
        assento: assento
      }))
    };
  
    // Chame a função alocarAssento para marcar os assentos como indisponíveis
    return alocarAssento(body);
  }
  
  function verificar() {
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
  
    // Obtendo os Assentos Selecionados
    var urlParams = new URLSearchParams(window.location.search);
    var codigoVoo = urlParams.get('codigoVoo');
    var assentosSelecionados = JSON.parse(urlParams.get('assentos'));
  
    // Chame a função comprarAssento para realizar a compra
    comprarAssento(codigoVoo, assentosSelecionados)
      .then(() => {
        console.log("Assentos comprados com sucesso!");
        // Adicione logs para verificar se a função showStatusMessage é chamada e com os parâmetros corretos
        showStatusMessage("Assentos comprados com sucesso!", false);
      })
      .catch((error) => {
        console.error("Erro ao comprar assentos:", error);
      });
}

// Obtendo os Assentos Selecionados

document.addEventListener('DOMContentLoaded', function () {
    var urlParams = new URLSearchParams(window.location.search);
    var assentosSelecionados = JSON.parse(urlParams.get('assentos'));
    
    document.getElementById('btnPagar').addEventListener('click', verificar);
    console.log(assentosSelecionados);
});