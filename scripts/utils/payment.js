import {cart} from '../../data/cart.js';
import {productsById} from '../../data/products.js';
import {deliveryOptionsById, defaultDeliveryOption} from '../../data/deliveryOptions.js';

export function calculatePaymentSummary() {
  const orderPriceCents = {
    totalMinusShipping: 0,
    shippingTotal: 0,
    totalBeforeTax: 0,
    tax: 0,
    totalAfterTax: 0
  };

  cart.forEach((cartItem) => {
    const matchingProduct = productsById[cartItem.id];
    const matchingOption = deliveryOptionsById[cartItem.deliveryOptionId] || defaultDeliveryOption;

    orderPriceCents.totalMinusShipping += cartItem.quantity * matchingProduct.priceCents;
    orderPriceCents.shippingTotal += matchingOption.priceCents;    
  });

  orderPriceCents.totalBeforeTax = orderPriceCents.totalMinusShipping + orderPriceCents.shippingTotal;
  orderPriceCents.tax = orderPriceCents.totalBeforeTax * 0.1;
  orderPriceCents.totalAfterTax = orderPriceCents.totalBeforeTax + orderPriceCents.tax;

  return orderPriceCents;
}