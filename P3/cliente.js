//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const send_button = document.getElementById("send_button");
const usersList = document.getElementById("users-list");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

// Variable para almacenar mi nickname
let myNickname = null;

// Función para agregar mensajes al display
function addMessage(msg, isCommand = false) {
  // Determinar estilo según si es comando o mensaje normal
  let style = isCommand ? "color:#2196F3; font-style:italic;" : "color:#333;";
  
  // Agregar el mensaje al display
  display.innerHTML += `<p style="${style}">${msg}</p>`;
  
  // Hacer scroll automático hacia abajo para mostrar el mensaje más reciente
  display.scrollTop = display.scrollHeight;
}

// Escuchar mensajes del servidor
socket.on("message", (msg) => {
  // Verificar si es un mensaje privado (respuesta a un comando)
  const isCommand = msg.startsWith("Comando") || 
                   msg.includes("Usuarios conectados") || 
                   msg.includes("¡Hola!") || 
                   msg.includes("Fecha actual") ||
                   msg.includes("Comandos disponibles") ||
                   msg.includes("Tu nickname") ||
                   msg.startsWith("Debes especificar");
  
  // Comprobar si el mensaje contiene mi nickname (para actualizar la variable local)
  if (msg.startsWith("Tu nickname ha sido cambiado a:")) {
    myNickname = msg.split(": ")[1];
  }
  
  addMessage(msg, isCommand);
});

// Escuchar actualizaciones de la lista de usuarios
socket.on('update-users', (users) => {
  // Limpiar la lista actual
  usersList.innerHTML = '';
  
  // Añadir cada usuario a la lista
  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.className = 'user-item';
    
    // Destacar el nombre del usuario actual
    if (user === myNickname) {
      userElement.classList.add('self');
      userElement.textContent = `${user} (tú)`;
    } else {
      userElement.textContent = user;
    }
    
    usersList.appendChild(userElement);
  });
});

// Escuchar eventos para cambiar nickname
socket.on('set-nickname', (nickname) => {
  // Enviar el nuevo nickname al servidor
  socket.emit('set-nickname', nickname);
  myNickname = nickname;
});

// Función para enviar mensaje
function sendMessage() {
  if (msg_entry.value) {
    // Si es un mensaje normal (no comando)
    if (!msg_entry.value.startsWith('/')) {
      // No añadir el mensaje local ya que el servidor nos lo devolverá 
      // con el nickname correcto y evitamos duplicados
    }
    
    // Enviar el mensaje al servidor
    socket.send(msg_entry.value);
    
    // Borrar el mensaje del campo de entrada
    msg_entry.value = "";
  }
}

// Enviar al presionar el botón
send_button.onclick = () => {
  sendMessage();
};

// Enviar al presionar Enter
msg_entry.onkeydown = (event) => {
  if (event.key === 'Enter') {
    sendMessage();
    event.preventDefault();
  }
};

// Mostrar un mensaje cuando se conecta
window.addEventListener('load', () => {
  console.log("Chat iniciado");
});