import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useBudget } from '../hooks/useBudget';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/helpers';
import { CURRENCIES } from '../types';
import { toast } from 'react-toastify';
import { motion } from 'motion/react';

export const BudgetPage = () => {
  const { updateBudget, setCurrency } = useFinance();
  const { limit, expenses, remaining, percentage, currency } = useBudget();
  const [newLimit, setNewLimit] = useState(limit.toString());

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newLimit);
    if (!isNaN(val) && val > 0) {
      updateBudget(val);
      toast.success('Budget limit updated!');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-800">Budget Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Monthly Budget Stats">
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-sm text-slate-500">Total Limit</p>
                <p className="text-xl font-bold">{formatCurrency(limit, currency)}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-sm text-slate-500">Spent</p>
                <p className="text-xl font-bold text-rose-600">{formatCurrency(expenses, currency)}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-sm text-slate-500">Remaining</p>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(remaining, currency)}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-sm text-slate-500">Used</p>
                <p className="text-xl font-bold text-indigo-600">{percentage.toFixed(1)}%</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Budget Progress</span>
                <span>{percentage.toFixed(0)}%</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    percentage > 90 ? 'bg-rose-500' : percentage > 70 ? 'bg-amber-500' : 'bg-indigo-500'
                  )}
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          <Card title="Settings">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Monthly Budget Limit</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Base Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400">All transactions will be displayed in this currency.</p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

import { cn } from '../utils/helpers';
