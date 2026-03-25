import React from 'react';
import { Download, CreditCard, DollarSign } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">$12,450.00</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Expense</h3>
            <CreditCard className="w-5 h-5 text-red-500" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">$8,230.50</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Net Balance</h3>
            <Download className="w-5 h-5 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">$4,219.50</p>
        </div>
      </div>
    </div>
  );
}
