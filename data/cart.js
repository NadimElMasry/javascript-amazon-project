const cart = JSON.parse(localStorage.getItem('cart')) || [];

export function addToCart() {
  document.querySelectorAll('.js-add-to-cart-button').forEach((addButton) => {
    addButton.addEventListener('click', () => {
      // const productId = addButton.dataset.productId;
      const {productId} = addButton.dataset;

      // Gets value out of HTML dropdown selector
      const selectedQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

      // Uses .find() method to get matching IDs instead of looping
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

      // Increments quantity or adds new item
      if (matchingItem) {
        matchingItem.quantity += selectedQuantity;
      } else {
        cart.push({
          id: productId,
          quantity: selectedQuantity
        });
      }

      // Updates quantity displayed in homepage cart
      let totalQuantity = 0;
      cart.forEach((cartItem) => {
        totalQuantity += cartItem.quantity;
      });
      document.querySelector('.js-cart-quantity').innerHTML = totalQuantity;

      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Displays "Added" message upon clicking button
      document.querySelector(`.js-added-message-${productId}`).classList.add('added-message-visible');
    });
  })
}