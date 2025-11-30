import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export function calculateDeliveryDate(deliveryOption) {
  // The following is a solution that calculates calendar days, where weekends are skipped but still count towards the total delivery days, so if the deliveryDate lands on a weekend, it will be pushed 2 days or 1 day, depending on whether it's a Saturday or a Sunday. Either way, the deliveryDate will be a Monday.
  const today = dayjs();
  let deliveryDate = today;

  for (let i = 0; i < deliveryOption.deliveryDays; i++) {
    deliveryDate = deliveryDate.add(1, 'day');
  }

  if (deliveryDate.day() === 6) {
    deliveryDate = deliveryDate.add(2, 'day');
  }

  if (deliveryDate.day() === 0) {
    deliveryDate = deliveryDate.add(1, 'day');
  }

  return deliveryDate;
  
  // The following is a solution that calculates business days only, where weekends are entirely excluded and counting resumes on Monday.
  /*
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
  */
}