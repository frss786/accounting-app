import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, FileText, UploadCloud, Wallet, PlusCircle, LogOut } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import LedgerFeed from './pages/LedgerFeed';
import ImportData from './pages/ImportData';
import ManualEntry from './pages/ManualEntry';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedLayout() {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
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
            end
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

        {/* User section at bottom */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-slate-600 transition-colors" title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
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
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
