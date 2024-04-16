// Default to USD locale for the scope of this challenge
export const formatMoney = (input, currency, minimumFractionDigits) => {
  const USDFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: minimumFractionDigits,
  }).format(input);
  return USDFormat;
};
