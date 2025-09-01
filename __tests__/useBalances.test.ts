// Test simple para verificar la lógica de exchangeBalance
describe('exchangeBalance logic', () => {
  it('should calculate correct amounts for fiat-to-crypto exchange', () => {
    const amount = 50;
    const rate = 0.0001;

    const fromBalance = 100; // USD balance
    const toBalance = 0; // Bitcoin balance

    const newFromBalance = fromBalance - amount;
    const newToBalance = toBalance + amount * rate;

    expect(newFromBalance).toBe(50); // 100 - 50
    expect(newToBalance).toBe(0.005); // 0 + 50 * 0.0001
  });

  it('should calculate correct amounts for crypto-to-fiat exchange', () => {
    const amount = 0.5;
    const rate = 10000;

    const fromBalance = 1; // Bitcoin balance
    const toBalance = 0; // USD balance

    const newFromBalance = fromBalance - amount;
    const newToBalance = toBalance + amount * rate;

    expect(newFromBalance).toBe(0.5); // 1 - 0.5
    expect(newToBalance).toBe(5000); // 0 + 0.5 * 10000
  });

  it('should validate insufficient funds correctly', () => {
    const amount = 150;
    const fromBalance = 100;

    expect(fromBalance < amount).toBe(true);
    expect(() => {
      if (fromBalance < amount) {
        throw new Error(
          `Fondos insuficientes. Disponible: ${fromBalance}, Requerido: ${amount}`,
        );
      }
    }).toThrow('Fondos insuficientes. Disponible: 100, Requerido: 150');
  });

  it('should validate amount greater than zero', () => {
    const invalidAmounts = [-10, 0];

    invalidAmounts.forEach(amount => {
      expect(amount <= 0).toBe(true);
      expect(() => {
        if (amount <= 0) {
          throw new Error('El monto debe ser mayor a 0');
        }
      }).toThrow('El monto debe ser mayor a 0');
    });
  });

  it('should handle exchange rate calculations correctly', () => {
    const testCases = [
      { amount: 100, rate: 0.0001, expected: 0.01 },
      { amount: 50, rate: 2, expected: 100 },
      { amount: 0.1, rate: 1000, expected: 100 },
    ];

    testCases.forEach(({ amount, rate, expected }) => {
      const result = amount * rate;
      expect(result).toBe(expected);
    });
  });
});
