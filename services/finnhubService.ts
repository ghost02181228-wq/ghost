import { FINNHUB_API_KEY, generateMockCandles, generateMockStockData } from '../constants';
import { CandleData, StockData, TimeRange } from '../types';

class FinnhubService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = FINNHUB_API_KEY;
  }

  private getUrl(endpoint: string, params: Record<string, string>) {
    const query = new URLSearchParams({
      ...params,
      token: this.apiKey || '',
    });
    return `https://finnhub.io/api/v1${endpoint}?${query.toString()}`;
  }

  async getQuote(symbol: string): Promise<StockData> {
    if (!this.apiKey) {
      await new Promise(r => setTimeout(r, 500)); // Sim delay
      return generateMockStockData(symbol);
    }

    try {
      const res = await fetch(this.getUrl('/quote', { symbol }));
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      if (data.c === 0 && data.d === null) throw new Error('Invalid symbol'); // Basic check
      return data;
    } catch (e) {
      console.warn("Finnhub API failed or symbol invalid, falling back to mock", e);
      return generateMockStockData(symbol);
    }
  }

  async getCandles(symbol: string, range: TimeRange): Promise<CandleData[]> {
    if (!this.apiKey) {
      await new Promise(r => setTimeout(r, 800));
      const count = range === TimeRange.DAY ? 24 : range === TimeRange.MONTH ? 30 : 50;
      return generateMockCandles(count);
    }

    try {
      // Calculation resolution and timestamps
      const now = Math.floor(Date.now() / 1000);
      let from = now;
      let resolution = 'D';

      switch (range) {
        case TimeRange.DAY:
          from = now - (24 * 60 * 60); // 1 day ago
          resolution = '60'; // Hourly
          break;
        case TimeRange.MONTH:
          from = now - (30 * 24 * 60 * 60);
          resolution = 'D'; // Daily
          break;
        case TimeRange.YEAR:
          from = now - (365 * 24 * 60 * 60);
          resolution = 'W'; // Weekly
          break;
      }

      const res = await fetch(this.getUrl('/stock/candle', {
        symbol,
        resolution,
        from: from.toString(),
        to: now.toString()
      }));

      const data = await res.json();

      if (data.s === 'ok') {
        return data.t.map((timestamp: number, index: number) => ({
          time: timestamp * 1000,
          open: data.o[index],
          high: data.h[index],
          low: data.l[index],
          close: data.c[index],
          volume: data.v[index]
        }));
      } else {
        throw new Error('No data');
      }

    } catch (e) {
      console.warn("Finnhub Candle fetch failed, using mock", e);
      return generateMockCandles(30);
    }
  }
}

export const stockService = new FinnhubService();
