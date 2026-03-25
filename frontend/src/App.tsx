import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, UploadCloud } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import LedgerFeed from './pages/LedgerFeed';
import ImportData from './pages/ImportData';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800">Family Ledger</h2>
          </div>
          <nav className="flex-1 mt-6 px-4 space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>
            <NavLink
              to="/ledger"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <FileText size={20} />
              Ledger Feed
            </NavLink>
            <NavLink
              to="/import"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <UploadCloud size={20} />
              Import Data
            </NavLink>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ledger" element={<LedgerFeed />} />
              <Route path="/import" element={<ImportData />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
