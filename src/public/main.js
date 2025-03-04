const form = document.querySelector('#myform');
const title = document.querySelector('#title');
const message = document.querySelector('#message');

let selectedGroupe = document.querySelector('input[name="group"]:checked').value;

const groups = document.getElementsByName('group');

for (let i = 0; i < groups.length; i++) {
    groups[i].addEventListener('change', function() {
        selectedGroupe = this.value;
    });
}

console.log(message.value)

form.addEventListener('submit', e => {
    e.preventDefault(); // cancela comportamiento por defecto (o sea no refresca la pagina)
    
    fetch('/send-message', {
        method: 'POST',
        body: JSON.stringify({
            title: title.value,     // Titulo del notificacion
            message: message.value, // Mensaje de la notificacion
            //groupe: selectedGroupe  // Grupo - Tipo de usuario
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    form.reset();
})

