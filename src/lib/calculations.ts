import { CalculationInput, CalculationOption, CalculationResult, MarketPrice } from '@/types';

export function calculateOptions(
  input: CalculationInput,
  prices: MarketPrice
): CalculationResult {
  const options: CalculationOption[] = [];

  // Calculate for each scenario
  const scenarios = [
    { market: 'A' as const, timing: 'now' as const, days: 0, price: prices.market_a_price_today },
    { market: 'B' as const, timing: 'now' as const, days: 0, price: prices.market_b_price_today },
    { market: 'A' as const, timing: '7days' as const, days: 7, price: prices.market_a_price_7days },
    { market: 'B' as const, timing: '7days' as const, days: 7, price: prices.market_b_price_7days },
  ];

  for (const scenario of scenarios) {
    // Calculate storage loss
    const lossRate = input.storageLossPercent / 100;
    const storageLoss = input.quantityKg * lossRate * scenario.days;
    const usableQty = Math.max(0, input.quantityKg - storageLoss);

    // Calculate transport cost
    const distance = scenario.market === 'A' ? input.distanceMarketA : input.distanceMarketB;
    const transportCost = distance * input.transportCostPerKm;

    // Calculate revenue
    const grossRevenue = usableQty * scenario.price;
    const netRevenue = grossRevenue - transportCost;

    const label = `Sell ${scenario.timing === 'now' ? 'Now' : 'in 7 Days'} → Market ${scenario.market}`;

    options.push({
      market: scenario.market,
      timing: scenario.timing,
      label,
      usableQty,
      pricePerKg: scenario.price,
      grossRevenue,
      transportCost,
      storageLoss,
      netRevenue
    });
  }

  // Find best option
  const bestOption = options.reduce((best, current) => 
    current.netRevenue > best.netRevenue ? current : best
  );

  return {
    options,
    bestOption,
    input
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(num: number, decimals = 1): string {
  return num.toFixed(decimals);
}
