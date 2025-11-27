import React, { useState, useEffect } from 'react';
import { CandleData, StockData, TimeRange, Asset } from './types';
import { stockService } from './services/finnhubService';
import { persistenceService } from './services/persistenceService';
import { FINNHUB_API_KEY, IS_REAL_MODE } from './constants';

import StockChart from './components/StockChart';
import TradingPanel from './components/TradingPanel';
import AIAnalysis from './components/AIAnalysis';
import AssetList from './components/AssetList';
import Dashboard from './components/Dashboard';
import Education from './components/Education';

// Icons
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>;

function App() {
  const [activeTab, setActiveTab] = useState<'TRADE' | 'ASSETS' | 'EDU'>('TRADE');
  const [symbol, setSymbol] = useState<string>('AAPL');
  const [inputSymbol, setInputSymbol] = useState<string>('AAPL');
  
  const [stockQuote, setStockQuote] = useState<StockData | null>(null);
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.MONTH);
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // --- Data Fetching ---

  const fetchData = async () => {
    // 1. Fetch Quote
    const quote = await stockService.getQuote(symbol);
    setStockQuote(quote);

    // 2. Fetch Candles
    const candles = await stockService.getCandles(symbol, timeRange);
    setChartData(candles);
  };

  const fetchAssets = async () => {
    const data = await persistenceService.getAssets();
    // In a real app, we would update current prices for these assets here
    // For this demo, we assume assets carry their last known or avg price unless updated
    setAssets(data);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, timeRange]);

  useEffect(() => {
    fetchAssets();
  }, [refreshTrigger]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputSymbol.trim()) {
      setSymbol(inputSymbol.toUpperCase());
    }
  };

  const handleTransactionComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const getPriceInfoString = () => {
    if (!stockQuote) return "暫無數據";
    return `現價: ${stockQuote.c}, 漲跌: ${stockQuote.d} (${stockQuote.dp}%)`;
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">AlphaTrade <span className="text-blue-600">Pro</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
             <span className={`px-2 py-1 text-xs font-bold rounded border ${IS_REAL_MODE ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                {IS_REAL_MODE ? '🟢 真實模式' : '🟠 模擬預覽'}
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('TRADE')}
            className={`pb-3 px-1 flex items-center gap-2 font-medium transition-colors border-b-2 ${activeTab === 'TRADE' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <ChartIcon /> 市場與交易
          </button>
          <button 
            onClick={() => setActiveTab('ASSETS')}
            className={`pb-3 px-1 flex items-center gap-2 font-medium transition-colors border-b-2 ${activeTab === 'ASSETS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <WalletIcon /> 資產管理
          </button>
          <button 
             onClick={() => setActiveTab('EDU')}
             className={`pb-3 px-1 flex items-center gap-2 font-medium transition-colors border-b-2 ${activeTab === 'EDU' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <BookIcon /> 新手學院
          </button>
        </div>

        {/* --- View: TRADE --- */}
        {activeTab === 'TRADE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Chart & Controls */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Search Bar */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
                <form onSubmit={handleSearch} className="flex-1 flex gap-3">
                  <input 
                    type="text" 
                    value={inputSymbol}
                    onChange={(e) => setInputSymbol(e.target.value)}
                    placeholder="輸入股票代號 (例如: AAPL, TSLA)"
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase font-mono"
                  />
                  <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-700 transition">
                    載入
                  </button>
                </form>
              </div>

              {/* Chart */}
              <StockChart data={chartData} symbol={symbol} range={timeRange} />
              
              {/* Range Controls */}
              <div className="flex gap-2 justify-end">
                {Object.values(TimeRange).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${timeRange === r ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Trading & AI */}
            <div className="lg:col-span-4 space-y-6">
              {/* Trading Panel */}
              <TradingPanel 
                symbol={symbol} 
                currentPrice={stockQuote?.c || 0} 
                onTransactionComplete={handleTransactionComplete}
              />
              
              {/* AI Analysis */}
              <div className="h-[300px]">
                 <AIAnalysis symbol={symbol} priceInfo={getPriceInfoString()} />
              </div>
            </div>
          </div>
        )}

        {/* --- View: ASSETS --- */}
        {activeTab === 'ASSETS' && (
          <div className="space-y-8 animate-fade-in">
             <Dashboard assets={assets} />
             <AssetList assets={assets} />
             <div className="flex justify-center">
                 <button 
                   onClick={() => { persistenceService.clearData(); setRefreshTrigger(p => p+1); }}
                   className="text-red-400 text-xs hover:text-red-600 underline"
                 >
                   重置模擬資產數據
                 </button>
             </div>
          </div>
        )}

        {/* --- View: EDUCATION --- */}
        {activeTab === 'EDU' && (
           <div className="max-w-4xl mx-auto animate-fade-in">
             <Education />
           </div>
        )}

      </main>
    </div>
  );
}

export default App;
