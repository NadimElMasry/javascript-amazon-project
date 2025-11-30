import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export function calculateDeliveryDate(deliveryOption) {
  const today = dayjs();
  let deliveryDate = today;
  let remainingDays = deliveryOption.deliveryDays;
  
  while (remainingDays > 0) {
    deliveryDate = deliveryDate.add(1, 'day');

    const weekday = deliveryDate.day();    
    if (weekday !== 0 && weekday !== 6) {
      remainingDays--;
    }
  }

  return deliveryDate;
}