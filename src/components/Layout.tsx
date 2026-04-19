import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, PlusCircle, PieChart, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils/helpers';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: ListOrdered },
  { name: 'Add New', path: '/transactions/new', icon: PlusCircle },
  { name: 'Budget', path: '/budget', icon: Wallet },
  { name: 'Analytics', path: '/analytics', icon: PieChart },
];

export const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <Wallet className="w-8 h-8" />
            FinTrack
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                )}
              >
                <item.icon className={cn('w-5 h-5', isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
