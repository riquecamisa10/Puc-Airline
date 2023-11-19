function codigoValido(){
    let resultado = false;
    const strCodigo = document.getElementById("codigo").value;
    const codigo = parseInt(strCodigo);
    if (codigo > 0){
    resultado = true;
    }
    return resultado; 
}

function preencheuNome() {
    let resultado = false;
    const nomeInformado = document.getElementById("nome").value;
    if (nomeInformado.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuOrigem() {
    let resultado = false;
    const origemInformada = document.getElementById("origem").value;
    if (origemInformada.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuDestino() {
    let resultado = false;
    const destinoInformada = document.getElementById("destino").value;
    if (destinoInformada.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuAeronave(){
    let resultado = false;
    const aeronave = document.getElementById("aeronave").value;
    if(aeronave.trim().length > 0){
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

function fetchAlterar(body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    return fetch('http://localhost:3000/alterarTrecho', requestOptions)
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

window.Trecho = function(){

    if (!codigoValido()) {
        showStatusMessage("Preencha corretamente o codigo", true);
        return;
    }

    if (!preencheuNome()) {
        showStatusMessage("Preencha corretamente o nome", true);
        return;
    }

    if (!preencheuOrigem()) {
        showStatusMessage("Preencha corretamente a cidade de origem", true);
        return;
    }

    if(!preencheuDestino()){
        showStatusMessage("Preencha corretamente a cidade de destino", true);
        return;
    }

    if(!preencheuAeronave()){
        showStatusMessage("Preencha a aeronave", true);
        return;
    }

    const codigo = document.getElementById("codigo").value;
    const nome = document.getElementById("nome").value;
    const origem = document.getElementById("origem").value;
    const destino = document.getElementById("destino").value;
    const aeronave = document.getElementById("aeronave").value;

    fetchAlterar({
        codigo: codigo,
        nome: nome,
        origem: origem,
        destino: destino,
        aeronave: aeronave,
    })
    .then(resultado => {
        if (resultado.status === "SUCCESS") {
            showStatusMessage("Aeronave alterada. ", false);
            fetchAlterar();
        } else {
            showStatusMessage(`Erro ao alterar aeronave: ${resultado.message}`, true);
            console.log(resultado.message);
        }
    })
    .catch(error => {
        showStatusMessage(`Erro durante a chamada da API: ${error.message}`, true);
        console.error("Erro durante a chamada da API:", error);
    });    
}

var menuItems = document.querySelectorAll('.menu .list-item.parent');

menuItems.forEach(function(menuItem) {
    menuItem.addEventListener('click', function() {
        
        var allSubmenus = document.querySelectorAll('.menu .list-item .submenu');
        allSubmenus.forEach(function(submenu) {
            if (submenu !== this.querySelector('.submenu')) {
                submenu.style.display = 'none';
            }
        }, this);

        var submenu = this.querySelector('.submenu');
        if (submenu) {
            submenu.style.display = (submenu.style.display === 'block') ? 'none' : 'block';
        }
    });
});

var menu = document.querySelector('.menu');

menu.addEventListener('mouseout', function(e) {
    
    var isOverSubmenu = e.relatedTarget && (e.relatedTarget.className === 'submenu' || e.relatedTarget.className === 'sub-item');

    if (!isOverSubmenu) {
        var allSubmenus = document.querySelectorAll('.menu .list-item .submenu');
        allSubmenus.forEach(function(submenu) {
            submenu.style.display = 'none';
        });
    }
});