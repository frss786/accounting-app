import React, { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2026-03-25', description: 'Grocery Store', amount: -150.25, category: 'Food' },
  { id: '2', date: '2026-03-24', description: 'Salary', amount: 4500.00, category: 'Income' },
  { id: '3', date: '2026-03-23', description: 'Electric Bill', amount: -85.50, category: 'Utilities' },
  { id: '4', date: '2026-03-22', description: 'Internet', amount: -60.00, category: 'Utilities' },
  { id: '5', date: '2026-03-20', description: 'Freelance Client', amount: 800.00, category: 'Income' },
];

export default function LedgerFeed() {
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Transactions</h1>
        <p className="mt-1 text-sm text-slate-500">View and manage your recent ledger entries.</p>
      </header>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100/60 ring-1 ring-slate-900/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tx.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{tx.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200/50">
                      {tx.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium tracking-tight ${tx.amount >= 0 ? 'text-green-600' : 'text-slate-900'}`}>
                    {tx.amount >= 0 ? '+' : ''}
                    {tx.amount < 0 ? '-' : ''}
                    ${Math.abs(tx.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
