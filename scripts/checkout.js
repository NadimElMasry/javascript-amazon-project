import {cart, deleteFromCart, updateCartQuantity, updateDeliveryOption, calculateCartQuantity} from '../data/cart.js';
import {productsById} from '../data/products.js';
import {deliveryOptions, deliveryOptionsById, defaultDeliveryOption} from '../data/deliveryOptions.js';
import {calculatePaymentSummary} from './utils/payment.js';
import {formatCurrency} from './utils/money.js';
import {updateHeaderQuantity} from './ui/header.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

function renderOrderSummary() {
  let orderSummaryHTML = '';

  cart.forEach((cartItem) => {
    // productsById() is an imported lookup table (object) created from an array of ID-product pairs by using the .map() method on the products array on products.js
    const product = productsById[cartItem.id];
    const matchingItem = {
      ...product,
      quantity: cartItem.quantity
    };

    /* The following is a solution that nests products loop inside cart loop, and which carries O(nxm) penalty in larger data sets:
    
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

    /* The following is a solution that uses .find() method to get matching item instead of nesting loops, and which is still O(nxm) in the worst case:
    
    const product = products.find(p => p.id === cartItem.id);
    if (!product) return;
    const matchingItem = {
      ...product,
      quantity: cartItem.quantity
    };
    */

    // deliveryOptionsById() is an imported lookup table (object) created from an array of ID-product pairs by using the .map() method on the deliveryOptions array on deliveryOptions.js
    const deliveryOption = deliveryOptionsById[cartItem.deliveryOptionId] || defaultDeliveryOption;
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    orderSummaryHTML += `
      <div class="cart-item-container">
        <div class="delivery-date">
          Delivery date: ${dateString}
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
              <select class="update-quantity-selector js-update-quantity-selector-${matchingItem.id}">
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
              <span class="save-update-button js-save-update-quantity-${matchingItem.id}">
                Save
              </span>
              <span class="cancel-update-button js-cancel-update-quantity-${matchingItem.id}">
                Cancel
              </span>
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
            ${deliveryOptionsHTML(matchingItem, cartItem)}
          </div>
        </div>
      </div>
    `;
  });
  
  document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML;

  // Hooks the function renderOrderSummary() into displayCartDeletion() and displayUpdatedCart() 
  displayCartDeletion(renderOrderSummary);
  displayUpdatedCart(renderOrderSummary);
  chooseDeliveryOption(renderOrderSummary);
}

function renderPaymentSummary() {
  let paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (0):</div>
      <div class="payment-summary-money">$0.00</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$0.00</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$0.00</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$0.00</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$0.00</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  const itemQuantity = calculateCartQuantity();

  const orderPriceCents = calculatePaymentSummary();

  paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${itemQuantity}):</div>
      <div class="payment-summary-money">
        $${formatCurrency(orderPriceCents.totalMinusShipping)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">
        $${formatCurrency(orderPriceCents.shippingTotal)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
        $${formatCurrency(orderPriceCents.totalBeforeTax)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
        $${formatCurrency(orderPriceCents.tax)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">
        $${formatCurrency(orderPriceCents.totalAfterTax)}
      </div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;
  
  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  displayCartDeletion(renderPaymentSummary);
  displayUpdatedCart(renderPaymentSummary);
  chooseDeliveryOption(renderPaymentSummary);
}

function deliveryOptionsHTML(matchingItem, cartItem) {
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString = deliveryOption.priceCents === 0 
      ? 'FREE' 
      : `$${formatCurrency(deliveryOption.priceCents)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
    
    html += `
      <div class="delivery-option js-delivery-option" 
      data-delivery-option-id="${deliveryOption.id}" 
      data-cart-item-id="${cartItem.id}">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"          
          name="delivery-option-${matchingItem.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `;
  });

  return html;
}

function chooseDeliveryOption(onChoosingCallback) {
  const optionElements = document.querySelectorAll('.js-delivery-option');

  if (!optionElements || optionElements.length === 0) return;

  optionElements.forEach((optionElement) => {
    optionElement.addEventListener('click', () => {
      const {deliveryOptionId, cartItemId} = optionElement.dataset;

      updateDeliveryOption(cartItemId, deliveryOptionId);

      if (typeof onChoosingCallback === 'function') {
        onChoosingCallback();
      }
    });
  });
  
  /* The following is a different logic (kept here for future reference) that involved the class name `.js-delivery-option-${cartItem.id}` for the input element being generated in the above deliveryOptionHTML() function and a deliveryOptionId data attribute for that same radio input element, instead of the generic class name '.js-delivery-option' for the entire <div> wrapper element and the cartItemId and deliveryOptionId as data attributes for that same wrapper element:
  
  cart.forEach((cartItem) => {
    const radioElements = document.querySelectorAll(`.js-delivery-option-${cartItem.id}`);

    if (!radioElements || radioElements.length === 0) return;

    radioElements.forEach((radioElement) => {
      radioElement.addEventListener('change', () => {
        const {deliveryOptionId} = radioElement.dataset;

        updateDeliveryOption(cartItem.id, deliveryOptionId);

        if (typeof onChoosingCallback === 'function') {
          onChoosingCallback();
        }
      });
    });
  });
  */
}

function displayCartDeletion(onDeleteCallback) {
  const deleteElements = document.querySelectorAll('.js-delete-element');
    
  if (deleteElements.length === 0) return;
  
  deleteElements.forEach(deleteElement => {
    const {deletedItemId} = deleteElement.dataset;

    deleteElement.addEventListener('click', () => {
      deleteFromCart(deletedItemId);
      
      if (typeof onDeleteCallback === 'function') {
        onDeleteCallback();
      }

      updateHeaderQuantity();
    });
  });
}

function displayUpdatedCart(onUpdateCallback) {
  const updateElements = document.querySelectorAll('.js-update-element');

  if (updateElements.length === 0) return;

  updateElements.forEach((updateElement) => {
    const {updatedItemId} = updateElement.dataset;
    
    updateElement.addEventListener('click', () => {
      const quantitySelector = document.querySelector(`.js-update-quantity-selector-${updatedItemId}`);
      const saveElement = document.querySelector(`.js-save-update-quantity-${updatedItemId}`);
      const cancelElement = document.querySelector(`.js-cancel-update-quantity-${updatedItemId}`);
      const deleteElement = document.querySelector(`.js-delete-element[data-deleted-item-id="${updatedItemId}"]`);

      toggleButtonsDisplayed(true);

      function toggleButtonsDisplayed(isEditing = false) {
        if (isEditing === true) {
          quantitySelector.style.display = 'inline-block';
          saveElement.style.display = 'inline-block';
          cancelElement.style.display = 'inline-block';
          deleteElement.style.display = 'none';
          updateElement.style.display = 'none';
        } else {
          updateElement.style.display = 'inline-block';
          deleteElement.style.display = 'inline-block';
          quantitySelector.style.display = 'none';
          saveElement.style.display = 'none';
          cancelElement.style.display = 'none';
        }
      }

      saveElement.addEventListener('click', () => {
        const selectedUpdateQuantity = Number(quantitySelector.value);

        updateCartQuantity(updatedItemId, selectedUpdateQuantity);

        if (typeof onUpdateCallback === 'function') {
          onUpdateCallback();
        }

        updateHeaderQuantity();

        toggleButtonsDisplayed();
      });

      cancelElement.addEventListener('click', () => {
        toggleButtonsDisplayed();
      });
    });
  });
}

renderOrderSummary();
renderPaymentSummary();

updateHeaderQuantity();