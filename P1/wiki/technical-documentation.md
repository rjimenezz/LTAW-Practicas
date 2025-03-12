# Documentación Técnica

## Descripción del Proyecto

La aplicación es una tienda online implementada en Node.js.  
- Utiliza los módulos `http` y `fs` para servir archivos estáticos (HTML, CSS, JS e imágenes).  
- El servidor escucha en el puerto **8001**.  
- Si se solicita un recurso no existente, se devuelve una página de error HTML.

## Estructura de Carpetas
```
P1
├── tienda.js
├── index.html
├── product1.html
├── product2.html
├── product3.html
├── styles.css
├── main.js
└── (Imágenes y otros recursos)
```

## Mejoras Implementadas

- **Recurso `/ls`**: Se añadió un endpoint que genera dinámicamente una página HTML con un listado de todos los archivos en la carpeta principal.
- Se incorporó un sencillo script JavaScript en el front-end que alerta al usuario al hacer clic en un producto.

## Cómo Ejecutar el Proyecto

1. Asegurarse de tener [Node.js](https://nodejs.org/) instalado.
2. Navegar a la carpeta `P1` en la terminal.
3. Ejecutar el comando:
    ```
    node tienda.js
    ```
4. Abrir en el navegador:
    ```
    http://localhost:8001/
    ```

## Pruebas

- Verificar que los archivos estáticos (HTML, CSS, JS, imágenes) se sirven correctamente.
- Acceder a un recurso inexistente para asegurar que se muestra la página de error.
- Acceder al endpoint `/ls` y comprobar que se lista el contenido de la carpeta.
