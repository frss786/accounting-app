import React from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid, Legend
} from 'recharts';

const MONTHLY_TREND_DATA = [
  { name: 'Oct', income: 4000, expense: 2400 },
  { name: 'Nov', income: 5200, expense: 3398 },
  { name: 'Dec', income: 4800, expense: 3800 },
  { name: 'Jan', income: 5500, expense: 4208 },
  { name: 'Feb', income: 5890, expense: 3800 },
  { name: 'Mar', income: 6390, expense: 4300 },
];

const CATEGORY_DATA = [
  { name: 'Dining', value: 500 },
  { name: 'Transport', value: 300 },
  { name: 'Groceries', value: 800 },
  { name: 'Utilities', value: 250 },
  { name: 'Entertainment', value: 150 },
];

const COLORS = ['#3b82f6', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-xl text-sm">
        <p className="font-medium text-slate-800 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500 capitalize">{entry.name}:</span>
            <span className="font-semibold text-slate-900">${entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Your financial summary at a glance.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/60 ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm border-b-0 font-medium text-slate-500">Total Income</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">$12,450.00</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600 font-medium">+4.5%</span>
            <span className="ml-2 text-slate-400">from last month</span>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/60 ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Total Expenses</h3>
            <div className="p-2 bg-red-50 rounded-lg">
              <ArrowDownRight className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">$8,230.50</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-red-500 font-medium">+1.2%</span>
            <span className="ml-2 text-slate-400">from last month</span>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/60 ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Net Balance</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">$4,219.50</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-blue-600 font-medium">+12.5%</span>
            <span className="ml-2 text-slate-400">from last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {/* Trend Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/60 ring-1 ring-slate-900/5 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100/60">
            <h3 className="text-base font-medium text-slate-900">Monthly Trend</h3>
          </div>
          <div className="p-6 flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/60 ring-1 ring-slate-900/5 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100/60">
            <h3 className="text-base font-medium text-slate-900">Expenses by Category</h3>
          </div>
          <div className="p-6 flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
