document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.product-card .button');

    addToCartButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const productCard = event.currentTarget.closest('.product-card');
            if (!productCard) {
                return;
            }

            const productName = productCard.querySelector('h3')?.textContent?.trim();
            const productPrice = productCard.querySelector('.price')?.textContent?.trim();
            const productImage = productCard.querySelector('img')?.getAttribute('src');

            if (!productName || !productPrice || !productImage) {
                return;
            }

            const product = {
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1,
            };

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingIndex = cart.findIndex((item) => item.name === product.name);

            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push(product);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            showNotification(`${product.name} added to cart`);
        });
    });
});

function showNotification(message) {
    let toast = document.querySelector('.toast-notification');

    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('visible');

    window.clearTimeout(showNotification.hideTimer);
    showNotification.hideTimer = window.setTimeout(() => {
        toast.classList.remove('visible');
    }, 2200);
}