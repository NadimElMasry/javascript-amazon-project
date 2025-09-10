import {products} from '../data/products.js';
import {modifyCart} from '../data/cart.js';
import {formatCurrency} from './utils/money.js';
import {updateHeaderQuantity} from './ui/header.js';

function renderProductsGrid() {
  let productsGridHTML = '';
  products.forEach((product) => {
    const html = `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${formatCurrency(product.priceCents)}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector" data-product-id="${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-message-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart-button" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;

    productsGridHTML += html;
  });

  document.querySelector('.js-products-grid').innerHTML = productsGridHTML;
}

function addToCart() {  
  document.querySelectorAll('.js-add-to-cart-button').forEach((addButton) => {
    addButton.addEventListener('click', () => {
      const {productId} = addButton.dataset;

      // Gets value out of HTML dropdown selector
      // The `.class-name[data=value]` syntax acts like an AND operator, which in this case guards against the possibility of a product ID containing invalid characters, since CSS class selectors are case sensitive and invalid characters (e.g. spaces) might break the CSS class name, so in this case we are keeping the product ID in a separate data attribute instead of in the class name; and since we wish to select the quantity for one product in particular, the product ID in the data attribute adds an extra condition to make sure that both the class name ('.js-quantity-selector') and the data attribute (now with product ID as a value) are both present at the same time
      const selectedQuantity = Number(document.querySelector(`.js-quantity-selector[data-product-id="${productId}"]`).value);

      modifyCart(productId, selectedQuantity);

      updateHeaderQuantity();
      
      displayAddedMessage(productId);
    });
  })
}

// Timeout registry object declared globally to manage timeouts for the displayAddedMessage() function below, by storing timeout IDs as values corresponding with their own productId keys
const messageTimeouts = {};

function displayAddedMessage(productId) {
  const addedMessage = document.querySelector(`.js-added-message-${productId}`);

  addedMessage.classList.add('added-message-visible');
  
  // When the button corresponding to the productId is clicked for the first time, the IF condition below looks for the productId property key inside the messageTimeouts object and doesn't find it, therefore skipping the clearTimeout code inside the IF statement, and then goes on to define "messageTimeouts[productId] = ..." with a new timeout numeric ID as a value (e.g. ID = 401) which corresponds to "setTimeout(() => {...}, 2000)", setting a timer to 2 seconds in the process.
  // Upon clicking a second time before 2 seconds have passed, the 401 callback code inside "setTimeout(() => {...}, 2000)" hasn't run yet by then, but this time the IF condition does indeed find the productId property key, and so the clearTimeout code runs (clearing the old 401 timer) and the code inside the setTimeout callback never runs, but rather resets, setting a new timer to 2 seconds with a new timer ID (e.g. 402) stored inside messageTimeouts[productId].
  // If we click a third time afterwards, but this time after 2 seconds have passed, the 402 timer has already fired by then, which means that the code inside the setTimeout callback would have finished running, clearing the 402 timer automatically from the browser's timer table and triggering the .remove() inside the callback.
  // The line of code "delete messageTimeouts[productId]" inside the setTimeout callback additionally ensures that the stale key-value pair {productId: 402} is also removed from the messageTimeouts object, although this is optional because the leftover timeout ID is harmless in small projects and silently does nothing upon clicking again.
  // Any fourth click would be like clicking for the first time.
  if (messageTimeouts[productId]) {
    clearTimeout(messageTimeouts[productId]);
  }
  
  messageTimeouts[productId] = setTimeout(() => {
    addedMessage.classList.remove('added-message-visible');
    delete messageTimeouts[productId];
  }, 2000);
}

renderProductsGrid();

addToCart();

updateHeaderQuantity();