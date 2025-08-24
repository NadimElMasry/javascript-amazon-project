import {calculateCartQuantity} from "../../data/cart.js";

export function updateHeaderQuantity(selector = '.js-cart-total-quantity') {
  const elements = document.querySelectorAll(selector);
  
  if (elements.length === 0) return;
  
  const totalQuantity = calculateCartQuantity();

  elements.forEach((quantityElement) => {
    const {format} = quantityElement.dataset;

    // Updates quantity DOM element according to data attribute
    if (format === 'item-count') {
      quantityElement.innerHTML = `${totalQuantity} item${totalQuantity === 1 ? '' : 's'}`;
    } else {
      quantityElement.innerHTML = totalQuantity;
    }
  });
}