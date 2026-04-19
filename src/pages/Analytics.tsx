import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/helpers';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { Card } from '../components/ui/Card';

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899'];

export const Analytics = () => {
  const { transactions, budget } = useFinance();

  // Monthly Trend Data (Last 6 months)
  const monthlyTrend = Array.from({ length: 6 })
    .map((_, i) => {
      const date = subMonths(new Date(), i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      const monthLabel = format(date, 'MMM');

      const monthTransactions = transactions.filter((t) =>
        isWithinInterval(parseISO(t.date), { start, end })
      );

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

      return { name: monthLabel, income, expense };
    })
    .reverse();

  // Category Breakdown
  const categoryData = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find((item) => item.name === t.category);
      if (existing) existing.value += t.amount;
      else acc.push({ name: t.category, value: t.amount });
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-800">Financial Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Income vs Expense Trend">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => formatCurrency(value, budget.currency)}
                />
                <Legend iconType="circle" />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Monthly Balance Trend">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => formatCurrency(value, budget.currency)}
                />
                <Line
                  type="monotone"
                  dataKey={(d) => d.income - d.expense}
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366f1' }}
                  name="Net Balance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Expense Category Distribution" className="lg:col-span-2">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-[350px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value, budget.currency)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 truncate">{item.name}</p>
                    <p className="text-sm font-bold">{formatCurrency(item.value, budget.currency)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
