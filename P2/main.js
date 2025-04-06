document.addEventListener('DOMContentLoaded', () => {
    // Obtén el nombre de usuario desde localStorage
    const username = localStorage.getItem('username');

    // Actualiza el contenedor de estado de sesión
    const userInfoDiv = document.getElementById('user-info');
    if (userInfoDiv) {
        if (username) {
            userInfoDiv.innerText = `Conectado como: ${username}`;
        } else {
            userInfoDiv.innerText = 'No Conectado';
        }
    }

    // Si existe un usuario, se consulta la base de datos para mostrar su nombre real
    if (username) {
        fetch('tienda.json')
            .then(response => response.json())
            .then(data => {
                const user = data.usuarios.find(u => u.nombre === username);
                if (user) {
                    const welcomeMessage = document.getElementById('welcome-message');
                    if (welcomeMessage) {
                        welcomeMessage.innerText = `Estás conectado como: ${user.nombre_real}`;
                    }
                } else {
                    // Si no se encuentra, borra la sesión
                    localStorage.removeItem('username');
                    localStorage.removeItem('sessionId');
                }
            })
            .catch(err => console.error('Error al cargar los datos de usuarios:', err));
    }
});