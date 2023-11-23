document.addEventListener("DOMContentLoaded", function () {
    
    const btnCarregarDados = document.getElementById("btnCarregarDados");
    btnCarregarDados.addEventListener("click", fetchListar);

    console.log('exibindo.js foi carregado');
});

function fetchListar() {
    return fetch('http://localhost:3000/listarVoo', { cache: 'no-store' })
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            preencherTabela(data.payload);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}

function preencherTabela(voos) {
    console.log('Função preencherTabela() foi chamada');
    console.log(voos)
    const tbody = document.getElementById("tblAlunosDados");
    let count = 0;

    tbody.innerHTML = '';

    if (voos) {
        voos.forEach((voo) => {
            let estilo = (count % 2 === 0) ? "linhaPar" : "linhaImpar";
            let linha = `
                <tr class="${estilo}">
                <td>${voo.codigo}</td>
                <td>${voo.aeronave}</td>
                <td>${voo.aeroportoPartida}</td>
                <td>${voo.aeroportoDestino}</td>
                <td>${voo.escalas}</td>
                <td>${voo.valor}</td>
                <td>${voo.dataSaida}</td>
                <td>${voo.horaSaida}</td>
                <td>${voo.dataChegada}</td>
                <td>${voo.horaChegada}</td>
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