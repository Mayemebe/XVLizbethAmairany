function enviarDatos() {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario

    var nombre = document.getElementById('fname').value;
    var apellido = document.getElementById('lname').value;

    // Aquí debes usar una solicitud HTTP para enviar los datos a tu script de Google Apps Script
    // Esto puede requerir el uso de fetch o AJAX, dependiendo de tu preferencia y configuración.

    // Ejemplo de uso de fetch:
    fetch('https://script.google.com/macros/s/AKfycbw7L45daDN6kgC0YLjgzWnHF0OR-xy1nOLyZh-nUS6ZtVsROc96EqxX9lr4ti7sS_M/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: nombre, apellido: apellido }),
    })
        .then(response => {
            console.log('Datos enviados con éxito');
            // Puedes agregar aquí cualquier código adicional que quieras ejecutar después de enviar los datos
        })
        .catch(error => console.error('Error al enviar datos', error));
}
