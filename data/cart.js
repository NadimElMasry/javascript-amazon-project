export const cart = JSON.parse(localStorage.getItem('cart')) || [];

export function modifyCart(productId, selectedQuantity) {
  if (!Number.isFinite(selectedQuantity) || selectedQuantity <= 0) return;

  // Loops through cart to find matching IDs to accurately update quantity
  let matchingItem;
  cart.forEach((cartItem) => {
    if (cartItem.id === productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += selectedQuantity;
    saveToStorage();
  } else {
    cart.push({
      id: productId,
      quantity: selectedQuantity,
      deliveryOptionId: '1'
    });
    saveToStorage();
  }

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
}

export function calculateCartQuantity() {
  let totalQuantity = 0;
  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });
  return totalQuantity;
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function deleteFromCart(itemId) {
  // Finds index of first item with matching IDs and remove it from cart array
  const index = cart.findIndex(cartItem => cartItem.id === itemId);
  if (index !== -1) {          
    cart.splice(index, 1);
    saveToStorage();    
  } 
}

export function updateCartQuantity(itemId, updatedQuantity) {
  if (!Number.isFinite(updatedQuantity) || updatedQuantity <= 0) return;

  const matchingItem = cart.find(cartItem => cartItem.id === itemId);

  if (matchingItem) {
    matchingItem.quantity = updatedQuantity;
    saveToStorage();
  }
}

export function updateDeliveryOption(itemId, deliveryOptionId) {
  const matchingItem = cart.find(item => item.id === itemId);

  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToStorage();
  }
}