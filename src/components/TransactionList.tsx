import { format } from 'date-fns';
import { Edit2, Trash2, Repeat } from 'lucide-react';
import { Transaction } from '../types';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, cn } from '../utils/helpers';
import { toast } from 'react-toastify';

export const TransactionList = ({ transactions }: { transactions: Transaction[] }) => {
  const { deleteTransaction, budget } = useFinance();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
      toast.info('Transaction deleted');
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-slate-500">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-slate-400 text-sm uppercase tracking-wider border-b border-slate-100">
            <th className="pb-4 font-medium">Date</th>
            <th className="pb-4 font-medium">Title</th>
            <th className="pb-4 font-medium">Category</th>
            <th className="pb-4 font-medium text-right">Amount</th>
            <th className="pb-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {transactions.map((t) => (
            <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="py-4 text-slate-600 text-sm">{format(new Date(t.date), 'MMM dd, yyyy')}</td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-800">{t.title}</span>
                  {t.isRecurring && (
                    <span className="p-1 bg-indigo-50 text-indigo-600 rounded-full" title="Recurring">
                      <Repeat className="w-3 h-3" />
                    </span>
                  )}
                </div>
                {t.notes && <p className="text-xs text-slate-400 truncate max-w-[200px]">{t.notes}</p>}
              </td>
              <td className="py-4">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                  {t.category}
                </span>
              </td>
              <td className={cn('py-4 text-right font-bold', t.type === 'income' ? 'text-emerald-600' : 'text-rose-600')}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, budget.currency)}
              </td>
              <td className="py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
