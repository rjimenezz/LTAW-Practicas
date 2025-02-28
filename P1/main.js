document.addEventListener('DOMContentLoaded', () => {
    const productLinks = document.querySelectorAll('.product-link');

    productLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const productName = link.getAttribute('data-product-name');
            alert(`Has hecho clic en ${productName}`);
            window.location.href = link.href;
        });
    });
});