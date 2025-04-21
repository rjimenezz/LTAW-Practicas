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
  
  // Enviar mensaje de bienvenida solo al usuario que se conectó
  socket.emit("message", "¡Bienvenido al Chat!");
  
  // Notificar a todos los demás usuarios que alguien nuevo se conectó
  socket.broadcast.emit("message", "Un nuevo usuario se ha conectado");

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    // Decrementar contador de usuarios
    usuariosConectados--;
    // Notificar a todos que un usuario se ha desconectado
    io.emit("message", "Un usuario se ha desconectado");
  });  

  //-- Mensaje recibido: Procesarlo según corresponda
  socket.on("message", (msg) => {
    console.log("Mensaje Recibido!: " + msg.blue);

    // Comprobar si el mensaje es un comando (comienza por /)
    if (msg.startsWith('/')) {
      procesarComando(socket, msg);
    } else {
      //-- Reenviar el mensaje a todos los clientes conectados
      io.emit("message", msg);
    }
  });
});

// Función para procesar comandos
function procesarComando(socket, comando) {
  // Extraer el comando sin el "/"
  const cmd = comando.split(' ')[0].substring(1);
  
  switch(cmd) {
    case 'help':
      socket.emit("message", "Comandos disponibles:");
      socket.emit("message", "/help: Muestra esta lista de comandos");
      socket.emit("message", "/list: Muestra el número de usuarios conectados");
      socket.emit("message", "/hello: Recibe un saludo del servidor");
      socket.emit("message", "/date: Muestra la fecha y hora actual");
      break;
    
    case 'list':
      socket.emit("message", `Usuarios conectados: ${usuariosConectados}`);
      break;
    
    case 'hello':
      socket.emit("message", "¡Hola! Saludos desde el servidor");
      break;
    
    case 'date':
      const fecha = new Date().toLocaleString();
      socket.emit("message", `Fecha actual: ${fecha}`);
      break;
    
    default:
      socket.emit("message", `Comando desconocido: ${comando}`);
      socket.emit("message", "Usa /help para ver los comandos disponibles");
  }
}

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Servidor de chat escuchando en puerto: " + PUERTO);