import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestDriveRequest {
  carId: string;
  fullName: string;
  phone: string;
  email: string;
  preferredDate: string;
  message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: TestDriveRequest = await req.json();
    
    // Validare date de intrare
    if (!body.carId || !body.fullName || !body.phone || !body.email || !body.preferredDate) {
      return new Response(
        JSON.stringify({ error: 'Toate câmpurile obligatorii trebuie completate' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Verifică dacă mașina există
    const { data: car, error: carError } = await supabase
      .from('car_listings')
      .select('id, marca, model')
      .eq('id', body.carId)
      .eq('status', 'active')
      .single();

    if (carError || !car) {
      return new Response(
        JSON.stringify({ error: 'Mașina nu a fost găsită' }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Inserează cererea de test drive
    const { data, error } = await supabase
      .from('test_drive_requests')
      .insert({
        car_id: body.carId,
        full_name: body.fullName,
        phone: body.phone,
        email: body.email,
        preferred_date: body.preferredDate,
        message: body.message || null,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting test drive request:', error);
      return new Response(
        JSON.stringify({ error: 'Eroare la salvarea cererii' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log('Test drive request created:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Cererea ta a fost înregistrată. Te vom contacta în curând.',
        data: data 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error('Error in submit-test-drive-request function:', error);
    return new Response(
      JSON.stringify({ error: 'Eroare internă a serverului' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});