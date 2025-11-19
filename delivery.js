document.addEventListener('DOMContentLoaded', () => {
    const subtotalElement = document.getElementById('subtotal');
    const deliveryElement = document.getElementById('delivery');
    const totalElement = document.getElementById('total');
    const cartItemsSummaryContainer = document.getElementById('cart-items-summary');

    const cashOnDeliveryBtn = document.getElementById('cash-on-delivery-btn');
    const onlinePaymentBtn = document.getElementById('online-payment-btn');
    const cardPaymentForm = document.getElementById('card-payment-form');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    function parsePrice(value) {
        const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ''));
        return Number.isNaN(numeric) ? 0 : numeric;
    }

    function renderOrderSummary() {
        cartItemsSummaryContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsSummaryContainer.innerHTML = '<p>No items in cart.</p>';
            return;
        }

        cart.forEach(product => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';

            itemElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="item-image">
                <div class="item-details">
                    <h3>${product.name}</h3>
                    <p>Qty: ${product.quantity}</p>
                    <p>Price: ${product.price}</p>
                </div>
            `;
            cartItemsSummaryContainer.appendChild(itemElement);
        });

        updateSummary();
    }

    function updateSummary() {
        const subtotal = cart.reduce((sum, item) => {
            const price = parsePrice(item.price);
            return sum + price * (item.quantity || 1);
        }, 0);

        const deliveryFee = 250;

        subtotalElement.textContent = `₱${subtotal.toFixed(2)}`;
        deliveryElement.textContent = `₱${deliveryFee.toFixed(2)}`;
        totalElement.textContent = `₱${(subtotal + deliveryFee).toFixed(2)}`;
    }

    cashOnDeliveryBtn.addEventListener('click', () => {
        cashOnDeliveryBtn.classList.add('active');
        onlinePaymentBtn.classList.remove('active');
        cardPaymentForm.style.display = 'none';
    });

    onlinePaymentBtn.addEventListener('click', () => {
        onlinePaymentBtn.classList.add('active');
        cashOnDeliveryBtn.classList.remove('active');
        cardPaymentForm.style.display = 'block';
    });

    renderOrderSummary();
});
