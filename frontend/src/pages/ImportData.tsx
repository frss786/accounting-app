import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, Loader2, CheckCircle2, X } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

type StagedRecord = {
  date: string;
  description: string;
  amount: number;
  type: string;
  categoryId?: string | null;
};

export default function ImportData() {
  const { user } = useAuth();
  const ledgerId = user?.ledgerId ?? 'default-ledger';
  const [, setFile] = useState<File | null>(null);
  const [stagedData, setStagedData] = useState<StagedRecord[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    await uploadFile(selectedFile);
  };

  const uploadFile = async (selectedFile: File) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await api.post(`/api/ledgers/${ledgerId}/import/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Based on typical express backend patterns, grab preview data
      const data = response.data?.data || response.data?.preview || response.data;
      if (Array.isArray(data)) {
        setStagedData(data);
      } else {
        setStagedData([]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Failed to upload CSV.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!stagedData || stagedData.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      await api.post(`/api/ledgers/${ledgerId}/import/commit`, { transactions: stagedData });
      setStagedData(null);
      setFile(null);
      alert('Data imported successfully!');
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Failed to commit imported data.');
    } finally {
      setLoading(false);
    }
  };

  const cancelImport = () => {
    setStagedData(null);
    setFile(null);
    setError(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Import Data</h1>
        <p className="mt-1 text-sm text-slate-500">Upload CSV files from your bank to populate your ledger.</p>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center justify-between">
          <p className="text-sm font-medium">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {!stagedData ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/60 ring-1 ring-slate-900/5 p-8 max-w-3xl">
          <div className="flex flex-col items-center">
            <div className={`w-full mt-4 flex justify-center rounded-2xl border-2 border-dashed ${loading ? 'border-slate-200 bg-slate-50/50' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'} px-6 py-20 transition-all duration-200 group relative`}>
              {loading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                  <p className="text-sm text-slate-600 font-medium">Processing CSV...</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100/50 transition-colors cursor-pointer">
                    <UploadCloud className="h-8 w-8 text-slate-400 group-hover:text-blue-500 transition-colors" aria-hidden="true" />
                  </div>
                  <div className="mt-4 flex flex-col items-center text-sm leading-6 text-slate-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2"
                    >
                      <span>Click to browse</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        accept=".csv"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pt-1 text-slate-500">or drag and drop your file here</p>
                  </div>
                  <p className="text-xs leading-5 text-slate-400 mt-3 flex items-center justify-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Supported format: CSV (max 10MB)
                  </p>
                </div>
              )}
            </div>
            
            <div className="w-full mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm text-slate-500">Need help? <a href="#" className="text-blue-600 hover:underline">Download a sample template</a></p>
              <button
                type="button"
                disabled={true} // Disabled before upload
                className="rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-400 cursor-not-allowed transition-all"
              >
                Continue to Mapping
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/60 ring-1 ring-slate-900/5 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100/60 flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-slate-900">Preview Data</h3>
              <p className="mt-1 text-sm text-slate-500">Review {stagedData.length} extracted transactions before importing.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={cancelImport}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCommit}
                disabled={loading}
                className="rounded-xl flex items-center gap-2 bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all disabled:opacity-75 disabled:cursor-wait"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Confirm & Import
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50 sticky top-0 backdrop-blur-sm z-10">
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-3 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {stagedData.map((record, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm text-slate-600">{record.date || 'N/A'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-900">{record.description || 'Unknown'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-slate-600 font-mono">
                      {record.amount !== undefined ? `$${Math.abs(record.amount).toFixed(2)}` : '$0.00'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        record.type?.toLowerCase() === 'income' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-500/10'
                      }`}>
                        {record.type || 'expense'}
                      </span>
                    </td>
                  </tr>
                ))}
                {stagedData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-sm text-slate-500">
                      No transactions detected in the file.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
