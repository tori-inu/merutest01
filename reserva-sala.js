document.addEventListener('DOMContentLoaded', () => {
    const calendario = document.getElementById('calendario');
    const horasDisponibles = document.getElementById('horas-disponibles');
    const formularioReserva = document.getElementById('formulario-reserva');
    const listaReservas = document.getElementById('lista-reservas');
    const horasSeleccionadas = document.getElementById('horas-seleccionadas');
    const costoTotal = document.getElementById('costo-total');

    let fechaSeleccionada = null;
    let horasSeleccionadasArray = [];

    // Simulación de base de datos de reservas
    const reservas = {
        '2023-05-15': [
            { hora: '10:00', banda: 'Los Rockeros', integrantes: 4, platillos: true },
            { hora: '14:00', banda: 'Jazz Fusion', integrantes: 5, platillos: false },
            { hora: '18:00', banda: 'Pop Stars', integrantes: 3, platillos: true },
        ],
        '2023-05-16': [
            { hora: '11:00', banda: 'Metal Thunder', integrantes: 5, platillos: true },
            { hora: '15:00', banda: 'Indie Vibes', integrantes: 4, platillos: false },
            { hora: '19:00', banda: 'Funk Masters', integrantes: 6, platillos: true },
        ],
    };

    const preciosInstrumentos = {
        'bateria': 15000,
        'ampli-guitarra': 8000,
        'ampli-bajo': 8000,
        'teclado': 10000,
        'microfono': 5000
    };

    let player;
    let isMusicPlaying = false;

    function generarCalendario() {
        const hoy = new Date();
        const mesActual = hoy.getMonth();
        const anioActual = hoy.getFullYear();

        const primerDiaMes = new Date(anioActual, mesActual, 1);
        const ultimoDiaMes = new Date(anioActual, mesActual + 1, 0);

        const headerCalendario = document.createElement('div');
        headerCalendario.className = 'calendario-header';
        headerCalendario.innerHTML = `
            <button id="mes-anterior">&lt;</button>
            <h3>${primerDiaMes.toLocaleString('default', { month: 'long' })} ${anioActual}</h3>
            <button id="mes-siguiente">&gt;</button>
        `;
        calendario.appendChild(headerCalendario);

        const gridCalendario = document.createElement('div');
        gridCalendario.className = 'calendario-grid';

        // Agregar días de la semana
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        diasSemana.forEach(dia => {
            const diaElement = document.createElement('div');
            diaElement.textContent = dia;
            diaElement.className = 'dia-semana';
            gridCalendario.appendChild(diaElement);
        });

        // Agregar días del mes
        for (let i = 1; i <= ultimoDiaMes.getDate(); i++) {
            const dia = document.createElement('div');
            dia.textContent = i;
            dia.className = 'dia';
            
            const fecha = new Date(anioActual, mesActual, i);
            if (fecha < hoy) {
                dia.classList.add('pasado');
            } else {
                dia.addEventListener('click', () => seleccionarFecha(fecha));
            }

            gridCalendario.appendChild(dia);
        }

        calendario.appendChild(gridCalendario);
    }

    function seleccionarFecha(fecha) {
        fechaSeleccionada = fecha;
        actualizarCalendario();
        mostrarHorasDisponibles();
        actualizarListaReservas();
    }

    function actualizarCalendario() {
        const dias = document.querySelectorAll('.dia');
        dias.forEach(dia => {
            dia.classList.remove('seleccionado');
            if (fechaSeleccionada && parseInt(dia.textContent) === fechaSeleccionada.getDate()) {
                dia.classList.add('seleccionado');
            }
        });
    }

    function mostrarHorasDisponibles() {
        horasDisponibles.innerHTML = '';
        const horas = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

        const fechaFormateada = formatearFecha(fechaSeleccionada);
        const reservasDia = reservas[fechaFormateada] || [];

        horas.forEach(hora => {
            const horaElement = document.createElement('div');
            horaElement.textContent = hora;
            horaElement.className = 'hora';
            
            const reservaExistente = reservasDia.find(r => r.hora === hora);
            if (reservaExistente) {
                horaElement.classList.add('ocupada');
                horaElement.title = `Reservada por ${reservaExistente.banda}`;
            } else {
                horaElement.addEventListener('click', () => toggleHoraSeleccionada(hora));
            }
            
            horasDisponibles.appendChild(horaElement);
        });
    }

    function toggleHoraSeleccionada(hora) {
        const index = horasSeleccionadasArray.indexOf(hora);
        if (index === -1) {
            horasSeleccionadasArray.push(hora);
        } else {
            horasSeleccionadasArray.splice(index, 1);
        }
        actualizarHoras();
        actualizarResumenReserva();
    }

    function actualizarHoras() {
        const horas = document.querySelectorAll('.hora');
        horas.forEach(hora => {
            hora.classList.remove('seleccionada');
            if (horasSeleccionadasArray.includes(hora.textContent)) {
                hora.classList.add('seleccionada');
            }
        });
    }

    function actualizarResumenReserva() {
        horasSeleccionadas.textContent = horasSeleccionadasArray.join(', ');
        const costo = calcularCosto();
        costoTotal.textContent = `$${costo.toLocaleString()}`;
    }

    function calcularCosto() {
        const numHoras = horasSeleccionadasArray.length;
        let costo = 0;

        if (numHoras === 1) {
            costo = 8000;
        } else if (numHoras >= 2) {
            costo = 12000 * Math.floor(numHoras / 2) + 8000 * (numHoras % 2);
        }

        const arriendoCables = document.getElementById('arriendo-cables').checked;
        if (arriendoCables) {
            costo += 3000;
        }

        const arriendoPlatillos = document.getElementById('arriendo-platillos').checked;
        if (arriendoPlatillos) {
            costo += 10000;
        }

        return costo;
    }

    function actualizarListaReservas() {
        listaReservas.innerHTML = '';
        const fechaFormateada = formatearFecha(fechaSeleccionada);
        const reservasDia = reservas[fechaFormateada] || [];

        reservasDia.forEach(reserva => {
            const li = document.createElement('li');
            li.textContent = `${reserva.hora} - ${reserva.banda} (${reserva.integrantes} integrantes)${reserva.cables ? ' - Con cables' : ''}${reserva.platillos ? ' - Con platillos' : ''}`;
            listaReservas.appendChild(li);
        });
    }

    formularioReserva.addEventListener('submit', (e) => {
        e.preventDefault();
        if (fechaSeleccionada && horasSeleccionadasArray.length > 0) {
            const nombreBanda = document.getElementById('nombre-banda').value;
            const numIntegrantes = parseInt(document.getElementById('num-integrantes').value);
            const arriendoCables = document.getElementById('arriendo-cables').checked;
            const arriendoPlatillos = document.getElementById('arriendo-platillos').checked;

            const fechaFormateada = formatearFecha(fechaSeleccionada);
            
            if (!reservas[fechaFormateada]) {
                reservas[fechaFormateada] = [];
            }
            
            let todasHorasDisponibles = true;
            horasSeleccionadasArray.forEach(hora => {
                const reservaExistente = reservas[fechaFormateada].find(r => r.hora === hora);
                if (reservaExistente) {
                    todasHorasDisponibles = false;
                }
            });

            if (todasHorasDisponibles) {
                horasSeleccionadasArray.forEach(hora => {
                    reservas[fechaFormateada].push({
                        hora: hora,
                        banda: nombreBanda,
                        integrantes: numIntegrantes,
                        cables: arriendoCables,
                        platillos: arriendoPlatillos
                    });
                });
                alert(`Reserva confirmada para ${nombreBanda} el ${fechaSeleccionada.toLocaleDateString()} a las ${horasSeleccionadasArray.join(', ')}`);
                mostrarHorasDisponibles();
                actualizarListaReservas();
                formularioReserva.reset();
                horasSeleccionadasArray = [];
                actualizarResumenReserva();

                // Mostrar el GIF de confirmación
                const confirmationGif = document.getElementById('confirmation-gif');
                confirmationGif.classList.remove('hidden');
                
                // Ocultar el GIF después de 5 segundos
                setTimeout(() => {
                    confirmationGif.classList.add('hidden');
                }, 5000);
            } else {
                alert('Una o más horas seleccionadas ya no están disponibles. Por favor, selecciona otras horas.');
            }
        } else {
            alert('Por favor, selecciona una fecha y al menos una hora antes de reservar.');
        }
    });

    function formatearFecha(fecha) {
        return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
    }

    function toggleMusic() {
        const toggleMusicButton = document.getElementById('toggle-music');
        const musicText = toggleMusicButton.querySelector('.music-text');
        if (isMusicPlaying) {
            player.pauseVideo();
            toggleMusicButton.innerHTML = '<i class="fas fa-music"></i><span class="music-text">Click aki</span>';
            toggleMusicButton.classList.add('muted');
        } else {
            player.playVideo();
            toggleMusicButton.innerHTML = '<i class="fas fa-volume-up"></i><span class="music-text">Silenciar</span>';
            toggleMusicButton.classList.remove('muted');
        }
        isMusicPlaying = !isMusicPlaying;
    }

    function onYouTubeIframeAPIReady() {
        player = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            videoId: 'xy_NKN75Jhw',
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'disablekb': 1,
                'fs': 0,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    }

    function onPlayerReady(event) {
        const toggleMusicButton = document.getElementById('toggle-music');
        toggleMusicButton.addEventListener('click', toggleMusic);
        // Asegúrate de que el botón muestre el texto correcto al inicio
        toggleMusicButton.innerHTML = '<i class="fas fa-music"></i><span class="music-text">Click aki</span>';
    }

    onYouTubeIframeAPIReady();

    generarCalendario();

    // Función para manejar la interacción con los monstruos
    function setupMonsters() {
        const monsters = document.querySelectorAll('.monster');
        monsters.forEach(monster => {
            monster.addEventListener('click', () => {
                monster.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    monster.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }

    setupMonsters();

    // Función para hacer flotar el GIF
    function floatGif() {
        const gif = document.getElementById('floating-gif');
        const maxX = window.innerWidth - gif.offsetWidth;
        const maxY = window.innerHeight - gif.offsetHeight;

        function moveGif() {
            const newX = Math.random() * maxX;
            const newY = Math.random() * maxY;
            gif.style.left = `${newX}px`;
            gif.style.top = `${newY}px`;
        }

        moveGif(); // Mover el GIF inmediatamente
        setInterval(moveGif, 3000); // Mover el GIF cada 3 segundos
    }

    floatGif();
});
