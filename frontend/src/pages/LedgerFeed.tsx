import React, { useState, useEffect } from 'react';

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
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Ledger Feed</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tx.category}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
