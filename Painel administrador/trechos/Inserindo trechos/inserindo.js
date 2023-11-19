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

function fetchInserir(body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    
    return fetch('http://localhost:3000/incluirTrecho', requestOptions)
    .then(response => response.json())
}

function inserirTrecho() {

    if (!preencheuNome()) {
        showStatusMessage("Preencha o nome", true);
        return;
    }

    if (!preencheuOrigem()) {
        showStatusMessage("Preencha a origem", true);
        return;
    }

    if(!preencheuDestino()){
        showStatusMessage("Preencha corretamente a cidade de destino do voo", true);
        return;
    }

    if(!preencheuAeronave()){
        showStatusMessage("Preencha a aeronave", true);
        return;
    }

    const nome = document.getElementById("nome").value;
    const origem = document.getElementById("origem").value;
    const destino = document.getElementById("destino").value;
    const aeronave = document.getElementById("aeronave").value;

    fetchInserir({
        nome: nome,
        origem: origem,
        destino: destino,
        aeronave: aeronave,
    })
    .then(resultado => {
        if (resultado.status === "SUCCESS") {
            showStatusMessage("Trecho cadastrada...", false);
        } else {
            showStatusMessage("Erro ao cadastrar trecho: " + resultado.message, true);
            console.log(resultado.message);
        }
    })
    .catch(() => {
        showStatusMessage("Erro técnico ao cadastrar... Contate o suporte.", true);
        console.log("Falha grave ao cadastrar.");
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

document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.sub-item, .parent').forEach(item => {
        item.addEventListener('click', event => {
            if (!event.target.querySelector('.submenu')) {
                window.location.href = event.target.getAttribute('data-href');
            }
        });
    });
});