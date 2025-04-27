# Documentación Técnica – Práctica P3: Aplicación Web de Chat

## Descripción del Proyecto
Esta aplicación implementa un chat en tiempo real en el que múltiples usuarios pueden conversar desde sus navegadores. La arquitectura consiste en:
- **Servidor en Node.js** que utiliza:
  - El paquete [express](https://expressjs.com/) para servir archivos estáticos (HTML, CSS, JS).
  - La biblioteca [socket.io](https://socket.io/) para el intercambio de mensajes en tiempo real entre cliente y servidor.
- **Cliente Web:** Se compone de archivos HTML, CSS y JavaScript que permiten la interacción con el servidor a través de socket.io.

## Especificaciones Funcionales
- Al conectarse un usuario, se le envía un mensaje de bienvenida (visible solo para él) y se notifica al resto que se ha conectado un nuevo participante.
- Los mensajes enviados por los usuarios se reenvían a todos los participantes. 
- El servidor detecta y procesa comandos especiales que comienzan por el carácter `/` de forma exclusiva para el cliente remitente:
  - `/help`: Muestra la lista de comandos soportados.
  - `/list`: Devuelve el número de usuarios conectados y la lista de nicknames.
  - `/hello`: Devuelve un saludo desde el servidor.
  - `/date`: Devuelve la fecha y hora actual.
  - `/nick <nuevo_nickname>`: Permite cambiar el nickname del usuario.

## Mejoras Implementadas y Propuestas
- **Gestión de Nicknames:**  
  Cada usuario se le asigna un nickname temporal al conectarse, pudiendo luego modificarlo mediante el comando `/nick`. La lista de usuarios conectados se actualiza en tiempo real.  
  *Mejora: Se ha implementado esta funcionalidad en el servidor (`server.js`) y en el cliente (`cliente.js`) para identificar a cada usuario.*

- **Notificaciones de Conexión/Desconexión:**  
  El servidor notifica a todos los usuarios cuando alguien se conecta o se desconecta, mostrando mensajes informativos en el chat.

- **Procesamiento de Comandos Especiales:**  
  Los comandos enviados por los usuarios se procesan de forma local y la respuesta se envía únicamente al usuario que inició el comando.
  
- **Propuestas de Mejoras Futuras:**
  - **Incluir sonidos** al recibir mensajes para mejorar la experiencia de usuario.
  - **"El usuario está escribiendo..."**: Mostrar una notificación cuando un usuario está escribiendo un mensaje.
  - **Mensajes Directos:** Habilitar la posibilidad de enviar mensajes privados entre usuarios.

## Flujo General del Sistema
1. **Conexión del Usuario:**  
   El cliente se conecta al servidor por medio de socket.io. El servidor asigna un nickname temporal y envía un mensaje de bienvenida.  
2. **Intercambio de Mensajes:**  
   Los usuarios envían mensajes al servidor. Si el mensaje es un comando (empieza por '/'), se procesa y responde solo al remitente; en caso contrario, el mensaje se difunde a todos.
3. **Gestión de Comandos:**  
   Los comandos se procesan y devuelven respuestas específicas, manteniendo la privacidad de la respuesta.

## Consideraciones Técnicas
- **Puerto:** El servidor se ejecuta en el puerto **8080**.
- **Librerías y Dependencias:**  
  Entre las dependencias se encuentran `express`, `socket.io` y `colors` (para mejorar la salida del servidor en la consola).
