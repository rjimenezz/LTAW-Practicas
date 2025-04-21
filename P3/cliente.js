//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const send_button = document.getElementById("send_button");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

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
                   msg.includes("Comandos disponibles");
  
  addMessage(msg, isCommand);
});

// Función para enviar mensaje
function sendMessage() {
  if (msg_entry.value) {
    // Si es un mensaje normal (no comando)
    if (!msg_entry.value.startsWith('/')) {
      // Añadir el mensaje localmente antes de enviarlo
      addMessage(`Yo: ${msg_entry.value}`);
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