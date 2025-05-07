# Documentación Técnica – Práctica 4: Chat nativo con Electron

## 1. Descripción general  
Esta aplicación convierte el servidor de chat de la Práctica 3 en un cliente nativo Electron.  
- Arranca un servidor HTTP + Socket.IO en el puerto 8080 para gestionar el chat.  
- Crea una ventana Electron con una interfaz que muestra información de sistema, la URL de chat (dinámica), un QR para escanearla, el número de usuarios, últimos mensajes y un botón de test.  
- Los clientes se conectan desde cualquier navegador a `http://<IP-local>:8080`, interactúan con Socket.IO y chatean en tiempo real.

## 2. Estructura de ficheros  
```
P4
├── chat.html            # Cliente web del chat (Práctica 3)
├── cliente.js           # Lógica cliente Socket.IO
├── chat.css             # Estilos del cliente web
├── main.js              # Proceso principal Electron + servidor chat
├── preload.js           # Puente seguro IPC (contextBridge)
├── index.html           # Interfaz gráfica Electron
├── index.js             # Renderer Electron: rellena UI / genera QR / escucha IPC
├── style.css            # Estilos UI Electron
├── package.json         # Dependencias y script `npm start`
└── wiki
    ├── technical-documentation.md  # Esta documentación
    └── user-manual.md             # Manual de usuario
```

## 3. Módulos y dependencias  
- **Electron**: `app`, `BrowserWindow`, `ipcMain`, `ipcRenderer`  
- **Express** & **http**: servidor HTTP para servir `chat.html`, `cliente.js`, `chat.css`  
- **Socket.IO**: WebSockets para mensajería en tiempo real  
- **os** & **process**: obtención de IP, versiones, ruta de aplicación y directorios  
- **qrcodejs** (CDN): generación del código QR en el renderer

```jsonc
// package.json
"dependencies": {
  "express": "^5.1.0",
  "socket.io": "^4.8.1"
},
"devDependencies": {
  "electron": "^35.2.1"
}
```

## 4. Flujo de arranque  
1. **`npm install`**  
2. **`npm start`** → lanza `electron .`  
3. **main.js** crea servidor chat (`chatServer.listen(8080)`) y abre ventana (`win.loadFile('index.html')`).  
4. `preload.js` expone en `window.electronAPI` las funciones IPC:
   - `getInfo()` → versiones, IP y `usersCount`
   - `broadcastTest()` → mensaje de prueba a todos
   - eventos `server-message` y `users-updated`
5. **index.js**  
   - invoca `getInfo()` y pinta todos los `<span id="info…">`  
   - genera QR con [`new QRCode(...)`](https://github.com/davidshimjs/qrcodejs)  
   - suscribe `onServerMsg` y `onUsersUpdated` para actualizar la UI  
   - maneja el botón de test


## 5. Mejoras y extensiones implementadas  
- **Código QR** para la URL de conexión (móvil → escanea y entra automáticamente)  
- **Información extra del sistema**: arquitectura, plataforma, hostname, home/temporal/working dirs y ruta de la app  
- **Conteo en tiempo real** de usuarios en la UI de servidor  
- **Botón “Enviar Test”** que envía un mensaje global desde el servidor

## 6. Posibles futuras mejoras  
- Empaquetado multiplataforma (Windows/macOS/Linux)  
- Autenticación de usuarios y canales privados  
- “Usuario está escribiendo…”  
- Sonidos y notificaciones de escritorio  
- Historial persistente en base de datos  

---
