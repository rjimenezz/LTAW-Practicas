document.addEventListener('DOMContentLoaded', () => {
    // El nombre del producto se indica en el atributo data-product-name del body
    const productName = document.body.getAttribute('data-product-name');
    if (!productName) {
        console.error("No se ha especificado el nombre del producto en data-product-name");
        return;
    }
    fetch('tienda.json')
        .then(response => response.json())
        .then(data => {
            const product = data.productos.find(p => p.nombre === productName);
            if (product) {
                // Actualiza el título y la información en la página
                document.querySelector('h2').innerText = product.nombre;
                const productInfo = document.querySelector('.product-info');
                productInfo.innerHTML = `
                    <p>${product.descripcion}</p>
                    <p class="price">Precio: ${product.precio}€</p>
                    <button id="add-to-cart">Agregar al Carrito</button>
                `;
            } else {
                console.error("Producto no encontrado");
            }
        })
        .catch(err => console.error("Error al cargar la base de datos:", err));
});