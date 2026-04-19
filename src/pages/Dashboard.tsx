import { Layout } from '../components/Layout';
import { StatCard } from '../components/ui/Card';
import { useTransactions } from '../hooks/useTransactions';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/helpers';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon } from 'lucide-react';
import { TransactionList } from '../components/TransactionList';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899'];

export const Dashboard = () => {
  const { transactions, getMonthlyStats } = useTransactions();
  const { budget } = useFinance();
  const { income, expenses, balance } = getMonthlyStats();

  const categoryData = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find((item) => item.name === t.category);
      if (existing) existing.value += t.amount;
      else acc.push({ name: t.category, value: t.amount });
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  const topCategory = categoryData[0]?.name || 'N/A';

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-500">Welcome back! Here's your financial summary.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Income"
          value={formatCurrency(income, budget.currency)}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(expenses, budget.currency)}
          icon={TrendingDown}
          color="rose"
        />
        <StatCard
          label="Net Balance"
          value={formatCurrency(balance, budget.currency)}
          icon={DollarSign}
          color="indigo"
        />
        <StatCard
          label="Top Category"
          value={topCategory}
          icon={PieIcon}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>
          <TransactionList transactions={transactions.slice(0, 5)} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Expense Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.slice(0, 4).map((item, index) => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold">{formatCurrency(item.value, budget.currency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
