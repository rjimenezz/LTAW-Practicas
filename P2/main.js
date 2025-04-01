document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    if (username) {
        fetch('tienda.json')
            .then(response => response.json())
            .then(data => {
                const user = data.usuarios.find(u => u.nombre === username);
                if (user) {
                    const welcomeMessage = document.getElementById('welcome-message');
                    welcomeMessage.innerText = `Estás conectado como: ${user.nombre_real}`;
                } else {
                    alert('Usuario no válido');
                    window.location.href = 'login.html';
                }
            })
            .catch(err => console.error('Error al cargar los datos de usuarios:', err));
    }
});