import React, { useState } from 'react';
import { StockData, Transaction } from '../types';
import { persistenceService } from '../services/persistenceService';

interface Props {
  symbol: string;
  currentPrice: number;
  onTransactionComplete: () => void;
}

const TradingPanel: React.FC<Props> = ({ symbol, currentPrice, onTransactionComplete }) => {
  const [quantity, setQuantity] = useState<number>(100);
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const total = quantity * currentPrice;

  const handleTrade = async () => {
    setIsSubmitting(true);
    setMessage(null);

    const tx: Transaction = {
      id: crypto.randomUUID(),
      type,
      symbol,
      price: currentPrice,
      quantity,
      timestamp: Date.now(),
      total
    };

    try {
      await persistenceService.addTransaction(tx);
      setMessage(`${type === 'BUY' ? '買入' : '賣出'} 成功！`);
      onTransactionComplete();
      
      // Reset msg after 3s
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      setMessage("交易失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-6">模擬交易下單</h3>
      
      <div className="space-y-4">
        {/* Price Display */}
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
          <span className="text-gray-500 text-sm">當前市價</span>
          <span className="text-xl font-mono font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
        </div>

        {/* Action Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setType('BUY')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
              type === 'BUY' 
                ? 'bg-red-500 text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            買入
          </button>
          <button
            onClick={() => setType('SELL')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
              type === 'SELL' 
                ? 'bg-green-500 text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            賣出
          </button>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">股數</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right font-mono"
          />
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">預估總額</span>
            <span className="font-bold text-gray-900">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <button
            onClick={handleTrade}
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transform active:scale-95 transition-all ${
              type === 'BUY' 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-200' 
                : 'bg-gradient-to-r from-green-500 to-teal-500 shadow-green-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? '處理中...' : `確認${type === 'BUY' ? '買進' : '賣出'}`}
          </button>
          
          {message && (
            <div className={`mt-3 text-center text-sm font-medium ${message.includes('失敗') ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;
