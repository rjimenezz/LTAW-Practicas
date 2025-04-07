document.addEventListener('DOMContentLoaded', () => {
    // Obtén el username almacenado en localStorage
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
    
    // Añade el listener para el botón de "Cerrar Sesión"
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('sessionId');
            localStorage.removeItem('username');
            alert('Sesión cerrada');
            // Actualiza el estado de sesión en la página
            if (userInfoDiv) {
                userInfoDiv.innerText = 'No Conectado';
            }
            // Redirige a la página de login (opcional)
            window.location.href = 'login.html';
        });
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
                    if (userInfoDiv) {
                        userInfoDiv.innerText = 'No Conectado';
                    }
                }
            })
            .catch(err => console.error('Error al cargar los datos de usuarios:', err));
    }
});