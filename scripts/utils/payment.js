import {cart} from '../../data/cart.js';
import {products} from '../../data/products.js';
import {deliveryOptions} from '../../data/deliveryOptions.js';

export function calculatePaymentSummary() {
  const orderPriceCents = {
    totalMinusShipping: 0,
    shippingTotal: 0,
    totalBeforeTax: 0,
    tax: 0,
    totalAfterTax: 0
  };

  cart.forEach((cartItem) => {
    const matchingProduct = products.find(product => cartItem.id === product.id);
    const matchingOption = deliveryOptions.find(option => cartItem.deliveryOptionId === option.id);

    orderPriceCents.totalMinusShipping += cartItem.quantity * matchingProduct.priceCents;
    orderPriceCents.shippingTotal += matchingOption.priceCents;    
  });

  orderPriceCents.totalBeforeTax = orderPriceCents.totalMinusShipping + orderPriceCents.shippingTotal;
  orderPriceCents.tax = orderPriceCents.totalBeforeTax * 0.1;
  orderPriceCents.totalAfterTax = orderPriceCents.totalBeforeTax + orderPriceCents.tax;

  return orderPriceCents;
}