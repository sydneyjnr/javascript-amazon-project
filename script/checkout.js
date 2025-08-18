import { cart, removeFromCart, updateQuantity, updateDeliveryOption } from "../data/cart.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
let cartSummaryHTML = "";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js"
 
cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;
  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  const deliveryOptionId = cartItem.deliveryOptionId;

  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });
   const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

  cartSummaryHTML += ` <div class="cart-item-container js-cart-item-container-${
    matchingProduct.id
  }">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${
                      cartItem.quantity
                    }</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id=${
                    matchingProduct.id
                  }>
                    Update
                  </span>
                  <input class="quantity-input">
                  <span class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id='${
                    matchingProduct.id
                  }'>
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>                
                
                ${deliveryOptionsHTML(matchingProduct, cartItem)}

              </div>
            </div>
          </div>`;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );
    const priceSting = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;
    
    const isChecked = String(deliveryOption.id) === String(cartItem.deliveryOptionId);


    html += `
    <div class="delivery-option js-delivery-options"
    data-product-id='${matchingProduct.id}'
    data-delivery-option-id='${deliveryOption.id}'>
        <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceSting} - Shipping
          </div>
        </div>
      </div>
    `

  });
  return html;
}

document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

let cartQuantity = 0;

cart.forEach((cartItem) => {
  cartQuantity += cartItem.quantity;
});
document.querySelector(".return-to-home-link").innerHTML =
  cartQuantity + " " + "items";
if (cartQuantity === 1) {
  document.querySelector(".return-to-home-link").innerHTML =
    cartQuantity + " " + "item";
} else {
  document.querySelector(".return-to-home-link").innerHTML =
    cartQuantity + " " + "items";
}

function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  document.querySelector(".return-to-home-link").innerHTML =
    cartQuantity + " " + "items";
}

document.querySelectorAll(".js-delete-quantity-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;

    removeFromCart(productId);
    let pickedCart = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    pickedCart.remove();

    updateCartQuantity();
  });
});

document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
     const container = document.querySelector(`.js-cart-item-container-${productId}`);

    container.classList.add("is-editing-quantity");
  });
});


document.querySelectorAll(".save-quantity-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
     const container = document.querySelector(`.js-cart-item-container-${productId}`);

    
    const quantityInput = container.querySelector(".quantity-input");

    
    const newQuantity = Number(quantityInput.value);
    updateQuantity(productId, newQuantity);
    container.classList.remove("is-editing-quantity");
  });
});

document.querySelectorAll('.js-delivery-options')
  .forEach((element) => {
    element.addEventListener('click', () => {
      const productId = element.dataset.productId;
      const deliveryOptionId = element.dataset.deliveryOptionId;
      updateDeliveryOption(productId, deliveryOptionId);
    });
  });