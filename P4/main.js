// Importamos módulos necesarios
const { app, BrowserWindow, ipcMain } = require('electron');  // Ciclo de vida, ventanas IPC
const os = require('os');           // Para obtener IPs de red
const path = require('path');       // Para rutas de ficheros
const express = require('express'); // Servidor HTTP
const http = require('http');       // HTTP nativo
const { Server } = require('socket.io'); // WebSockets fácil

let win;                      
const CHAT_PORT = 8080;      // Puerto donde escuchará el chat

// ——— 1) Configurar y arrancar el servidor de chat ———
const chatApp = express();
const chatServer = http.createServer(chatApp);
const io = new Server(chatServer);

// — Servir chat.html en "/" ANTES de los estáticos
chatApp.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

// — Servir el resto de archivos (cliente.js, chat.css, socket.io.js…), 
//    desactivando el index.html por defecto
chatApp.use(express.static(__dirname, { index: false }));

// Cuando un cliente Socket.IO se conecta…
io.on('connect', socket => {
  // …escuchamos mensajes y los reenviamos a todos los clientes
  socket.on('message', msg => {
    const out = `Cliente(${socket.id.substring(0,5)}): ${msg}`;
    io.emit('message', out);                            
    if (win) win.webContents.send('server-message', out);
    
  })
   // Al conectar, aviso UI Electron del nuevo count
   if (win) {
    const count = io.of("/").sockets.size;
    win.webContents.send('users-updated', count);
  }

  socket.on('disconnect', () => {
    // Al desconectar, aviso UI Electron del nuevo count
    if (win) {
      const count = io.of("/").sockets.size;
      win.webContents.send('users-updated', count);
    }
  });
});

// Iniciar el servidor HTTP + Socket.IO
chatServer.listen(CHAT_PORT, () => {
  console.log(`Chat escuchando en http://0.0.0.0:${CHAT_PORT}`);
});

// ——— 2) Crear la ventana de Electron ———
app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 700,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });
  win.loadFile('index.html'); // Carga la UI principal
});

// ——— 3) IPC: obtener versiones y URL de chat ———
ipcMain.handle('get-info', () => {
  // Obtener la primera IPv4 no interna
  let ip = '127.0.0.1';
  for (const iface of Object.values(os.networkInterfaces()).flat()) {
    if (iface.family === 'IPv4' && !iface.internal) {
      ip = iface.address;
      break;
    }
  }
  return {
    node: process.version,                      // Versión de Node.js
    electron: process.versions.electron,        // Versión de Electron
    chrome: process.versions.chrome,            // Versión de Chromium
    chatURL: `http://${ip}:${CHAT_PORT}`,        // URL para conectar clientes

    arch: process.arch,                  // p.ej. 'x64'
    platform: os.platform(),            // p.ej. 'win32'
    hostname: os.hostname(),            // nombre de la máquina
    homedir: os.homedir(),              // directorio home
    tmpdir: os.tmpdir(),                // directorio temporal
    cwd: process.cwd(),                  // directorio de trabajo
    appPath: app.getAppPath(),           // ruta de la app

    usersCount: io.of("/").sockets.size    // nº de sockets conectados
  };
});

// ——— 4) IPC: emitir mensaje de prueba a todos los clientes ———
ipcMain.handle('broadcast-test', () => {
  const testMsg = '*** TEST desde servidor ***';
  io.emit('message', testMsg);
  if (win) win.webContents.send('server-message', testMsg);
});