import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, UploadCloud, Wallet } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import LedgerFeed from './pages/LedgerFeed';
import ImportData from './pages/ImportData';
import ManualEntry from './pages/ManualEntry';
import { PlusCircle } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200/60 flex flex-col shadow-sm z-10">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Wallet size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Ledger</h2>
          </div>
          <nav className="flex-1 mt-4 px-3 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100/50' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink
              to="/ledger"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100/50' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <FileText size={18} />
              Transactions
            </NavLink>
            <NavLink
              to="/import"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100/50' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <UploadCloud size={18} />
              Import Data
            </NavLink>
            <NavLink
              to="/manual"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100/50' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <PlusCircle size={18} />
              Add Record
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-slate-50/50">
          <div className="p-8 max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ledger" element={<LedgerFeed />} />
              <Route path="/import" element={<ImportData />} />
              <Route path="/manual" element={<ManualEntry />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
