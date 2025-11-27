// Data Models

export interface StockData {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice?: number;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  price: number;
  quantity: number;
  timestamp: number;
  total: number;
}

export enum TimeRange {
  DAY = '1D',
  MONTH = '1M',
  YEAR = '1Y',
}

// Configuration & State

export interface AppConfig {
  useMock: boolean;
  finnhubKey: string | null;
  geminiKey: string | null;
  firebaseConfig: any | null;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
