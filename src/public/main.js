
const form = document.querySelector('#myform');
const title = document.querySelector('#title');
const message = document.querySelector('#message');

let selectedGroupe = document.querySelector('input[name="group"]:checked').value;

const groups = document.getElementsByName('group');
for (let i = 0; i < groups.length; i++) {
    groups[i].addEventListener('change', function() {
        // Update the selectedDrone variable whenever a new option is selected
        selectedGroupe = this.value;
    });
}

function getSelectedGroup() {
    alert("Selected group: " + selectedGroupe); // Show the selected value
}

console.log(message.value)

form.addEventListener('submit', e => {
    //console.log(selectedGroupe)
    e.preventDefault(); // cancela comportamiento por defecto (o sea no refresca la pagina)
    // manda peticion
    fetch('/send-message', {
        method: 'POST',
        body: JSON.stringify({
            title: title.value,
            message: message.value,
            groupe: selectedGroupe,
            other: 'otro'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    form.reset();
})

