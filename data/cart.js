export const cart = JSON.parse(localStorage.getItem('cart')) || [];

updateQuantityElement();

export function addToCart() {
  document.querySelectorAll('.js-add-to-cart-button').forEach((addButton) => {
    addButton.addEventListener('click', () => {
      // const productId = addButton.dataset.productId;
      const {productId} = addButton.dataset;


      // Gets value out of HTML dropdown selector
      const selectedQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);


      // Uses .find() method to get matching item instead of looping
      /*
      const matchingItem = cart.find((cartItem) => {
        return cartItem.id === productId;
      });

      if (matchingItem) {
        matchingItem.quantity += selectedQuantity;
      } else {
        cart.push({
          id: productId,
          quantity: selectedQuantity
        });
      }
      */


      // Loops through cart to find matching IDs to accurately update quantity
      let matchingItem;
      cart.forEach((cartItem) => {
        if (cartItem.id === productId) {
          matchingItem = cartItem;
        }
      });

      if (matchingItem) {
        matchingItem.quantity += selectedQuantity;
      } else {
        cart.push({
          id: productId,
          quantity: selectedQuantity
        });
      }


      updateQuantityElement();


      saveToStorage();


      // Displays "Added" message upon clicking button
      const addedMessage = document.querySelector(`.js-added-message-${productId}`);
      addedMessage.classList.add('added-message-visible');
      setTimeout(() => {
        addedMessage.classList.remove('added-message-visible');
      }, 2000);
    });
  })
}

function updateQuantityElement() {
  const quantityElement = document.querySelector('.js-cart-quantity');
  
  // Guards updateQuantityElement() call within module scope so that it only runs where DOM element exists
  if (!quantityElement) return;
  
  let totalQuantity = 0;
  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });
  quantityElement.innerHTML = totalQuantity;
}

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}