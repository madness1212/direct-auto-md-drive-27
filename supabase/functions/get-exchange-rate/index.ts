import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching exchange rate from BNM...');
    
    // Obține cursul de la Banca Națională a Moldovei
    const response = await fetch('https://www.bnm.md/ro/official-exchange-rates?get_xml=1');
    
    if (!response.ok) {
      throw new Error(`BNM API responded with status: ${response.status}`);
    }
    
    const xmlText = await response.text();
    console.log('BNM XML response received');
    
    // Parse XML pentru a găsi cursul EUR
    const eurMatch = xmlText.match(/<Valute><NumCode>978<\/NumCode><CharCode>EUR<\/CharCode><Nominal>1<\/Nominal><Name>Euro<\/Name><Value>([\d.]+)<\/Value><\/Valute>/);
    
    if (!eurMatch) {
      throw new Error('EUR exchange rate not found in BNM response');
    }
    
    const eurRate = parseFloat(eurMatch[1]);
    console.log(`EUR rate found: ${eurRate}`);
    
    if (isNaN(eurRate) || eurRate <= 0) {
      throw new Error('Invalid EUR exchange rate');
    }
    
    return new Response(
      JSON.stringify({ 
        rate: eurRate,
        source: 'BNM',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    
    // Fallback la un curs predefinit în caz de eroare
    const fallbackRate = 19.5;
    console.log(`Using fallback rate: ${fallbackRate}`);
    
    return new Response(
      JSON.stringify({ 
        rate: fallbackRate,
        source: 'fallback',
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});