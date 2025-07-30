import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExchangeRateData {
  rate: number;
  source: string;
  timestamp: string;
  error?: string;
}

export const useExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState<number>(19.5); // fallback default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setLoading(true);
        console.log('Fetching exchange rate...');
        
        const { data, error } = await supabase.functions.invoke('get-exchange-rate');
        
        if (error) {
          throw error;
        }
        
        const responseData = data as ExchangeRateData;
        console.log('Exchange rate data:', responseData);
        
        if (responseData.rate && responseData.rate > 0) {
          setExchangeRate(responseData.rate);
          setError(responseData.error || null);
        } else {
          throw new Error('Invalid exchange rate received');
        }
        
      } catch (err) {
        console.error('Error fetching exchange rate:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Păstrează rata de fallback
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRate();
    
    // Actualizează cursul la fiecare 30 de minute
    const interval = setInterval(fetchExchangeRate, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatMDLPrice = (eurPrice: number) => {
    const mdlPrice = eurPrice * exchangeRate;
    return `≈ ${mdlPrice.toLocaleString()} MDL`;
  };

  return {
    exchangeRate,
    loading,
    error,
    formatMDLPrice
  };
};