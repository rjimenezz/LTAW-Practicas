# Manual de Usuario – Práctica 3: Chat en Tiempo Real

## Introducción
Esta aplicación de chat en tiempo real permite que múltiples usuarios se conecten y conversen desde sus navegadores. Cada usuario recibe un mensaje de bienvenida al conectarse, y el sistema notifica al resto de participantes cuando alguien se une o se retira.

## Requisitos y Preparación
- Tener instalado [Node.js](https://nodejs.org/).
- El proyecto usa [express](https://expressjs.com/) y [socket.io](https://socket.io/), las cuales se especifican en el archivo `package.json`.
- Para iniciar la aplicación, abra una terminal de Windows, navegue a la carpeta `P3` y ejecute el siguiente comando:
  ```
  node server.js
  ```
- Asegúrese de que el puerto **8080** esté libre.

## Cómo Usar la Aplicación
1. **Acceso a la Aplicación:**
   - Abra su navegador y diríjase a:  
     ```
     http://localhost:8080/
     ```
2. **Interfaz del Chat:**
   - Al conectarse, verá un mensaje de bienvenida exclusivo para usted.
   - Se notificará al resto de usuarios que se ha conectado un nuevo participante.
   - La ventana principal muestra los mensajes del chat y, a la derecha, la lista actualizada de usuarios conectados.
   
3. **Envío y Recepción de Mensajes:**
   - Escriba su mensaje en el campo de texto y presione el botón "Enviar" o la tecla Enter.
   - Todos los mensajes enviados serán visibles para todos los usuarios.

4. **Uso de Comandos Especiales:**
   - Si inicia su mensaje con el carácter `/`, el mensaje se tratará como un comando especial. A continuación se muestra una lista de comandos disponibles:
     - **/help:** Muestra una lista de comandos soportados.
     - **/list:** Muestra la cantidad de usuarios conectados junto con sus nicknames.
     - **/hello:** Recibe un saludo directo del servidor.
     - **/date:** Muestra la fecha y hora actual.
     - **/nick <nuevo_nickname>:** Permite cambiar su nickname. Por ejemplo, escribir `/nick Juan` cambiará su nickname a "Juan".
   - *Nota:* La respuesta a estos comandos solo la verá usted.

## Mejoras y Sugerencias de Uso
- **Personalización del Nickname:**  
  Puede cambiar su nickname utilizando el comando `/nick` para identificarse de forma personalizada.
  
- **Notificaciones de Estado:**  
  El chat actualiza en tiempo real la lista de usuarios conectados, permitiéndole ver con quiénes está chateando.

- **Mejoras Futura (Propuestas):**
  - Disfrutar de **sonidos** que indiquen la llegada de nuevos mensajes.
  - Visualización de notificaciones del tipo **"El usuario X está escribiendo..."**.
  - Enviar mensajes directos de forma privada a otros usuarios.

## Desconexión
- Para salir del chat, simplemente cierre la pestaña del navegador. El servidor notificará a los demás usuarios de la desconexión.

¡Disfrute de la experiencia de chat en tiempo real!
