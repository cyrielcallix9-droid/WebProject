
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryElement = document.getElementById('delivery');
    const totalElement = document.getElementById('total');
    const guestCheckoutButton = document.querySelector('.guest-checkout');

    if (guestCheckoutButton) {
        guestCheckoutButton.addEventListener('click', () => {
            window.location.href = 'delivery.html';
        });
    }

    if (!cartItemsContainer || !subtotalElement || !totalElement) {
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function initializeCart() {
        cart.forEach(product => {
            if (!product.sizes || product.sizes.length !== product.quantity) {
                product.sizes = Array(product.quantity).fill('Medium');
            }
        });
        saveCart();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function parsePrice(value) {
        const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ''));
        return Number.isNaN(numeric) ? 0 : numeric;
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            const emptyElement = document.createElement('p');
            emptyElement.className = 'empty-cart-message';
            emptyElement.textContent = 'Your cart is empty. Keep shopping to add your favorites!';
            cartItemsContainer.appendChild(emptyElement);
            updateSummary();
            return;
        }

        cart.forEach((product, index) => {
            const price = parsePrice(product.price);
            const lineTotal = price * (product.quantity || 1);

            const sizeSelectors = product.sizes.map((size, sizeIndex) => `
                <div class="size-selector">
                    <label for="size-${index}-${sizeIndex}">Size:</label>
                    <select id="size-${index}-${sizeIndex}" class="size-select" data-index="${index}" data-size-index="${sizeIndex}">
                        <option value="Small" ${size === 'Small' ? 'selected' : ''}>S</option>
                        <option value="Medium" ${size === 'Medium' ? 'selected' : ''}>M</option>
                        <option value="Large" ${size === 'Large' ? 'selected' : ''}>L</option>
                    </select>
                </div>
            `).join('');

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="item-image" />
                <div class="item-details">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price}</p>
                    <div class="item-options">
                        <div class="size-selectors-container">${sizeSelectors}</div>
                        <div class="quantity-controls" data-index="${index}">
                            <button type="button" class="quantity-btn decrease" data-index="${index}">-</button>
                            <span class="quantity">${product.quantity}</span>
                            <button type="button" class="quantity-btn increase" data-index="${index}">+</button>
                        </div>
                    </div>
                </div>
                <div class="item-actions">
                    <p class="item-total">₱${lineTotal.toFixed(2)}</p>
                    <button type="button" class="remove-btn" data-index="${index}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;

            cartItemsContainer.appendChild(itemElement);
        });

        attachItemEventHandlers();
        updateSummary();
    }

    function updateSummary() {
        const subtotal = cart.reduce((sum, item) => {
            const price = parsePrice(item.price);
            return sum + price * (item.quantity || 1);
        }, 0);

        const deliveryFee = 0;

        subtotalElement.textContent = `₱${subtotal.toFixed(2)}`;
        if (deliveryElement) {
            deliveryElement.textContent = `₱${deliveryFee.toFixed(2)}`;
        }
        totalElement.textContent = `₱${(subtotal + deliveryFee).toFixed(2)}`;
    }

    function attachItemEventHandlers() {
        cartItemsContainer.querySelectorAll('.remove-btn').forEach((button) => {
            button.addEventListener('click', (event) => {
                const index = Number(event.currentTarget.dataset.index);
                if (Number.isNaN(index)) return;
                cart.splice(index, 1);
                saveCart();
                renderCart();
            });
        });

        cartItemsContainer.querySelectorAll('.quantity-btn').forEach((button) => {
            button.addEventListener('click', (event) => {
                const index = Number(event.currentTarget.dataset.index);
                if (Number.isNaN(index) || !cart[index]) return;

                const isIncrease = event.currentTarget.classList.contains('increase');
                
                if (isIncrease) {
                    cart[index].quantity++;
                    cart[index].sizes.push('Medium'); 
                } else {
                    cart[index].quantity--;
                    cart[index].sizes.pop();
                }

                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }

                saveCart();
                renderCart();
            });
        });

        cartItemsContainer.querySelectorAll('.size-select').forEach((select) => {
            select.addEventListener('change', (event) => {
                const index = Number(event.currentTarget.dataset.index);
                const sizeIndex = Number(event.currentTarget.dataset.sizeIndex);
                if (Number.isNaN(index) || !cart[index] || Number.isNaN(sizeIndex)) return;
                
                cart[index].sizes[sizeIndex] = event.currentTarget.value;
                saveCart();
            });
        });
    }

    initializeCart();
    renderCart();
});

