# Manual de Usuario – Práctica P2

## Introducción
Este manual ofrece instrucciones para utilizar la tienda online. La aplicación se ejecuta en Node.js y atiende las peticiones en el puerto **8001**.

## Requisitos Previos
- Tener [Node.js](https://nodejs.org/) instalado.
- Un navegador web actualizado.
- Ejecutar el servidor con el comando:
  ```
  node tienda.js
  ```
  en la carpeta `P2`.

## Instrucciones de Uso

### 1. Iniciar el Servidor
1. Abrir una terminal de Windows.
2. Navegar a la carpeta `P2` (donde se encuentran `tienda.js` y `tienda.json`).
3. Ejecutar el comando:
   ```
   node tienda.js
   ```
4. El servidor comenzará a atender en:  
   ```
   http://localhost:8001/
   ```

### 2. Acceder a la Tienda
- Abra el navegador y diríjase a:
  ```
  http://localhost:8001/
  ```
- En la página principal se muestran los productos disponibles.

### 3. Uso de la Búsqueda con Autocompletado
- En la parte superior de la página principal, hay una caja de búsqueda.
- Escriba al menos 3 caracteres para activar el autocompletado.
- Se mostrará un menú desplegable con las sugerencias basadas en los productos disponibles.
- Haga clic sobre una sugerencia para ser redirigido a la página de detalle del producto.

### 4. Visualización del Detalle de un Producto
- Al hacer clic en un producto, se abrirá su página de detalle (por ejemplo, `product1.html`, `product2.html`, `product3.html`).
- En esta página se mostrará la descripción, precio y stock del producto.
- Se incluye un campo numérico para seleccionar la cantidad a agregar, que está limitado al stock disponible.
- Haga clic en el botón "Agregar al Carrito" para incluir el producto en su carrito y actualizar el stock mostrado.

### 5. Revisar y Finalizar el Pedido
1. Haga clic en “Mi Carrito” (en el menú) para acceder a `order.html`.
2. La página mostrará un resumen del carrito, agrupando los productos por nombre y detallando la cantidad y precio unitario.
3. Se mostrará el total de la compra y se generará un recibo de compra.
4. Complete el formulario con:
   - **Dirección de Envío**
   - **Número de Tarjeta**
5. Presione "Finalizar Compra".  
   Si el pedido se procesa correctamente, aparecerá una alerta con el recibo detallado y se redirigirá a la página principal.

### 6. Cerrar Sesión
- Un botón "Cerrar Sesión" se encuentra en el encabezado.
- Haga clic en él para borrar la sesión actual y volver a la página de login.

## Notas Adicionales
- **Mensajes de Error:** Si ocurre algún error (por ejemplo, falta de stock, credenciales incorrectas o problemas en el pedido), se mostrarán alertas con las correspondientes instrucciones.
- **Actualización en Tiempo Real:** En la página de detalle del producto, el stock se actualiza según la cantidad agregada al carrito.
- **Soporte:** Para más detalles técnicos, consulte el documento de [documentación técnica](technical-documentation.md).
