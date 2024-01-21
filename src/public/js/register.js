const form = document.getElementById('registerForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if(result.ok) {
            Swal.fire({
                title: `Te has registrado correctamente`,
                toast: true,
                position:"top-end"
            });
        } else {
            Swal.fire({
                title: `Email ya registrado`,
                toast: true,
                position:"top-end"
            });
        }
    }).then(result => result.json()).then(json => console.log(json));
});