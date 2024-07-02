
const form = document.querySelector('#myform');
const title = document.querySelector('#title');
const message = document.querySelector('#message');
console.log(message.value)



form.addEventListener('submit', e => {
    e.preventDefault(); // cancela comportamiento por defecto (o sea no refresca la pagina)
    // manda peticion
    fetch('/send-message', {
        method: 'POST',
        body: JSON.stringify({
            title: title.value,
            message: message.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    form.reset();
})

