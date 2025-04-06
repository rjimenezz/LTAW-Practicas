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
                document.getElementById('add-to-cart').addEventListener('click', async () => {
                    const sessionId = localStorage.getItem('sessionId');
                    if (!sessionId) {
                        alert('Debes iniciar sesión para agregar al carrito.');
                        window.location.href = 'login.html';
                        return;
                    }
                    const res = await fetch('/add-to-cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sessionId, productName })
                    });
                    const result = await res.json();
                    if(result.success){
                        alert(`Producto añadido al carrito. Carrito: ${result.carrito.join(', ')}`);
                    } else {
                        alert(result.message || 'Error al agregar producto');
                    }
                });
            }
        });
});