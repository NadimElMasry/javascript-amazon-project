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
      quantity: selectedQuantity
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

export function updateHeaderQuantity(selector = '.js-cart-total-quantity') {
  const elements = document.querySelectorAll(selector);
  
  if (elements.length === 0) return;
  
  let totalQuantity = 0;
  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });

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

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function deleteFromCart(onDeleteCallback, elementClass = '.js-delete-element') {
  const deleteElements = document.querySelectorAll(elementClass);
  
  if (deleteElements.length === 0) return;
  
  deleteElements.forEach(deleteElement => {
    const {deletedItemId} = deleteElement.dataset;

    deleteElement.addEventListener('click', () => {
      // Finds index of first item with matching IDs and remove it from cart array
      const index = cart.findIndex(cartItem => cartItem.id === deletedItemId);
      if (index !== -1) {          
        cart.splice(index, 1);
        saveToStorage();

        // Hooked callback that lets us avoid having to import the renderOrderSummary() function from checkout.js (the rendering layer) into cart.js (the data layer), thus reducing dependency of the cart.js data logic on the DOM-related code from checkout.js and maintaining cleaner separation of concerns between logic and presentation
        if (typeof onDeleteCallback === 'function') {
          onDeleteCallback();
        }

        updateHeaderQuantity();
      }      
    });
  });
}

export function updateCartQuantity(itemId, updatedQuantity) {
  if (!Number.isFinite(updatedQuantity) || updatedQuantity <= 0) return;

  const matchingItem = cart.find(cartItem => cartItem.id === itemId);

  if (matchingItem) {
    matchingItem.quantity = updatedQuantity;
    saveToStorage();
  }
}