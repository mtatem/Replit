// Realistic cryptocurrency price chart data generator
export interface PricePoint {
  time: string;
  price: number;
  volume: number;
}

export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function generatePriceHistory(
  basePrice: number,
  periods: number = 24,
  volatility: number = 0.02
): PricePoint[] {
  const data: PricePoint[] = [];
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = periods - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    
    // Generate realistic price movement
    const change = (Math.random() - 0.5) * 2 * volatility;
    currentPrice = currentPrice * (1 + change);
    
    // Generate volume (higher volume during price movements)
    const baseVolume = Math.random() * 1000000;
    const volumeMultiplier = 1 + Math.abs(change) * 10;
    const volume = baseVolume * volumeMultiplier;

    data.push({
      time: time.toISOString(),
      price: currentPrice,
      volume: volume,
    });
  }

  return data;
}

export function generateCandlestickData(
  basePrice: number,
  periods: number = 100,
  volatility: number = 0.03
): CandlestickData[] {
  const data: CandlestickData[] = [];
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = periods - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 15 * 60 * 1000); // 15-minute intervals
    
    const open = currentPrice;
    
    // Generate high/low based on volatility
    const range = open * volatility;
    const high = open + Math.random() * range;
    const low = open - Math.random() * range;
    
    // Generate close price
    const close = low + Math.random() * (high - low);
    currentPrice = close;
    
    // Generate volume
    const volume = Math.random() * 500000 + 100000;

    data.push({
      time: time.toISOString(),
      open,
      high,
      low,
      close,
      volume,
    });
  }

  return data;
}

export function generateOrderBookData() {
  const basePrice = 42000; // Example BTC price
  const spread = 0.001; // 0.1% spread
  
  const bids = [];
  const asks = [];
  
  // Generate bid orders (buy orders below current price)
  for (let i = 0; i < 20; i++) {
    const price = basePrice * (1 - spread - (i * 0.0001));
    const amount = Math.random() * 2 + 0.1;
    bids.push({ price, amount, total: price * amount });
  }
  
  // Generate ask orders (sell orders above current price)
  for (let i = 0; i < 20; i++) {
    const price = basePrice * (1 + spread + (i * 0.0001));
    const amount = Math.random() * 2 + 0.1;
    asks.push({ price, amount, total: price * amount });
  }
  
  return { bids, asks };
}

export function generateRecentTrades() {
  const basePrice = 42000;
  const trades = [];
  const now = new Date();
  
  for (let i = 0; i < 50; i++) {
    const time = new Date(now.getTime() - i * 30000); // 30 seconds apart
    const price = basePrice * (1 + (Math.random() - 0.5) * 0.001);
    const amount = Math.random() * 1 + 0.01;
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    
    trades.push({
      time: time.toISOString(),
      price,
      amount,
      side,
      total: price * amount,
    });
  }
  
  return trades;
}

export const marketStats = {
  '24hVolume': '$28,500,000,000',
  '24hChange': '+3.45%',
  '24hHigh': '$43,250.00',
  '24hLow': '$40,150.00',
  'marketCap': '$823,000,000,000',
  'circulatingSupply': '19,500,000 BTC',
};

export const tradingPairs = [
  { symbol: 'BTC/USD', price: 42156.78, change: 3.45, volume: '28.5B' },
  { symbol: 'ETH/USD', price: 2843.67, change: -1.23, volume: '15.8B' },
  { symbol: 'SOL/USD', price: 89.43, change: 7.89, volume: '2.1B' },
  { symbol: 'DOGE/USD', price: 0.0847, change: 12.34, volume: '890M' },
  { symbol: 'ADA/USD', price: 0.4521, change: 5.67, volume: '1.2B' },
  { symbol: 'MATIC/USD', price: 0.8934, change: -2.34, volume: '456M' },
];

export function getAutomationRuleDescription(type: string) {
  switch (type) {
    case 'meme':
      return {
        title: 'Meme Coin Strategy',
        description: 'Aggressive profit-taking for volatile meme coins. Designed to capture quick gains while protecting against sudden dumps.',
        riskLevel: 'High',
        recommendedTarget: '50%',
        recommendedStopLoss: '20%',
      };
    case 'altcoin':
      return {
        title: 'Altcoin Strategy',
        description: 'Balanced approach for alternative cryptocurrencies. Balances growth potential with risk management.',
        riskLevel: 'Medium',
        recommendedTarget: '100%',
        recommendedStopLoss: '30%',
      };
    case 'major':
      return {
        title: 'Major Coins (BTC/ETH/SOL)',
        description: 'Conservative strategy for established cryptocurrencies. Long-term focused with minimal interference.',
        riskLevel: 'Low',
        recommendedTarget: '200%',
        recommendedStopLoss: '50%',
      };
    default:
      return {
        title: 'Custom Strategy',
        description: 'Custom automation rules',
        riskLevel: 'Unknown',
        recommendedTarget: '0%',
        recommendedStopLoss: '0%',
      };
  }
}
