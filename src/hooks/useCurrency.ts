import { useState, useEffect } from 'react';
import { getExchangeRates } from '../services/currencyService';
import { useFinance } from '../context/FinanceContext';

export const useCurrency = () => {
  const { budget } = useFinance();
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      const data = await getExchangeRates(budget.currency);
      if (data) setRates(data);
      setLoading(false);
    };
    fetchRates();
  }, [budget.currency]);

  const convert = (amount: number, toCurrency: string) => {
    if (!rates[toCurrency]) return amount;
    return amount * rates[toCurrency];
  };

  return { rates, loading, convert, currentCurrency: budget.currency };
};
