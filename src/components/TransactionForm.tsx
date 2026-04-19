import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CATEGORIES, Transaction, TransactionType } from '../types';
import { toast } from 'react-toastify';
import { useFinance } from '../context/FinanceContext';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  title: yup.string().required('Title is required').min(3, 'Title too short'),
  amount: yup.number().required('Amount is required').positive('Must be positive'),
  category: yup.string().required('Category is required'),
  type: yup.string().oneOf(['income', 'expense']).required(),
  date: yup.string().required('Date is required'),
  notes: yup.string().notRequired(),
  isRecurring: yup.boolean().required(),
});

export const TransactionForm = ({ initialData }: { initialData?: Transaction }) => {
  const { addTransaction, updateTransaction } = useFinance();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema) as any,
    defaultValues: initialData || {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
    },
  });

  const type = watch('type') as TransactionType;

  const onSubmit = async (data: any) => {
    try {
      if (initialData) {
        updateTransaction(initialData.id, data);
        toast.success('Transaction updated!');
      } else {
        addTransaction(data);
        toast.success('Transaction added!');
      }
      navigate('/transactions');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            {...register('title')}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. Grocery Shopping"
          />
          {errors.title && <p className="text-xs text-rose-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Amount</label>
          <input
            type="number"
            step="0.01"
            {...register('amount')}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="0.00"
          />
          {errors.amount && <p className="text-xs text-rose-500">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Type</label>
          <select
            {...register('type')}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Category</label>
          <select
            {...register('category')}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Select Category</option>
            {CATEGORIES[type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-rose-500">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Date</label>
          <input
            type="date"
            {...register('date')}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {errors.date && <p className="text-xs text-rose-500">{errors.date.message}</p>}
        </div>

        <div className="flex items-center gap-3 pt-8">
          <input
            type="checkbox"
            {...register('isRecurring')}
            id="isRecurring"
            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isRecurring" className="text-sm font-medium text-slate-700">
            Recurring Transaction
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Notes (Optional)</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Add some details..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : initialData ? 'Update Transaction' : 'Add Transaction'}
      </button>
    </form>
  );
};
