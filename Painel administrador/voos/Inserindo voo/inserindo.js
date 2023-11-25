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

                    if (estiloVoo) {
                        const estiloVooLowerCase = estiloVoo.toLowerCase();

                        const dataVoltaGroup = document.querySelector(".form-group[data-volta]");
                        const dataChegada2Group = document.querySelector(".form-group[data-chegada2]");

                        if (estiloVooLowerCase === "somente ida") {
                            dataVoltaGroup.style.display = "none";
                            dataChegada2Group.style.display = "none";

                            preencher(document.getElementById('dataVolta'));
                            preencher(document.getElementById('horaVolta'));
                            preencher(document.getElementById('dataChegada2'));
                            preencher(document.getElementById('horaChegada2'));
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

function preencherComValorValido(elemento, valor) {
    if (elemento) {
        elemento.value = valor;
    }
}

function preencher(elemento) {
    if (elemento) {
        
        if (elemento.type === 'date') {
            preencherComValorValido(elemento, '1970-01-01');  
        } else if (elemento.type === 'time') {
            preencherComValorValido(elemento, '00:00');  
        }
    }
}

function preencheuTrecho() {
    let resultado = false;
    const trecho = document.getElementById("trecho").value;
    if (trecho.trim().length > 0) {
        resultado = true;
    }
    return resultado;
}

function preencheuEscalas() {
    let resultado = false;
    const escalas = document.getElementById("escalas").value;
    if (escalas.trim().length > -1) {
        resultado = true;
    }
    return resultado;
}

function preencheuValorPassagem(){
    let resultado = false;
    const valor = document.getElementById("valor").value;
    if(valor.trim().length > 0){
        resultado = true;
    }
    return resultado;
}

function preencheuDataSaida(){
    let resultado = false;
    const dataSaida = document.getElementById("dataSaida").value;
    if(dataSaida.length > 0){
        resultado = true;
    }
    return resultado;
}

function preencheuHoraSaida(){
    let resultado = false;
    const horaSaida = document.getElementById("horaSaida").value;
    if(horaSaida.length > 0){
        resultado = true;
    }
    return resultado;
}

function preencheuDataChegada(){
    let resultado = false;
    const dataChegada = document.getElementById("dataChegada").value;
    if(dataChegada.trim().length != 0){
        resultado = true;
    }
    return resultado;
}

function preencheuHoraChegada(){
    let resultado = false;
    const horaChegada = document.getElementById("horaChegada").value;
    if(horaChegada.trim().length != 0){
        resultado = true;
    }
    return resultado;
}

function preencheuDataVolta(){
    let resultado = false;
    const dataVolta = document.getElementById("dataVolta").value;
    if(dataVolta.length > 0){
        resultado = true;
    }
    return resultado;
}

function preencheuHoraVolta(){
    let resultado = false;
    const horaVolta = document.getElementById("horaVolta").value;
    if(horaVolta.length > 0){
        resultado = true;
    }
    return resultado;
}

function preencheuDataChegada2(){
    let resultado = false;
    const dataChegada2 = document.getElementById("dataChegada2").value;
    if(dataChegada2.trim().length != 0){
        resultado = true;
    }
    return resultado;
}

function preencheuHoraChegada2(){
    let resultado = false;
    const horaChegada2 = document.getElementById("horaChegada2").value;
    if(horaChegada2.trim().length != 0){
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
    
    return fetch('http://localhost:3000/incluirVoo', requestOptions)
    .then(response => response.json())
}

function inserirVoo() {

    if (!preencheuTrecho()) {
        showStatusMessage("Preencha corretamente o trecho", true);
        return;
    }

    if (!preencheuEscalas()) {
        showStatusMessage("Preencha corretamente o total de escalas", true);
        return;
    }

    if(!preencheuValorPassagem()){
        showStatusMessage("Preencha corretamente o valor da passagem", true);
        return;
    }

    if(!preencheuDataSaida()){
        showStatusMessage("Preencha corretamente a data de saida do voo", true);
        return;
    }

    if(!preencheuHoraSaida()){
        showStatusMessage("Preencha corretamente a hora de saida do voo", true);
        return;
    }

    if(!preencheuDataChegada()){
        showStatusMessage("Preencha corretamente a data de chegada do voo", true);
        return;
    }

    if(!preencheuHoraChegada()){
        showStatusMessage("Preencha corretamente a hora de chegada do voo", true);
        return;
    }

    if(!preencheuDataVolta()){
        showStatusMessage("Preencha corretamente a data de volta do voo", true);
        return;
    }

    if(!preencheuHoraVolta()){
        showStatusMessage("Preencha corretamente a hora de volta do voo", true);
        return;
    }

    if(!preencheuDataChegada2()){
        showStatusMessage("Preencha corretamente a data de chegada do voo de volta", true);
        return;
    }

    if(!preencheuHoraChegada2()){
        showStatusMessage("Preencha corretamente a hora de chegada do voo de volta", true);
        return;
    }

    const trecho = document.getElementById("trecho").value;
    const escalas = document.getElementById("escalas").value;
    const valor = document.getElementById("valor").value;
    const dataSaida = document.getElementById("dataSaida").value;
    const horaSaida = document.getElementById("horaSaida").value;
    const dataChegada = document.getElementById("dataChegada").value;
    const horaChegada = document.getElementById("horaChegada").value;
    const dataVolta = document.getElementById("dataVolta").value;
    const horaVolta = document.getElementById("horaVolta").value;
    const dataChegada2 = document.getElementById("dataChegada2").value;
    const horaChegada2 = document.getElementById("horaChegada2").value;
  
    const voo = {
      trecho,
      escalas,
      valor,
      dataSaida,
      horaSaida,
      dataChegada,
      horaChegada,
      dataVolta,
      horaVolta,
      dataChegada2,
      horaChegada2,
    };
    console.log("Voo object:", voo);

    fetchInserir(voo)
    .then(resultado => {
        if (resultado.status === "SUCCESS") {
            showStatusMessage("Voo cadastrado...", false);
        } else {
            showStatusMessage("Erro ao cadastrar Voo: " + resultado.message, true);
            console.log(resultado.message);
        }
    })
    .catch(() => {
        showStatusMessage("Erro técnico ao cadastrar... Contate o suporte.", true);
        console.log("Falha grave ao cadastrar.");
    })
};

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

document.addEventListener("DOMContentLoaded", function () {
    const trechoInput = document.getElementById('trecho');

    trechoInput.addEventListener('change', verificarTipoTrecho);
});