document.addEventListener('DOMContentLoaded', () => {
    const btnSalaEnsayo = document.getElementById('btn-sala-ensayo');
    const btnGrabacion = document.getElementById('btn-grabacion');

    btnSalaEnsayo.addEventListener('click', () => {
        window.location.href = 'reserva-sala.html';
    });

    btnGrabacion.addEventListener('click', () => {
        // Puedes agregar aquí la lógica para la reserva de horas de grabación
        alert('Próximamente: Reserva de horas de grabación');
    });
});
