function selecionouFabricante() {
    let resultado = false;
    const valorSelecionado = document.getElementById("comboFabricantes").value;
    if (valorSelecionado !== "0") {
        resultado = true;
    }
    return resultado;
}

function preencheuModelo() {
    let resultado = false;
    const modeloInformado = document.getElementById("modelo").value;
    if (modeloInformado.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuRegistro() {
    let resultado = false;
    const registroReferencia = document.getElementById("referencia").value;
    if (registroReferencia.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function anoValido(){
    let resultado = false;
    const strAno = document.getElementById("anoFab").value;
    const ano = parseInt(strAno);
    console.log("Ano aeronave: " + ano.toString());
    if (!isNaN(ano) && ano >= 1990 && ano <= 2026) {
        resultado = true;
    }
    return resultado; 
}

function totalAssentosValido() {
    let resultado = false;
    const strAssentos = document.getElementById("totalAssentos").value;
    const assentos = parseInt(strAssentos);
    if (!isNaN(assentos) && assentos > 100 && assentos <= 525) {
        resultado = true;
    }
    return resultado;
}

function showStatusMessage(message, isError) {
    const statusElement = document.getElementById('status');

    statusElement.textContent = message;

    if (isError) {
        statusElement.classList.add('statusError');
        statusElement.classList.remove('statusSuccess'); 
    } else {
        statusElement.classList.add('statusSuccess');
        statusElement.classList.remove('statusError'); 
    }

    statusElement.style.display = 'block';

    setTimeout(() => {
        hideStatusMessage();
    }, 3000);
}

function hideStatusMessage() {
    const statusElement = document.getElementById('status');
    statusElement.style.display = 'none';
}

function fetchInserir(body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    
    return fetch('http://localhost:3000/incluirAeronave', requestOptions)
    .then(response => response.json())
}

function inserirAeronave() {
    if (!selecionouFabricante()) {
        showStatusMessage("Selecione o fabricante", true);  
        return;
    }

    if (!preencheuModelo()) {
        showStatusMessage("Preencha o modelo", true);
        return;
    }

    if (!preencheuRegistro()) {
        showStatusMessage("Preencha o registro da aeronave", true);
        return;
    }

    if (!anoValido()) {
        showStatusMessage("Ano deve ser entre 1990 e 2026", true);
        return;
    }

    if (!totalAssentosValido()) {
        showStatusMessage("O número de assentos deve ser entre 100 e 525", true);
        return;
    }

    const fabricante = document.getElementById("comboFabricantes").value;
    const modelo = document.getElementById("modelo").value;
    const anoFab = document.getElementById("anoFab").value;
    const registro = document.getElementById("referencia").value;
    const totalAssentos = document.getElementById("totalAssentos").value;

    fetchInserir({
        marca: fabricante,
        modelo: modelo,
        strAnoFab: anoFab,
        qtdeAssentos: totalAssentos,
        referencia: registro,
    })
    .then(resultado => {
        if (resultado.status === "SUCCESS") {
            showStatusMessage("Aeronave cadastrada...", false);
        } else {
            showStatusMessage("Erro ao cadastrar aeronave: " + resultado.message, true);
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