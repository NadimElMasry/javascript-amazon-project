const cart = JSON.parse(localStorage.getItem('cart')) || [];

export function addToCart() {
  document.querySelectorAll('.js-add-to-cart-button').forEach((addButton) => {
    addButton.addEventListener('click', () => {
      const productId = addButton.dataset.productId;

      const selectedQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

      /*
      const matchingItem = cart.find((cartItem) => {
        return cartItem.id === productId;
      });

      if (matchingItem) {
        matchingItem.quantity += 1;
      } else {
        cart.push({
          id: productId,
          quantity: 1
        });
      }
      */

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

      let totalQuantity = 0;
      cart.forEach((cartItem) => {
        totalQuantity += cartItem.quantity;
      });
      document.querySelector('.js-cart-quantity').innerHTML = totalQuantity;

      localStorage.setItem('cart', JSON.stringify(cart));
      console.log(cart);
    });
  })
}