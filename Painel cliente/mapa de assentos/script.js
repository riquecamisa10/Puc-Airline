document.addEventListener('DOMContentLoaded', function () {

    var seats = document.querySelectorAll('.seat');

    seats.forEach(function (seat) {

        seat.addEventListener('click', function () {
            
            seat.classList.toggle('selected');
        });
    });
});

var totalAssentos = 525;

var assentosOcupados = [10, 20, 30];

var airplane = document.querySelector('.airplane-container');

airplane.innerHTML = '';

var assentosPorFileira = 40;

for (var i = 1; i <= totalAssentos; i++) {

  if (i % assentosPorFileira == 1) {
    var fileira = document.createElement('div');
    fileira.className = 'airplane';
    airplane.appendChild(fileira);
  }

  var seat = document.createElement('div');
  seat.className = 'seat';
  seat.textContent = i;

  if (assentosOcupados.includes(i)) {
    seat.className += ' occupied';
  }

  fileira.appendChild(seat);
}

// quando o cliente comprar um assento um função no backend vai fazer

//UPDATE ASSENTOS
//SET STATUS = 'INDISPONIVEL'
//WHERE NUMERO_ASSENTO = :1;