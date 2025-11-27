import React from 'react';
import { Asset } from '../types';

interface Props {
  assets: Asset[];
}

const AssetList: React.FC<Props> = ({ assets }) => {
  const totalValue = assets.reduce((sum, asset) => sum + (asset.quantity * (asset.currentPrice || asset.avgCost)), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">持倉明細</h3>
        <span className="text-sm text-gray-500">總估值: ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 font-medium">代碼</th>
              <th className="px-6 py-3 font-medium text-right">持有股數</th>
              <th className="px-6 py-3 font-medium text-right">平均成本</th>
              <th className="px-6 py-3 font-medium text-right">現價(估)</th>
              <th className="px-6 py-3 font-medium text-right">損益(估)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assets.length === 0 ? (
               <tr>
                 <td colSpan={5} className="px-6 py-8 text-center text-gray-400">目前沒有持倉資產</td>
               </tr>
            ) : (
              assets.map((asset) => {
                const current = asset.currentPrice || asset.avgCost; // Fallback if no real-time data fetch for all portfolio
                const pnl = (current - asset.avgCost) * asset.quantity;
                const pnlPercent = ((current - asset.avgCost) / asset.avgCost) * 100;
                
                return (
                  <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800">{asset.symbol}</td>
                    <td className="px-6 py-4 text-right text-gray-700">{asset.quantity}</td>
                    <td className="px-6 py-4 text-right text-gray-600">${asset.avgCost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-gray-600">${current.toFixed(2)}</td>
                    <td className={`px-6 py-4 text-right font-medium ${pnl >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetList;
