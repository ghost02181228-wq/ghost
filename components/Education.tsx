import React from 'react';

const Education: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">新手交易指南</h2>
        <p className="opacity-90">掌握基礎知識，是成功投資的第一步。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4 text-xl">
            📈
          </div>
          <h3 className="font-bold text-gray-800 text-lg mb-2">如何看 K 線圖 (Candlestick)</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            K 線由開盤價、收盤價、最高價與最低價組成。
            <br/><br/>
            <span className="text-red-500 font-bold">紅棒 (陽線)</span>：收盤價 &gt; 開盤價，代表買氣強，價格上漲。
            <br/>
            <span className="text-green-500 font-bold">綠棒 (陰線)</span>：收盤價 &lt; 開盤價，代表賣壓重，價格下跌。
            <br/><br/>
            上下影線越長，代表當日多空交戰越激烈。
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-4 text-xl">
            📊
          </div>
          <h3 className="font-bold text-gray-800 text-lg mb-2">成交量的重要性 (Volume)</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            成交量顯示了市場對該價格的認同程度。
            <br/><br/>
            1. <span className="font-bold">量增價漲</span>：多頭強勢，漲勢可能持續。
            <br/>
            2. <span className="font-bold">量縮價跌</span>：賣壓不重，可能是回檔整理。
            <br/>
            3. <span className="font-bold">爆量不漲</span>：可能主力正在出貨，需小心反轉。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Education;