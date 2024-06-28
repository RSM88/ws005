


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

const button = document.querySelector("#bnt_001");

function action() {
    //alert("Hello!");

    /*
    fetch('/test001', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    */

    fetch('/send-message', {
        method: 'POST',
        //body: JSON.stringify({
            //message: message.value
        //}),

        headers: {
            'Content-Type': 'application/json'
        }
    });
};

button.addEventListener("click", action);



