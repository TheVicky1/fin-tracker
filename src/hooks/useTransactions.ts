import { useFinance } from '../context/FinanceContext';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export const useTransactions = () => {
  const { transactions } = useFinance();

  const getFilteredTransactions = (filters: {
    search: string;
    category: string;
    type: string;
    startDate: string;
    endDate: string;
  }) => {
    return transactions.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                           (t.notes?.toLowerCase().includes(filters.search.toLowerCase()) ?? false);
      const matchesCategory = filters.category === 'All' || t.category === filters.category;
      const matchesType = filters.type === 'All' || t.type === filters.type;
      
      let matchesDate = true;
      if (filters.startDate && filters.endDate) {
        const tDate = parseISO(t.date);
        matchesDate = isWithinInterval(tDate, {
          start: parseISO(filters.startDate),
          end: parseISO(filters.endDate),
        });
      }

      return matchesSearch && matchesCategory && matchesType && matchesDate;
    });
  };

  const getMonthlyStats = () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const monthlyTransactions = transactions.filter((t) =>
      isWithinInterval(parseISO(t.date), { start, end })
    );

    const income = monthlyTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = monthlyTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    return { income, expenses, balance: income - expenses };
  };

  return { transactions, getFilteredTransactions, getMonthlyStats };
};
