import {cart, deleteFromCart, updateCartQuantity, updateHeaderQuantity} from '../data/cart.js';
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
              <span class="update-quantity-link link-primary js-update-element" 
              data-updated-item-id="${matchingItem.id}">
                Update
              </span>
              <select class="quantity-selector js-update-quantity-selector-${matchingItem.id}">
                <option value="1" ${matchingItem.quantity === 1 ? 'selected' : ''}>1</option>
                <option value="2" ${matchingItem.quantity === 2 ? 'selected' : ''}>2</option>
                <option value="3" ${matchingItem.quantity === 3 ? 'selected' : ''}>3</option>
                <option value="4" ${matchingItem.quantity === 4 ? 'selected' : ''}>4</option>
                <option value="5" ${matchingItem.quantity === 5 ? 'selected' : ''}>5</option>
                <option value="6" ${matchingItem.quantity === 6 ? 'selected' : ''}>6</option>
                <option value="7" ${matchingItem.quantity === 7 ? 'selected' : ''}>7</option>
                <option value="8" ${matchingItem.quantity === 8 ? 'selected' : ''}>8</option>
                <option value="9" ${matchingItem.quantity === 9 ? 'selected' : ''}>9</option>
                <option value="10" ${matchingItem.quantity === 10 ? 'selected' : ''}>10</option>
              </select>
              <span class="delete-quantity-link link-primary js-delete-element" 
              data-deleted-item-id="${matchingItem.id}">
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

  // Hooks the function renderOrderSummary() into deleteFromCart() and updateCartQuantity() 
  renderCartDeletion(renderOrderSummary);
  renderUpdatedCart(renderOrderSummary);
}

function renderCartDeletion(onDeleteCallback) {
  const deleteElements = document.querySelectorAll('.js-delete-element');
    
  if (deleteElements.length === 0) return;
  
  deleteElements.forEach(deleteElement => {
    const {deletedItemId} = deleteElement.dataset;

    deleteElement.addEventListener('click', () => {
      deleteFromCart(deletedItemId);
      
      // Hooked callback that lets us avoid having to import the renderOrderSummary() function from checkout.js (the rendering layer) into cart.js (the data layer), thus reducing dependency of the cart.js data logic on the DOM-related code from checkout.js and maintaining cleaner separation of concerns between logic and presentation
      if (typeof onDeleteCallback === 'function') {
        onDeleteCallback();
      }

      updateHeaderQuantity();
    });
  });
}

function renderUpdatedCart(onUpdateCallback) {
  const updateElements = document.querySelectorAll('.js-update-element');

  if (updateElements.length === 0) return;

  updateElements.forEach((updateElement) => {
    const {updatedItemId} = updateElement.dataset;
    
    updateElement.addEventListener('click', () => {
      const selectedUpdateQuantity = Number(document.querySelector(`.js-update-quantity-selector-${updatedItemId}`).value);

      updateCartQuantity(updatedItemId, selectedUpdateQuantity);

      if (typeof onUpdateCallback === 'function') {
        onUpdateCallback();
      }

      updateHeaderQuantity();
    });
  });
}

renderOrderSummary();

updateHeaderQuantity();