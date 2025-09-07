export const deliveryOptions = [
  {
    id: '1',
    deliveryDays: 7,
    priceCents: 0
  },
  {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
  },
  {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
  }
];

// Lookup table (object) created from an array of ID-value pairs by using map() method on products array above, used to get product that matches cart item, and defined here in global scope to run on module load instead of looping with .map() inside other loops in files which import this object
export const deliveryOptionsById = Object.fromEntries(
  deliveryOptions.map(o => [o.id, o])
);

// Gets delivery option with priceCents value of 0, to avoid having to use index number [0] that may be corrupted with invalid data; also defined here in global scope (like the above lookup object) to avoid looping inside other loops
export const defaultDeliveryOption = deliveryOptions.find(o => o.priceCents === 0);