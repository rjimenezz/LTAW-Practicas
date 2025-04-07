document.addEventListener('DOMContentLoaded', () => {
    // Obtén el nombre del producto desde el atributo data-product-name del body
    const productName = document.body.getAttribute('data-product-name');
    const productInfo = document.querySelector('.product-info');
    // Obtén el elemento h2 que actualmente muestra "Cargando..."
    const titleElement = document.querySelector('main h2');

    if (!productName) {
        if (productInfo) productInfo.innerHTML = '<p>Producto no especificado</p>';
        if (titleElement) titleElement.innerText = 'Producto no especificado';
        return;
    }

    // Consulta la base de datos tienda.json para obtener la información del producto
    fetch('tienda.json')
        .then(response => response.json())
        .then(data => {
            // Busca el producto cuyo nombre coincida
            const product = data.productos.find(p => p.nombre === productName);
            if (product) {
                // Actualiza el h2 para mostrar el nombre del producto en lugar de "Cargando..."
                if (titleElement) titleElement.innerText = product.nombre;
                // Actualiza el contenedor con la información del producto, mostrando stock y campo de cantidad
                if (productInfo) {
                    productInfo.innerHTML = `
                        <p>${product.descripcion}</p>
                        <p class="price">Precio: ${product.precio}€</p>
                        <p>En stock: <span id="stock-display">${product.stock}</span></p>
                        <label for="quantity">Cantidad:</label>
                        <input type="number" id="quantity" min="1" max="${product.stock}" value="1">
                        <button id="add-to-cart">Agregar al Carrito</button>
                    `;
                }
                
                // Listener para el botón "Agregar al Carrito"
                const addBtn = document.getElementById('add-to-cart');
                if (addBtn) {
                    addBtn.addEventListener('click', async () => {
                        const sessionId = localStorage.getItem('sessionId');
                        if (!sessionId) {
                            alert('Debes iniciar sesión para agregar al carrito.');
                            window.location.href = 'login.html';
                            return;
                        }
                        // Obtiene la cantidad seleccionada
                        const quantityInput = document.getElementById('quantity');
                        const quantity = parseInt(quantityInput.value, 10);
                        if (isNaN(quantity) || quantity < 1) {
                            alert('Selecciona una cantidad válida.');
                            return;
                        }
                        if (quantity > product.stock) {
                            alert('No hay suficiente stock disponible.');
                            return;
                        }
                        
                        // Envía la solicitud para agregar el producto al carrito, incluyendo la cantidad
                        const res = await fetch('/add-to-cart', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ sessionId, productName, quantity })
                        });
                        const result = await res.json();
                        if (result.success) {
                            alert(`Producto añadido al carrito. Carrito: ${result.carrito.join(', ')}`);
                            // Actualiza el stock mostrado (resta la cantidad agregada)
                            const stockDisplay = document.getElementById('stock-display');
                            if (stockDisplay) {
                                let newStock = product.stock - quantity;
                                stockDisplay.innerText = newStock;
                                // Actualiza el atributo max del input de cantidad
                                quantityInput.setAttribute('max', newStock);
                                product.stock = newStock; // actualiza la variable local
                            }
                        } else {
                            alert(result.message || 'Error al agregar producto');
                        }
                    });
                }
            } else {
                if (productInfo) productInfo.innerHTML = `<p>Producto no encontrado</p>`;
                if (titleElement) titleElement.innerText = 'Producto no encontrado';
            }
        })
        .catch(err => {
            console.error('Error al cargar el producto:', err);
            if (productInfo) productInfo.innerHTML = `<p>Error al cargar el producto</p>`;
            if (titleElement) titleElement.innerText = 'Error';
        });
});