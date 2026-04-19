import { TransactionForm } from '../components/TransactionForm';
import { Card } from '../components/ui/Card';

export const NewTransaction = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Add Transaction</h2>
        <p className="text-slate-500">Log your income or expenses.</p>
      </div>

      <Card>
        <TransactionForm />
      </Card>
    </div>
  );
};
