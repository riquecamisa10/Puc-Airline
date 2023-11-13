function mostrarFormulario() {
    var metodoPagamento = document.getElementById("metodoPagamento").value;
    
    // Oculta todos os formulários
    document.getElementById("cartaoForm").style.display = 'none';
    document.getElementById("pixForm").style.display = 'none';
    document.getElementById("boletoForm").style.display = 'none';

    // Mostra o formulário correspondente
    if (metodoPagamento == '2') {
        document.getElementById("pixForm").style.display = 'block';
    } else if (metodoPagamento == '3') {
        document.getElementById("cartaoForm").style.display = 'block';
    } else if (metodoPagamento == '4') {
        document.getElementById("boletoForm").style.display = 'block';
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