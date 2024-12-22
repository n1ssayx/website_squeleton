// Select relevant elements
let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelectorAll('.products .fig');
let listCartHTML = document.querySelector('.listCart');
let iconCartspan = document.querySelector('.icon-cart span');
let cartTotalHTML;

let carts = []; 


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});


listProductHTML.forEach((product, index) => {
    product.querySelector('.addCart').addEventListener('click', () => {
        const productDetails = {
            id: index + 1,
            name: product.querySelector('img').alt,
            price: parseFloat(product.querySelector('p').innerText.replace('$', '')),
            image: product.querySelector('img').src
        };
        addToCart(productDetails);
    });
});


const addToCart = (product) => {
    let existingProductIndex = carts.findIndex((item) => item.id === product.id);

    if (existingProductIndex !== -1) {
        
        carts[existingProductIndex].quantity += 1;
    } else {
        
        carts.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    renderCart();
};


const updateCartCount = () => {
    const totalItems = carts.reduce((total, item) => total + item.quantity, 0);
    iconCartspan.textContent = totalItems;
};


const renderCart = () => {
    listCartHTML.innerHTML = '';

    carts.forEach((item) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('item');
        cartItem.innerHTML = `
            <div class="image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="name">${item.name}</div>
            <div class="totalPrice">$${(item.price * item.quantity).toFixed(2)}</div>
            <div class="quantity">
                <span class="minus" data-id="${item.id}">&lt;</span>
                <span>${item.quantity}</span>
                <span class="plus" data-id="${item.id}">&gt;</span>
            </div>
        `;
        listCartHTML.appendChild(cartItem);
    });


    document.querySelectorAll('.minus').forEach((button) => {
        button.addEventListener('click', () => {
            adjustQuantity(parseInt(button.dataset.id), -1);
        });
    });

    document.querySelectorAll('.plus').forEach((button) => {
        button.addEventListener('click', () => {
            adjustQuantity(parseInt(button.dataset.id), 1);
        });
    });

    renderTotalPrice(); 
};


const adjustQuantity = (productId, change) => {
    let productIndex = carts.findIndex((item) => item.id === productId);

    if (productIndex !== -1) {
        carts[productIndex].quantity += change;

        if (carts[productIndex].quantity <= 0) {
            carts.splice(productIndex, 1); 
        }

        updateCartCount();
        renderCart();
    }
};


const renderTotalPrice = () => {
    if (cartTotalHTML) {
        cartTotalHTML.remove();
    }

    const totalPrice = carts.reduce((total, item) => total + item.price * item.quantity, 0);
    cartTotalHTML = document.createElement('div');
    cartTotalHTML.classList.add('cart-total');
    cartTotalHTML.innerHTML = `<h3>Total: $${totalPrice.toFixed(2)}</h3>`;
    listCartHTML.appendChild(cartTotalHTML);
};


updateCartCount();
