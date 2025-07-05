import {cart, deleteFromCart, updateQuantityElement} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

function renderOrderSummary() {
  let orderSummaryHTML = '';

  // Builds lookup object from an array of ID-product pairs (entries)
  const productsById = Object.fromEntries(
    products.map(p => [p.id, p])
  );

  cart.forEach((cartItem) => {
    // Gets matching item from lookup object created above instead of looping through products array
    const product = productsById[cartItem.id];
    const matchingItem = {
      ...product,
      quantity: cartItem.quantity
    };


    // Solution that nests products loop inside cart loop, carries O(nxm) penalty in larger data sets
    /*
    let matchingItem; // Declared inside loop so that it resets each time and doesn't carry stale value from previous iteration whenever cartItem.id and product.id do not match

    products.forEach((product) => {
      if (cartItem.id === product.id) {
        // Creates copy of matching product to avoid mutating original products array (Remember: objects are references)
        const productCopy = {
          ...product,
          quantity: cartItem.quantity
        };
        matchingItem = productCopy;
      }
    });
    */


    // Solution that uses .find() method to get matching item instead of nesting loops, still O(m) in the worst case
    /*
    const product = products.find(p => p.id === cartItem.id);
    if (!product) return;
    const matchingItem = {
      ...product,
      quantity: cartItem.quantity
    };
    */

    orderSummaryHTML += `
      <div class="cart-item-container">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingItem.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingItem.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingItem.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${matchingItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary">
                Update
              </span>
              <span class="delete-quantity-link link-primary js-delete-element" data-deleted-item-id="${matchingItem.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            <div class="delivery-option">
              <input type="radio" checked
                class="delivery-option-input"
                name="delivery-option-${matchingItem.id}">
              <div>
                <div class="delivery-option-date">
                  Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                  FREE Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingItem.id}">
              <div>
                <div class="delivery-option-date">
                  Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                  $4.99 - Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingItem.id}">
              <div>
                <div class="delivery-option-date">
                  Monday, June 13
                </div>
                <div class="delivery-option-price">
                  $9.99 - Shipping
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML;

  // Hooks the function renderOrderSummary() into deleteFromCart() 
  deleteFromCart(renderOrderSummary);
}

renderOrderSummary();

updateQuantityElement();