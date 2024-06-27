// Mostrar el mensaje emergente al cargar la página
window.onload = function() {
    var modal = document.getElementById('welcome-modal');
    var audio = document.getElementById('welcome-audio');
    var enterBtn = document.getElementById('enter-btn');
    var audioIcon = document.getElementById('audio-icon');

    modal.style.display = 'flex';
    document.body.classList.add('modal-open');

    // Reproducir el audio y mostrar el ícono de audio al hacer clic en el botón "Ingresar"
    enterBtn.onclick = function() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        audio.play();
        audioIcon.style.display = 'block';
    };

    // Alternar el estado de reproducción del audio al hacer clic en el ícono de audio
    audioIcon.onclick = function() {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    };
};

