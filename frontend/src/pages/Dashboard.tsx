import { useState, useEffect, useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid, Legend
} from 'recharts';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Transaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  timestamp: string;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#0ea5e9', '#6366f1', '#ec4899', '#f97316', '#14b8a6'];

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
  const { user } = useAuth();
  const ledgerId = user?.ledgerId ?? 'default-ledger';
  const [timeRange, setTimeRange] = useState('1 Month');
  const [loading, setLoading] = useState(true);

  // Raw data fetched once
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [catsById, setCatsById] = useState<Record<string, string>>({});

  const timeRanges = ['1 Month', '3 Months', '6 Months', '1 Year'];

  // Fetch all data once
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [txRes, catRes] = await Promise.all([
          api.get(`/api/ledgers/${ledgerId}/transactions`),
          api.get(`/api/ledgers/${ledgerId}/categories`)
        ]);

        const txs: Transaction[] = txRes.data || [];
        const cats: Category[] = catRes.data || [];

        const map: Record<string, string> = {};
        cats.forEach(c => { map[c.id] = c.name; });

        setAllTransactions(txs);
        setCatsById(map);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ledgerId]);

  // Derive cutoff date from selected time range
  const cutoff = useMemo(() => {
    const now = new Date();
    const monthsMap: Record<string, number> = {
      '1 Month': 1,
      '3 Months': 3,
      '6 Months': 6,
      '1 Year': 12,
    };
    const months = monthsMap[timeRange] ?? 1;
    return new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
  }, [timeRange]);

  // Re-derive charts and totals whenever raw data or timeRange changes
  const { monthlyTrendData, categoryData, totals } = useMemo(() => {
    const filtered = allTransactions.filter(tx => {
      if (!tx.timestamp) return false;
      return new Date(tx.timestamp) >= cutoff;
    });

    let totalIncome = 0;
    let totalExpense = 0;

    const monthlyMap = new Map<string, { name: string; income: number; expense: number; dateValue: number }>();
    const catMap = new Map<string, number>();

    filtered.forEach(tx => {
      const d = new Date(tx.timestamp);
      if (isNaN(d.getTime())) return;

      const amount = Number(tx.amount);
      if (isNaN(amount)) return;

      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      const monthKey = `${monthName} ${year}`;
      const dateValue = new Date(year, d.getMonth(), 1).getTime();

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { name: monthName, income: 0, expense: 0, dateValue });
      }
      const monthData = monthlyMap.get(monthKey)!;

      if (tx.type === 'INCOME') {
        monthData.income += amount;
        totalIncome += amount;
      } else if (tx.type === 'EXPENSE') {
        monthData.expense += amount;
        totalExpense += amount;
        const cName = tx.categoryId && catsById[tx.categoryId] ? catsById[tx.categoryId] : 'Uncategorized';
        catMap.set(cName, (catMap.get(cName) || 0) + amount);
      }
    });

    const monthlyTrendData = Array.from(monthlyMap.values())
      .sort((a, b) => a.dateValue - b.dateValue)
      .map(({ name, income, expense }) => ({ name, income, expense }));

    const categoryData = Array.from(catMap.entries())
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      monthlyTrendData,
      categoryData,
      totals: { income: totalIncome, expense: totalExpense, balance: totalIncome - totalExpense },
    };
  }, [allTransactions, cutoff, catsById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="text-slate-500 font-medium animate-pulse">Loading...</div>
      </div>
    );
  }

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
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">${totals.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        {/* Expense Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/60 ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Total Expenses</h3>
            <div className="p-2 bg-red-50 rounded-lg">
              <ArrowDownRight className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">${totals.expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        {/* Balance Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/60 ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Net Balance</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">${totals.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Analytics</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {range}
            </button>
          ))}
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
              <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((_entry, index) => (
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
