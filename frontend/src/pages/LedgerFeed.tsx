import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface BackendTransaction {
  id: string;
  timestamp: string;
  amount: number | string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  notes: string | null;
  categoryId: string | null;
}

interface Category {
  id: string;
  name: string;
}

export default function LedgerFeed() {
  const { user } = useAuth();
  const ledgerId = user?.ledgerId ?? 'default-ledger';
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        const [txRes, catRes] = await Promise.all([
          api.get(`/api/ledgers/${ledgerId}/transactions`),
          api.get(`/api/ledgers/${ledgerId}/categories`).catch(() => ({ data: [] }))
        ]);
        
        if (!isMounted) return;

        const categoryMap: Record<string, string> = {};
        const categories: Category[] = catRes.data || [];
        categories.forEach(c => {
          categoryMap[c.id] = c.name;
        });

        const backendTx: BackendTransaction[] = txRes.data || [];
        const mappedTx: Transaction[] = backendTx.map(tx => ({
          id: tx.id,
          date: new Date(tx.timestamp).toISOString().split('T')[0],
          description: tx.notes || tx.type,
          amount: tx.type === 'EXPENSE' ? -Number(tx.amount) : Number(tx.amount),
          category: tx.categoryId ? (categoryMap[tx.categoryId] || 'Unknown') : 'Unknown'
        }));

        setTransactions(mappedTx);
      } catch (error) {
        console.error('Error fetching ledger data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    fetchData();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 flex items-center justify-center py-12">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

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
