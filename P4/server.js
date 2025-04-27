//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 8080;

//-- Crear una nueva aplicacion web
const app = express();

//-- Crear un servidor, asociado a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//-- Contador de usuarios conectados
let usuariosConectados = 0;

//-- Almacén de nicknames de usuarios (socketId -> nickname)
const userNicknames = {};

// Función para actualizar la lista de usuarios conectados en todos los clientes
function updateUsersList() {
  // Convertir el objeto de nicknames a un array de nombres
  const usersList = Object.values(userNicknames);
  
  // Enviar la lista actualizada a todos los clientes
  io.emit('update-users', usersList);
}

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  
  console.log('** NUEVA CONEXIÓN **'.yellow);
  
  // Incrementar contador de usuarios
  usuariosConectados++;
  
  // Asignar un nickname temporal
  const temporalNick = 'Usuario_' + socket.id.substring(0, 5);
  userNicknames[socket.id] = temporalNick;
  
  // Enviar mensaje de bienvenida solo al usuario que se conectó
  socket.emit("message", "¡Bienvenido al Chat!");
  socket.emit("message", `Tu nickname actual es: ${temporalNick}`);
  socket.emit("message", "Puedes cambiarlo usando el comando /nick <nuevo_nickname>");
  
  // Notificar a todos los demás usuarios que alguien nuevo se conectó
  socket.broadcast.emit("message", `${temporalNick} se ha conectado`);
  
  // Actualizar la lista de usuarios para todos
  updateUsersList();

  //-- Evento para cambiar nickname
  socket.on('set-nickname', (nickname) => {
    const oldNickname = userNicknames[socket.id];
    userNicknames[socket.id] = nickname;
    
    // Confirmar al usuario que su nickname ha cambiado
    socket.emit("message", `Tu nickname ha sido cambiado a: ${nickname}`);
    
    // Informar al resto de usuarios sobre el cambio de nickname
    socket.broadcast.emit("message", `${oldNickname} ahora se llama ${nickname}`);
    console.log(`${oldNickname} ahora se llama ${nickname}`.yellow);
    
    // Actualizar la lista de usuarios para todos
    updateUsersList();
  });

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    
    // Obtener el nickname antes de eliminarlo
    const nickname = userNicknames[socket.id] || 'Usuario desconocido';
    
    // Eliminar el nickname del usuario que se desconectó
    delete userNicknames[socket.id];
    
    // Decrementar contador de usuarios
    usuariosConectados--;
    
    // Notificar a todos que un usuario se ha desconectado
    io.emit("message", `${nickname} se ha desconectado`);
    
    // Actualizar la lista de usuarios para todos
    updateUsersList();
  });  

  //-- Mensaje recibido: Procesarlo según corresponda
  socket.on("message", (msg) => {
    console.log("Mensaje Recibido!: " + msg.blue);

    // Obtener el nickname del usuario
    const nickname = userNicknames[socket.id];

    // Comprobar si el mensaje es un comando (comienza por /)
    if (msg.startsWith('/')) {
      procesarComando(socket, msg);
    } else {
      //-- Reenviar el mensaje a todos los clientes conectados con el nickname
      io.emit("message", `${nickname}: ${msg}`);
    }
  });
});

// Función para procesar comandos
function procesarComando(socket, comando) {
  // Extraer el comando sin el "/"
  const parts = comando.split(' ');
  const cmd = parts[0].substring(1);
  
  switch(cmd) {
    case 'help':
      socket.emit("message", "Comandos disponibles:");
      socket.emit("message", "/help: Muestra esta lista de comandos");
      socket.emit("message", "/list: Muestra el número de usuarios conectados");
      socket.emit("message", "/hello: Recibe un saludo del servidor");
      socket.emit("message", "/date: Muestra la fecha y hora actual");
      socket.emit("message", "/nick <nuevo_nickname>: Cambia tu nickname");
      break;
    
    case 'list':
      // Listar usuarios con sus nicknames
      let userList = `Usuarios conectados (${usuariosConectados}):`;
      for (const [socketId, nickname] of Object.entries(userNicknames)) {
        userList += `\n- ${nickname}`;
      }
      socket.emit("message", userList);
      break;
    
    case 'hello':
      socket.emit("message", "¡Hola! Saludos desde el servidor");
      break;
    
    case 'date':
      const fecha = new Date().toLocaleString();
      socket.emit("message", `Fecha actual: ${fecha}`);
      break;
      
    case 'nick':
      if (parts.length < 2) {
        socket.emit("message", "Debes especificar un nickname. Uso: /nick <nuevo_nickname>");
      } else {
        const newNickname = parts.slice(1).join(' ');
        // Emitir evento para cambiar el nickname
        socket.emit('set-nickname', newNickname);
      }
      break;
    
    default:
      socket.emit("message", `Comando desconocido: ${comando}`);
      socket.emit("message", "Usa /help para ver los comandos disponibles");
  }
}

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO, () => {
  console.log("Servidor de chat escuchando en:".yellow);
  console.log(`${"http://localhost:".green}${PUERTO.toString().green}`);
  console.log("Haz clic en el enlace de arriba para abrir el chat en tu navegador".cyan);
});