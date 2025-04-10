# Documentación Técnica – Práctica P2

## Descripción del Proyecto
Esta aplicación es una tienda online implementada en Node.js que:
- Sirve archivos estáticos (HTML, CSS, JavaScript, imágenes).
- Maneja peticiones para la autenticación de usuarios, adiciones al carrito (con selección de cantidad y actualización de stock), finalización de pedidos y búsqueda con autocompletado.
- Permite consultar un listado dinámico de los archivos mediante el endpoint `/ls`.

> **Nota:** El servidor atiende las peticiones en el puerto **8001**.

## Estructura de Carpetas
```
P2
├── index.html
├── login.html
├── main.js
├── order.html
├── product.js
├── product1.html
├── product2.html
├── product3.html
├── producto1.jpg
├── producto2.jpg
├── producto3.jpg
├── README.md
├── styles.css
├── tienda.js
├── tienda.json
└── wiki
    ├── technical-documentation.md   <-- Este archivo
    └── user-manual.md
```

## Endpoints y Funcionalidades

### 1. Autenticación
- **/login (POST):**  
  Valida el `username` y `password` en `tienda.json`.  
  Si las credenciales son correctas, se genera un `sessionId` y se inicializa el carrito para la sesión.

### 2. Carrito de Compras
- **/add-to-cart (POST):**  
  Permite agregar un producto con la cantidad deseada al carrito, validando que exista stock suficiente.  
  **Mejora implementada:** En `product.js` se muestra un campo numérico para seleccionar la cantidad, y se actualiza en tiempo real el stock mostrado en la página.
- **/get-cart (GET):**  
  Devuelve el contenido del carrito para el `sessionId` proporcionado.
- **/finalize-order (POST):**  
  Finaliza el pedido registrando la información de usuario (dirección, tarjeta) junto con los productos del carrito. Tras la confirmación, el carrito se reinicia.

### 3. Búsqueda con Autocompletado
- En la página principal (`index.html`), se incluye una caja de búsqueda que, a partir de 3 caracteres, muestra sugerencias obtenidas de `tienda.json`.
- Al presionar el botón "Buscar" o elegir una sugerencia, el usuario es redirigido a la página de detalle del producto correspondiente.

### 4. Listado de Archivos
- **/ls:**  
  Endpoint especial que genera dinámicamente un listado HTML de todos los archivos de la carpeta principal (útil para depuración).

## Mejoras Implementadas en P2
- **Selección de Cantidad y Actualización de Stock:**  
  En la página de detalle del producto (a través de `product.js`), el usuario puede seleccionar la cantidad, siempre que haya suficiente stock. El stock mostrado se actualiza inmediatamente tras agregar productos.
- **Recibo de Compra:**  
  En `order.html` se agrupa el contenido del carrito y se genera un recibo de compra detallado (con el total) que se muestra al finalizar el pedido.
- **Búsqueda con Autocompletado:**  
  Se incorpora autocompletado en `index.html`, que ofrece sugerencias a partir de 3 caracteres y redirige a la página de producto correspondiente.

## Requisitos Técnicos
- Node.js (para ejecutar el servidor)
- Las peticiones se atienden en el puerto **8001**.
- Ejecutar el servidor usando el comando:
  ```
  node tienda.js
  ```

## Flujo General del Sistema
1. **Login:** El usuario se autentica en `login.html` y se guarda el `sessionId` en el navegador.
2. **Exploración:** Desde `index.html`, el usuario puede buscar y seleccionar productos.
3. **Detalle del Producto:** Mediante `product.js`, se muestran la descripción, precio, stock y se permite seleccionar la cantidad.
4. **Carrito y Pedido:** En `order.html` se agrupa el carrito, se muestra un resumen (recibo) y se finaliza el pedido.
5. **Listados Adicionales:** El endpoint `/ls` ofrece un listado completo de archivos para soporte interno.
