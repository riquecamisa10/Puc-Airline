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

function preencheuCidade() {
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

    if (!preencheuCidade()) {
        showStatusMessage("Preencha a cidade", true);
        return;
    }

    if (!preencheuPais()) {
        showStatusMessage("Preencha o país", true);
        return;
    }

    const nome = document.getElementById("nome").value;
    const sigla = document.getElementById("sigla").value;
    const cidade = document.getElementById("cidade").value;
    const pais = document.getElementById("pais").value;

    fetchInserir({
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