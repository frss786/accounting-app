import React from 'react';
import { UploadCloud, FileSpreadsheet } from 'lucide-react';

export default function ImportData() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Import Data</h1>
        <p className="mt-1 text-sm text-slate-500">Upload CSV files from your bank to populate your ledger.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100/60 ring-1 ring-slate-900/5 p-8 max-w-3xl">
        <div className="flex flex-col items-center">
          <div className="w-full mt-4 flex justify-center rounded-2xl border-2 border-dashed border-slate-200 px-6 py-20 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer group">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100/50 transition-colors">
                <UploadCloud className="h-8 w-8 text-slate-400 group-hover:text-blue-500 transition-colors" aria-hidden="true" />
              </div>
              <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2"
                >
                  <span>Click to browse</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" />
                </label>
                <p className="pl-1">or drag and drop your file here</p>
              </div>
              <p className="text-xs leading-5 text-slate-400 mt-2 flex items-center justify-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Supported format: CSV (max 10MB)
              </p>
            </div>
          </div>
          
          <div className="w-full mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">Need help? <a href="#" className="text-blue-600 hover:underline">Download a sample template</a></p>
            <button
              type="button"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-all"
            >
              Continue to Mapping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
