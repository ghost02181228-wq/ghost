import { CandleData, StockData } from './types';

// Environment Variable Handling
// We check standard process.env and Vite's import.meta.env to be robust
const getEnv = (key: string): string | undefined => {
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
     // @ts-ignore
    return process.env[key];
  }
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  return undefined;
};

export const FINNHUB_API_KEY = getEnv('VITE_FINNHUB_API_KEY');
export const FIREBASE_CONFIG_STRING = getEnv('VITE_FIREBASE_CONFIG_STRING');
export const GEMINI_API_KEY = getEnv('API_KEY');

export const IS_REAL_MODE = !!(FINNHUB_API_KEY || GEMINI_API_KEY);

// Mock Data Generators

export const generateMockStockData = (symbol: string): StockData => {
  const basePrice = Math.random() * 100 + 100; // 100-200 range
  return {
    c: basePrice,
    d: Math.random() * 5 - 2.5,
    dp: Math.random() * 2 - 1,
    h: basePrice + Math.random() * 2,
    l: basePrice - Math.random() * 2,
    o: basePrice - Math.random() * 1,
    pc: basePrice - 1,
  };
};

export const generateMockCandles = (count: number, startPrice: number = 150): CandleData[] => {
  let currentPrice = startPrice;
  const data: CandleData[] = [];
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  for (let i = count; i > 0; i--) {
    const volatility = currentPrice * 0.02;
    const change = (Math.random() - 0.5) * volatility;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 1000000) + 500000;

    data.push({
      time: now - i * oneDay,
      open,
      high,
      low,
      close,
      volume
    });
    currentPrice = close;
  }
  return data;
};

export const MOCK_ANALYSIS_RESPONSE = `[模擬模式分析]

**總結：**
該股票目前呈現強勁的多頭排列，技術指標 MACD 顯示買入訊號，RSI 位於 60 左右的健康區間，尚未進入超買區。

**投資建議：**
1. 短線操作：建議在回測 5 日均線時分批佈局。
2. 長線投資：基本面穩健，適合長期持有，目標價位可設定在近期高點突破後的 10% 漲幅。
3. 風險提示：需留意下週的財報發布以及聯準會的利率決策會議，可能會帶來短期波動。`;
