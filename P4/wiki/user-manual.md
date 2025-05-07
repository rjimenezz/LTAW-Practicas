# Manual de Usuario – Práctica 4: Chat Server nativo

## Requisitos previos  
- Windows/macOS/Linux con Node ≥ 16  
- Navegador web moderno para los clientes del chat  
- Red local donde los dispositivos puedan verse

## Instalación y arranque  
1. Clona o descarga la carpeta `P4`.  
2. Abre una terminal en  
   ```
   c:\…\LTAW-Practicas\P4
   ```  
3. Ejecuta:
   ```
   npm install
   npm start
   ```
4. Se abrirá la ventana Electron “Chat Server”. El servidor HTTP+Socket.IO escuchará en el puerto 8080.

## Conectar clientes  
- Apunta tu navegador (o escanea el QR mostrado) a la **Chat URL** que aparece en la interfaz, p.ej.:  
  ```
  http://192.168.1.42:8080
  ```
- Verás la pantalla web de chat (`chat.html`). Allí escribe tu mensaje y pulsa **Enviar** o **Enter**.

## Uso de la interfaz de servidor  
1. **Información de sistema**  
   - Node/Electron/Chrome: versiones de runtime  
   - Arquitectura, plataforma, hostname, directorios (home, temp, cwd) y ruta de la app  
2. **Chat URL**  
   - Texto clickable con la dirección IP local + puerto  
   - Código QR para escanear desde móviles  
3. **Usuarios conectados**  
   - Se actualiza en tiempo real al conectar/desconectar un cliente  
4. **Mensajes recibidos**  
   - Muestra los últimos mensajes que envían los clientes  
   - Scroll automático a medida que llegan mensajes nuevos  
5. **Enviar Test**  
   - Pulsa **Enviar Test** para que el servidor difunda el mensaje  
     ```
     *** TEST desde servidor ***
     ```
   - Útil para comprobar que la conexión con todos los clientes está activa

## Cerrar la aplicación  
- Simplemente cierra la ventana Electron o presiona **Ctrl +C** en la terminal donde ejecutaste `npm start`.

¡Y ya está! Con estos pasos tendrás un servidor de chat nativo, fácil de instalar y usar en tu red local.// filepath: c:\Users\raulj\Desktop\Universidad\URJC\Quinto año\Segundo cuatri\LTAW\LTAW-Practicas\P4\wiki\user-manual.md
