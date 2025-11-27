import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';

interface Props {
  symbol: string;
  priceInfo: string;
}

const AIAnalysis: React.FC<Props> = ({ symbol, priceInfo }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Auto-analyze when symbol changes
  useEffect(() => {
    handleAnalyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(''); // Clear previous
    try {
      const result = await geminiService.analyzeStock(symbol, priceInfo);
      setAnalysis(result);
    } catch (e) {
      setAnalysis('無法取得分析資料。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>✨</span> Gemini 智能投顧
        </h3>
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 transition disabled:opacity-50"
        >
          {loading ? '分析中...' : '重新分析'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide text-sm leading-relaxed text-gray-700">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap font-medium">{analysis}</div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
        * AI 分析僅供參考，不構成投資建議。
      </div>
    </div>
  );
};

export default AIAnalysis;
