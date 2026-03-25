import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Category {
  id: string;
  name: string;
  type: string;
}

export default function ManualEntry() {
  const { user } = useAuth();
  const ledgerId = user?.ledgerId ?? 'default-ledger';
  const [formData, setFormData] = useState({
    type: 'Expense',
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const types = ['Expense', 'Income', 'Transfer'];

  useEffect(() => {
    // Fetch real categories from backend on mount
    api.get(`/api/ledgers/${ledgerId}/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  // Filter categories based on selected transaction type
  const activeCategories = categories.filter(c => c.type === formData.type.toUpperCase());

  // Auto-select the first valid category when type or category list changes
  useEffect(() => {
    if (activeCategories.length > 0 && !activeCategories.find(c => c.id === formData.categoryId)) {
      setFormData(prev => ({ ...prev, categoryId: activeCategories[0].id }));
    }
  }, [formData.type, categories, activeCategories, formData.categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        amount: Number(formData.amount),
        type: formData.type.toUpperCase(),
        category_id: formData.categoryId,
        account_id: 'default-account', // Use default account for now
        timestamp: new Date(formData.date).toISOString(),
        notes: formData.notes
      };

      await api.post(`/api/ledgers/${ledgerId}/transactions`, payload);
      alert('Transaction saved successfully!');
      
      // Reset form (keep type and date)
      setFormData(prev => ({ ...prev, amount: '', notes: '' }));
    } catch (error) {
      console.error(error);
      alert('Failed to save transaction');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Add Record</h1>
        <p className="mt-1 text-sm text-slate-500">Manually enter a new transaction.</p>
      </header>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100/60 ring-1 ring-slate-900/5">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Transaction Type</label>
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.type === type
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  $
                </span>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none appearance-none"
              required
            >
              {activeCategories.length === 0 && <option value="" disabled>No categories available</option>}
              {activeCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none resize-none"
              placeholder="Optional remarks..."
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium shadow-sm active:scale-95"
              disabled={activeCategories.length === 0}
            >
              <Save size={18} />
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
