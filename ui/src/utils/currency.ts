export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const parseCurrency = (formattedAmount: string): number => {
  const cleanedString = formattedAmount.replace(/[₹,\s]/g, '');
  return parseFloat(cleanedString) || 0;
};
