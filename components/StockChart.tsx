import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { CandleData, TimeRange } from '../types';

interface Props {
  data: CandleData[];
  symbol: string;
  range: TimeRange;
}

// Custom Tooltip for detailed info
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const dateStr = new Date(data.time).toLocaleDateString();
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded text-sm">
        <p className="font-bold text-gray-700 mb-1">{dateStr}</p>
        <p className="text-gray-600">開盤: <span className="font-mono text-gray-900">{data.open.toFixed(2)}</span></p>
        <p className="text-gray-600">最高: <span className="font-mono text-gray-900">{data.high.toFixed(2)}</span></p>
        <p className="text-gray-600">最低: <span className="font-mono text-gray-900">{data.low.toFixed(2)}</span></p>
        <p className="text-gray-600">收盤: <span className="font-mono text-gray-900">{data.close.toFixed(2)}</span></p>
        <p className="text-gray-600">成交量: <span className="font-mono text-gray-900">{data.volume.toLocaleString()}</span></p>
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<Props> = ({ data, symbol, range }) => {
  const isUp = (d: any) => d.close > d.open;

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">{symbol} 技術走勢 ({range})</h3>
        <div className="flex gap-2 text-xs text-gray-500">
           <span className="flex items-center"><div className="w-3 h-3 bg-red-500 mr-1"></div> 漲</span>
           <span className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-1"></div> 跌</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="time" 
            tickFormatter={(time) => new Date(time).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric'})}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            domain={['auto', 'auto']}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => val.toFixed(0)}
          />
          <YAxis 
            yAxisId="left"
            orientation="left"
            tick={false}
            axisLine={false}
            width={0}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Volume Bars */}
          <Bar yAxisId="left" dataKey="volume" barSize={20} opacity={0.3}>
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.close > entry.open ? '#ef4444' : '#22c55e'} />
              ))}
          </Bar>

          {/* Price Line (Approximating Candle Trend for cleaner look in Recharts basic) */}
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="close" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false} 
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
