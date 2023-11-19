function fetchListar() {
    return fetch('http://localhost:3000/listarAeroporto', { cache: 'no-store' })
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            preencherTabela(data.payload);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

function preencherTabela(aeroporto) {
    console.log('Função preencherTabela() foi chamada');
    console.log(aeroporto)
    const tbody = document.getElementById("tblAlunosDados");
    let count = 0;

    tbody.innerHTML = '';

    if (aeroporto) {
        aeroporto.forEach((aeroporto) => {
            let estilo = (count % 2 === 0) ? "linhaPar" : "linhaImpar";
            let linha = `
                <tr class="${estilo}">
                <td>${aeroporto.codigo}</td>
                <td>${aeroporto.nome}</td>
                <td>${aeroporto.sigla}</td>
                <td>${aeroporto.cidade}</td>
                <td>${aeroporto.pais}</td>
                </tr>`;
            tbody.innerHTML += linha;
            count++;
        });
    }
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