import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { NewTransaction } from './pages/NewTransaction';
import { BudgetPage } from './pages/Budget';
import { Analytics } from './pages/Analytics';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <FinanceProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/new" element={<NewTransaction />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
        <ToastContainer position="bottom-right" theme="colored" aria-label="Notifications" />
      </Router>
    </FinanceProvider>
  );
}
