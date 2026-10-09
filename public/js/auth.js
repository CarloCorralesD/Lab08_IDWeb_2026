
const formLogin = document.getElementById('formLogin');
const mensaje = document.getElementById('mensaje');

function mostrarMensaje(texto, tipo = '') {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
}

async function verificarSesion() {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'same-origin'
        });

        if (response.ok) {
            window.location.replace('/estudiantes.html');
        }
    } catch (error) {
        console.error('No se pudo verificar la sesión:', error);
    }
}

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value;

    if (!usuario || !password) {
        mostrarMensaje('Completa todos los campos.', 'mensaje-error');
        return;
    }

    const boton = formLogin.querySelector('button[type="submit"]');
    boton.disabled = true;
    mostrarMensaje('Verificando credenciales...');

    try {
        const response = await fetch('/login', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Credenciales incorrectas.');
        }

        mostrarMensaje('Acceso correcto.', 'mensaje-exito');

        window.location.assign('/estudiantes.html');

    } catch (error) {
        mostrarMensaje(error.message || 'No se pudo iniciar sesión.',
            'mensaje-error');
    } finally {
        boton.disabled = false;
    }
});

verificarSesion();