function mostrarFormulario() {
    var metodoPagamento = document.getElementById("metodoPagamento").value;
    
    // Oculta todos os formulários
    document.getElementById("cartaoForm").classList.add("hidden");
    document.getElementById("pixForm").classList.add("hidden");
    document.getElementById("boletoForm").classList.add("hidden");

    // Mostra o formulário correspondente ao método de pagamento selecionado
    if (metodoPagamento === "3") {
        document.getElementById("cartaoForm").classList.remove("hidden");
    } else if (metodoPagamento === "2") {
        document.getElementById("pixForm").classList.remove("hidden");
    } else if (metodoPagamento === "4") {
        document.getElementById("boletoForm").classList.remove("hidden");
    }
}

function limitarNumero(exampleInputNumero) {
    // Remova caracteres não numéricos
    exampleInputNumero.value = exampleInputNumero.value.replace(/\D/g, '');
    
    // Limite o comprimento a 16 dígitos
    if (exampleInputNumero.value.length > 16) {
        exampleInputNumero.value = exampleInputNumero.value.slice(0, 16);
    }
}