import React from 'react';
import { Asset } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface Props {
  assets: Asset[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#64748b'];

const Dashboard: React.FC<Props> = ({ assets }) => {
  const totalValue = assets.reduce((sum, asset) => sum + (asset.quantity * (asset.currentPrice || asset.avgCost)), 0);
  
  // Group small assets
  const chartData = assets.map(a => ({
    name: a.symbol,
    value: a.quantity * (a.currentPrice || a.avgCost)
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Value Card */}
      <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
        <h3 className="text-gray-500 text-sm font-medium mb-2">總資產淨值</h3>
        <div className="text-3xl font-bold text-gray-800">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        <div className="mt-4 flex items-center text-sm">
           <span className="text-green-500 bg-green-50 px-2 py-1 rounded-md font-medium">模擬帳戶</span>
           <span className="ml-auto text-gray-400 text-xs">更新於剛剛</span>
        </div>
      </div>

      {/* Allocation Chart */}
      <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-800 font-bold mb-4">資產配置分佈</h3>
        <div className="h-[200px] w-full flex items-center">
          {assets.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full text-center text-gray-400 text-sm">
              尚未建立任何倉位
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
