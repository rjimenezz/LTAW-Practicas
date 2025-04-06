document.addEventListener('DOMContentLoaded', () => {
    const productName = document.body.getAttribute('data-product-name');
    fetch('tienda.json')
        .then(response => response.json())
        .then(data => {
            const product = data.productos.find(p => p.nombre === productName);
            if (product) {
                document.querySelector('.product-info').innerHTML = `
                    <p>${product.descripcion}</p>
                    <p class="price">Precio: ${product.precio}€</p>
                    <button id="add-to-cart">Agregar al Carrito</button>
                `;
                document.getElementById('add-to-cart').addEventListener('click', () => {
                    fetch('/add-to-cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productName })
                    }).then(() => alert('Producto añadido al carrito'));
                });
            }
        });
});