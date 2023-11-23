document.addEventListener('DOMContentLoaded', function () {
    // Obtém todos os elementos com a classe 'seat'
    var seats = document.querySelectorAll('.seat');

    // Adiciona um ouvinte de evento de clique a cada assento
    seats.forEach(function (seat) {
        seat.addEventListener('click', function () {
            // Alternar a classe 'selected' ao clicar em um assento
            seat.classList.toggle('selected');
        });
    });
});