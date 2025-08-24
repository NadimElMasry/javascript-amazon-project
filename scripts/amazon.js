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
          <select class="js-quantity-selector-${product.id}">
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
      const selectedQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

      modifyCart(productId, selectedQuantity);

      updateHeaderQuantity();
      
      displayAddedMessage(productId);
    });
  })
}

function displayAddedMessage(productId) {
  const addedMessage = document.querySelector(`.js-added-message-${productId}`);
  addedMessage.classList.add('added-message-visible');
  setTimeout(() => {
    addedMessage.classList.remove('added-message-visible');
  }, 2000);
}

renderProductsGrid();

addToCart();

updateHeaderQuantity();