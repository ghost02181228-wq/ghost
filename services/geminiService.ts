import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY, MOCK_ANALYSIS_RESPONSE } from '../constants';

class GeminiService {
  private client: GoogleGenAI | null = null;
  private isMock: boolean = true;

  constructor() {
    if (GEMINI_API_KEY) {
      this.client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      this.isMock = false;
    }
  }

  async analyzeStock(symbol: string, priceData: string): Promise<string> {
    if (this.isMock || !this.client) {
      console.log('Gemini Service: Using Mock Data');
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return MOCK_ANALYSIS_RESPONSE.replace('該股票', symbol);
    }

    try {
      const prompt = `
        你是一位專業的華爾街金融分析師。請分析以下股票代碼 ${symbol} 的走勢。
        目前的價格數據摘要：${priceData}
        
        請提供以下輸出的繁體中文分析（不要使用 markdown 格式，純文字即可，分段清楚）：
        1. 市場總結
        2. 技術面分析
        3. 投資建議（買入/賣出/持有）與風險提示。
        
        字數控制在 200 字以內，語氣專業且客觀。
      `;

      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || "無法生成分析結果。";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "AI 分析服務暫時無法使用，請稍後再試。";
    }
  }
}

export const geminiService = new GeminiService();
