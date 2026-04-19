export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string;
  notes?: string;
  isRecurring: boolean;
}

export interface Budget {
  monthlyLimit: number;
  currency: string;
}

export const CATEGORIES = {
  expense: [
    'Food',
    'Rent',
    'Transport',
    'Shopping',
    'Entertainment',
    'Health',
    'Education',
    'Other',
  ],
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
};

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD'];
