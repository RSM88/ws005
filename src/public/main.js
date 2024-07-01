


//const form = document.querySelector('#bnt_001');


/*
form.addEventListener('submit', e => {
    //e.preventDefault(); // cancela comportamiento por defecto (o sea no refresca la pagina)

    alert("Hello! I am an alert box!!");


    
    // manda peticion
    fetch('/test001', {
        method: 'POST',
        //body: JSON.stringify({
            //message: message.value
        //}),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    form.reset();
    

})
*/

/*
const button = document.querySelector("#bnt_001");
const message01 = document.querySelector('#message');
console.log(message01.value)*/

/*
function action() {

    //const message01 = "test prueba 001";

    fetch('/send-message', {
        method: 'POST',
        body: JSON.stringify({
            message: message.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
*/

const form = document.querySelector('#myform');
const title = document.querySelector('#title');
const message = document.querySelector('#message');
console.log(message.value)



//button.addEventListener("click", action);

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

