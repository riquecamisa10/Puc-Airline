document.addEventListener('DOMContentLoaded', function () {

  function redirecionarParaPagamento(codigoVoo, assentosSelecionados) {
    var assentosSelecionadosString = encodeURIComponent(JSON.stringify(assentosSelecionados));
    window.location.href = '../Pagamento/pagamento.html?codigoVoo=' + codigoVoo + '&assentos=' + assentosSelecionadosString;
  }

  function fetchAssentosOcupados(codigoVoo) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigoVoo }),
    };

    return fetch('http://localhost:3000/buscarAssentosOcupados', requestOptions)
      .then(response => response.json());
  }

  var urlParams = new URLSearchParams(window.location.search);
  var codigoVoo = urlParams.get('codigoVoo');

  if (!codigoVoo) {
    console.error('Nenhum código de voo fornecido!');
    return;
  }

  var assentosSelecionados = [];

  fetchAssentosOcupados(codigoVoo)
    .then(data => {
      console.log('Resposta do backend (Assentos Ocupados):', data);

      if (data.status === "SUCCESS") {
        var assentosOcupados = data.payload.assentosOcupados || [];
        return assentosOcupados;
      } else {
        console.error('Erro ao obter assentos ocupados do backend:', data.message);
        throw new Error('Erro ao obter assentos ocupados do backend.');
      }
    })
    .then(assentosOcupados => {
      // Agora, você tem a lista de assentos ocupados. Continue com a lógica para buscar o total de assentos e preencher o mapa.
      fetchTotalAssentos(codigoVoo, assentosOcupados);
    })
    .catch(error => {
      console.error('Erro ao chamar o backend para obter assentos ocupados:', error);
    });

  function fetchTotalAssentos(codigoVoo, assentosOcupados) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigoVoo }),
    };

    fetch('http://localhost:3000/buscarTotalAssentos', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('Resposta do backend (Total de Assentos):', data);

        if (data.status === "SUCCESS") {
          var totalAssentos = data.payload.totalAssentos || 500;
          preencherMapaAssentos(assentosOcupados, totalAssentos);
        } else {
          console.error('Erro ao obter total de assentos do backend:', data.message);
          throw new Error('Erro ao obter total de assentos do backend.');
        }
      })
      .catch(error => {
        console.error('Erro ao chamar o backend para obter total de assentos:', error);
      });
  }

  function preencherMapaAssentos(assentosOcupados, totalAssentos) {
    var assentosPorFileira = 40;
    var airplane = document.querySelector('.airplane-container');

    airplane.innerHTML = '';

    for (var i = 1; i <= totalAssentos; i++) {
      if (i % assentosPorFileira == 1) {
        var fileira = document.createElement('div');
        fileira.className = 'airplane';
        airplane.appendChild(fileira);
      }

      var seat = document.createElement('div');
      seat.className = 'seat';

      // Verifique se o número do assento está na lista de assentos ocupados
      if (assentosOcupados.includes(i)) {
        seat.classList.add('occupied');
      }

      seat.textContent = i;
      fileira.appendChild(seat);

      // Adiciona o evento de clique diretamente aqui
      seat.addEventListener('click', function () {
        var numeroAssento = parseInt(this.textContent, 10);
        this.classList.toggle('selected');

        // Adiciona ou remove o assento do array de assentosSelecionados
        if (assentosSelecionados.includes(numeroAssento)) {
          assentosSelecionados = assentosSelecionados.filter(function (assento) {
            return assento !== numeroAssento;
          });
        } else {
          assentosSelecionados.push(numeroAssento);
        }
      });
    }
  }

  document.getElementById('btnProximo').addEventListener('click', function () {
    var quantidadeDeAssentos = assentosSelecionados.length;

    if (quantidadeDeAssentos > 0) {
      redirecionarParaPagamento(codigoVoo, assentosSelecionados);
    } else {
      alert("Por favor, adicione pelo menos um assento antes de prosseguir para o pagamento.");
    }
  });

  var icons = document.querySelectorAll('.icone-do-voo');

  icons.forEach(function (icon) {
    icon.addEventListener('click', function () {
      var codigoVoo = icon.dataset.codigoVoo;
      var outrasInformacoes = icon.dataset.outrasInformacoes;

          // Chame diretamente a função fetchTotalAssentos para obter e preencher os assentos
          fetchTotalAssentos(codigoVoo, outrasInformacoes);
      });
  });
});