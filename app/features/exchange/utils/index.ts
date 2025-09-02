const normalizeAmount = (amount: string) => {
  return amount.replace(',', '.');
};

export { normalizeAmount };
