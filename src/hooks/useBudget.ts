import { useFinance } from '../context/FinanceContext';
import { useTransactions } from './useTransactions';

export const useBudget = () => {
  const { budget } = useFinance();
  const { getMonthlyStats } = useTransactions();
  const { expenses } = getMonthlyStats();

  const remaining = budget.monthlyLimit - expenses;
  const percentage = Math.min((expenses / budget.monthlyLimit) * 100, 100);

  return {
    limit: budget.monthlyLimit,
    expenses,
    remaining,
    percentage,
    currency: budget.currency,
  };
};
