function fetchObterTrecho(body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    
    return fetch('http://localhost:3000/obterTrechoListado', requestOptions)
        .then(response => response.json())
        .catch(error => {
            console.error('Erro na requisição fetchObterTrecho:', error);
            throw error;
        });
}

function verificarTipoTrecho() {
    const trecho = document.getElementById('trecho').value;

    if (trecho.trim().length > 0) {
        fetchObterTrecho({ codigo: parseInt(trecho) })
            .then((data) => {
                console.log('Resposta do servidor:', data);

                if (data.status === 'SUCCESS' && data.payload && data.payload.length > 0) {
                    const estiloVoo = data.payload[0].ESTILO_VOO;

                    const dataVoltaInput = document.getElementById("dataVolta");
                    const horaVoltaInput = document.getElementById("horaVolta");
                    const dataChegada2Input = document.getElementById("dataChegada2");
                    const horaChegada2Input = document.getElementById("horaChegada2");

                    // Limpar os campos relacionados à volta
                    preencherComValorValido(dataVoltaInput, '');
                    preencherComValorValido(horaVoltaInput, '');
                    preencherComValorValido(dataChegada2Input, '');
                    preencherComValorValido(horaChegada2Input, '');

                    const dataVoltaGroup = document.querySelector(".form-group[data-volta]");
                    const dataChegada2Group = document.querySelector(".form-group[data-chegada2]");

                    if (estiloVoo) {
                        const estiloVooLowerCase = estiloVoo.toLowerCase();

                        if (estiloVooLowerCase === "somente ida") {
                            dataVoltaGroup.style.display = "none";
                            dataChegada2Group.style.display = "none";
                        } else {
                            dataVoltaGroup.style.display = "flex";
                            dataChegada2Group.style.display = "flex";
                        }
                    } else {
                        console.error('Estilo de voo não está presente ou é nulo.');
                    }
                } else {
                    console.error('Erro ao obter informações do trecho:', data.message);
                }
            })
            .catch((error) => {
                console.error('Erro ao obter informações do trecho:', error);
            });
    }
}

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

            data.payload.forEach(voo => {
                if (voo.estiloVoo && voo.estiloVoo.toLowerCase() === "somente ida") {
                    voo.dataVolta = '';
                    voo.horaVolta = '';
                    voo.dataChegada2 = '';
                    voo.horaChegada2 = '';
                }
            });

            preencherTabela(data.payload);
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}
  
function preencherTabela(voos) {
    console.log('Função preencherTabela() foi chamada');
    console.log(voos);
    const tbody = document.getElementById("tblAlunosDados");

    if (voos) {
        tbody.innerHTML = voos.map((voo, index) => {
            let estilo = index % 2 === 0 ? "linhaPar" : "linhaImpar";

            let estiloVooLowerCase = voo.estiloVoo ? voo.estiloVoo.toLowerCase() : '';

        let dataVolta = voo.dataVolta || '';
        let horaVolta = voo.horaVolta || '';
        let dataChegada2 = voo.dataChegada2 || '';
        let horaChegada2 = voo.horaChegada2 || '';

        if (estiloVooLowerCase === "somente ida") {
            dataVolta = '';
            horaVolta = '';
            dataChegada2 = '';
            horaChegada2 = '';
        }

        return `
            <tr class="${estilo}">
            <td>${voo.codigo}</td>
            <td>${voo.trecho}</td>
            <td>${voo.escalas}</td>
            <td>${voo.valor}</td>
            <td>${voo.dataSaida}</td>
            <td>${voo.horaSaida}</td>
            <td>${voo.dataChegada}</td>
            <td>${voo.horaChegada}</td>
            <td>${dataVolta !== '' ? dataVolta : '&nbsp;'}</td>
            <td>${horaVolta !== '' ? horaVolta : '&nbsp;'}</td>
            <td>${dataChegada2 !== '' ? dataChegada2 : '&nbsp;'}</td>
            <td>${horaChegada2 !== '' ? horaChegada2 : '&nbsp;'}</td>
            </tr>`;

        }).join('');
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