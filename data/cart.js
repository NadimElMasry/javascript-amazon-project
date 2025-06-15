const cart = JSON.parse(localStorage.getItem('cart')) || [];

export function addToCart() {
  document.querySelectorAll('.js-add-to-cart-button').forEach((addButton) => {
    addButton.addEventListener('click', () => {
      const productId = addButton.dataset.productId;
      cart.push({
        id: productId,
        quantity: 1
      });      
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log(cart);
    });
  })
}