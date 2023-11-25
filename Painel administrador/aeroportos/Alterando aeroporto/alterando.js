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

window.Aeroporto = function(){

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