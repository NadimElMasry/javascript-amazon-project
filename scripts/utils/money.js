export function formatCurrency(value) {
  return (Math.round(value) / 100).toFixed(2);
}