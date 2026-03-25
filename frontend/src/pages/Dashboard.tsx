import React from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet, BarChart3 } from 'lucide-react';

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

      {/* Empty State Chart Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100/60 ring-1 ring-slate-900/5 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-base font-medium text-slate-900">Cash Flow</h3>
        </div>
        <div className="p-12 flex flex-col items-center justify-center text-center bg-slate-50/30 min-h-[300px]">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400 border border-slate-200/50">
            <BarChart3 className="w-8 h-8 opacity-50" />
          </div>
          <h4 className="text-sm font-medium text-slate-900">Insufficient Data for Chart</h4>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            Import more transactions or connect your accounts to see spending trends and analytics over time.
          </p>
        </div>
      </div>
    </div>
  );
}
