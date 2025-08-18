import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContractGenerationRequest {
  carId: string;
  clientId?: string;
  newClient?: {
    nume_cumparator: string;
    nume_prenume_cumparator: string;
    idnp: string;
    adresa: string;
    telefon: string;
  };
  templateFile: string; // base64 encoded DOCX file
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get current user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { carId, clientId, newClient, templateFile }: ContractGenerationRequest = await req.json();

    // Fetch car data
    const { data: carData, error: carError } = await supabaseClient
      .from('car_listings')
      .select('*')
      .eq('id', carId)
      .single();

    if (carError || !carData) {
      throw new Error('Car not found');
    }

    let clientData;

    // Handle client data - either existing or new
    if (newClient) {
      // Validate new client data
      if (!newClient.idnp || newClient.idnp.length !== 13 || !/^[0-9]{13}$/.test(newClient.idnp)) {
        throw new Error('IDNP-ul trebuie să conțină exact 13 cifre');
      }

      if (!newClient.telefon || !/^\+?[0-9\s\-\(\)]+$/.test(newClient.telefon)) {
        throw new Error('Numărul de telefon are un format invalid');
      }

      if (!newClient.nume_cumparator || !newClient.nume_prenume_cumparator || !newClient.adresa) {
        throw new Error('Te rog să completezi toate câmpurile obligatorii');
      }

      // Create new client
      const { data: newClientData, error: clientCreateError } = await supabaseClient
        .from('clients')
        .insert([{ ...newClient, user_id: user.id }])
        .select()
        .single();

      if (clientCreateError) throw clientCreateError;
      clientData = newClientData;
    } else if (clientId) {
      // Fetch existing client
      const { data: existingClient, error: clientError } = await supabaseClient
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError || !existingClient) {
        throw new Error('Client not found');
      }
      clientData = existingClient;
    } else {
      throw new Error('No client data provided');
    }

    // Generate contract number
    const contractNumber = `CT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // Prepare template data
    const templateData: Record<string, any> = {
      "data": new Date().toLocaleDateString('ro-RO'),
      "numarContract": contractNumber,
      "numeCumparator": clientData.nume_cumparator || '',
      "modelMasina": `${carData.marca || ''} ${carData.model || ''}`.trim(),
      "vin": carData.vin || '',
      "anFabricatie": carData.an_fabricatie?.toString() || '',
      "culoare": carData.culoare || '',
      "categoriaVehiculului": carData.caroserie || carData.categoria_vehicului || '',
      "capacitateMotor": carData.capacitate_motor || '',
      "greutateaMasinii": carData.greutatea_masinii?.toString() || '',
      "sarcinaIncarcata": carData.sarcina_incarcata?.toString() || '',
      "pret": carData.pret?.toString() || '',
      "pretTotal": carData.pret_total?.toString() || '',
      "pretInCuvinte": carData.pret_in_cuvinte || '',
      "pret2": carData.pret?.toString() || '',
      "pretInCuvinte2": carData.pret_in_cuvinte || '',
      "numePrenumeCumparator": clientData.nume_prenume_cumparator || '',
      "idnp": clientData.idnp || '',
      "adresa": clientData.adresa || '',
      "tel": clientData.telefon || '',
      "numePrenume": clientData.nume_prenume_cumparator || ''
    };

    // Decode base64 template file
    const templateBuffer = Uint8Array.from(atob(templateFile), c => c.charCodeAt(0));

    // Simple placeholder replacement for DOCX
    let docContent = new TextDecoder().decode(templateBuffer);
    
    // Replace placeholders in the format #{placeholder}
    Object.entries(templateData).forEach(([key, value]) => {
      const placeholder = `#{${key}}`;
      docContent = docContent.replaceAll(placeholder, String(value || ''));
    });

    const processedDoc = new TextEncoder().encode(docContent);

    // Upload processed document to storage
    const processedFileName = `${user.id}/contracts/${contractNumber}_contract.docx`;
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('car-documents')
      .upload(processedFileName, processedDoc, {
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

    if (uploadError) throw uploadError;

    // Save contract to database
    const { data: contractData, error: contractError } = await supabaseClient
      .from('contracts')
      .insert([{
        contract_number: contractNumber,
        car_id: carData.id,
        client_id: clientData.id,
        contract_date: new Date().toISOString().split('T')[0],
        template_path: uploadData.path,
        user_id: user.id
      }])
      .select()
      .single();

    if (contractError) throw contractError;

    // Update car status to sold
    await supabaseClient
      .from('car_listings')
      .update({ status: 'sold' })
      .eq('id', carData.id);

    return new Response(
      JSON.stringify({
        success: true,
        contractNumber,
        contractId: contractData.id,
        message: `Contractul ${contractNumber} a fost generat cu succes.`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error generating contract:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'A apărut o eroare la generarea contractului'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});