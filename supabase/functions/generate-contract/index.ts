import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Helper function to process DOCX file properly
async function processDocxFile(templateBuffer: Uint8Array, replacements: Record<string, string>): Promise<Uint8Array> {
  // Import JSZip for handling DOCX files (which are ZIP archives)
  const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default;
  
  try {
    // Load the DOCX file as a ZIP
    const zip = await JSZip.loadAsync(templateBuffer);
    
    // Process the main document content
    const documentXml = await zip.file('word/document.xml')?.async('string');
    if (documentXml) {
      let processedXml = documentXml;
      
      // Replace placeholders in the XML content
      for (const [key, value] of Object.entries(replacements)) {
        const placeholder = `#${key}#`;
        processedXml = processedXml.replaceAll(placeholder, String(value || ''));
      }
      
      // Update the file in the ZIP
      zip.file('word/document.xml', processedXml);
    }
    
    // Process header files if they exist
    const headerFiles = Object.keys(zip.files).filter(name => name.startsWith('word/header'));
    for (const headerFile of headerFiles) {
      const headerXml = await zip.file(headerFile)?.async('string');
      if (headerXml) {
        let processedHeaderXml = headerXml;
        for (const [key, value] of Object.entries(replacements)) {
          const placeholder = `#${key}#`;
          processedHeaderXml = processedHeaderXml.replaceAll(placeholder, String(value || ''));
        }
        zip.file(headerFile, processedHeaderXml);
      }
    }
    
    // Process footer files if they exist
    const footerFiles = Object.keys(zip.files).filter(name => name.startsWith('word/footer'));
    for (const footerFile of footerFiles) {
      const footerXml = await zip.file(footerFile)?.async('string');
      if (footerXml) {
        let processedFooterXml = footerXml;
        for (const [key, value] of Object.entries(replacements)) {
          const placeholder = `#${key}#`;
          processedFooterXml = processedFooterXml.replaceAll(placeholder, String(value || ''));
        }
        zip.file(footerFile, processedFooterXml);
      }
    }
    
    // Generate the new DOCX file
    const processedBuffer = await zip.generateAsync({ 
      type: 'uint8array',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
    
    return processedBuffer;
  } catch (error) {
    console.error('Error processing DOCX file:', error);
    throw new Error(`Failed to process DOCX file: ${error.message}`);
  }
}

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
  extraInfo?: any; // Additional car information for contract
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

    const { carId, clientId, newClient, templateFile, extraInfo }: ContractGenerationRequest = await req.json();

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

    // Merge extra info with car data if provided
    const finalCarData = extraInfo ? { ...carData, ...extraInfo } : carData;

    // Prepare template data
    const templateData: Record<string, any> = {
      "data": new Date().toLocaleDateString('ro-RO'),
      "numarContract": contractNumber,
      "numeCumparator": clientData.nume_cumparator || '',
      "numePrenumeCumparator": clientData.nume_prenume_cumparator || '',
      "numePrenume": clientData.nume_prenume_cumparator || '',
      "idnp": clientData.idnp || '',
      "adresa": clientData.adresa || '',
      "tel": clientData.telefon || '',
      "telefon": clientData.telefon || '',
      
      // Car information
      "marca": finalCarData.marca || '',
      "model": finalCarData.model || '',
      "modelMasina": `${finalCarData.marca || ''} ${finalCarData.model || ''}`.trim(),
      "anFabricatie": finalCarData.an_fabricatie?.toString() || '',
      "kilometraj": finalCarData.kilometraj?.toString() || '',
      "tipMotor": finalCarData.tip_motor || '',
      "cutieViteze": finalCarData.cutie_viteze || '',
      "tractiune": finalCarData.tractiune || '',
      "putere": finalCarData.putere || '',
      "caroserie": finalCarData.caroserie || '',
      
      // Additional contract information
      "vin": finalCarData.vin || '',
      "culoare": finalCarData.culoare || '',
      "categoriaVehiculului": finalCarData.categoria_vehicului || finalCarData.caroserie || '',
      "capacitateMotor": finalCarData.capacitate_motor || '',
      "greutateaMasinii": finalCarData.greutatea_masinii?.toString() || '',
      "sarcinaIncarcata": finalCarData.sarcina_incarcata?.toString() || '',
      
      // Pricing information
      "pret": finalCarData.pret?.toString() || '',
      "pretTotal": finalCarData.pret_total?.toString() || finalCarData.pret?.toString() || '',
      "pretInCuvinte": finalCarData.pret_in_cuvinte || '',
      "pret2": finalCarData.pret?.toString() || '',
      "pretInCuvinte2": finalCarData.pret_in_cuvinte || '',
      
      // Descriptions
      "descriere": finalCarData.descriere || '',
      "descriereRo": finalCarData.descriere_ro || '',
      "descriereRu": finalCarData.descriere_ru || '',
      "descriereEn": finalCarData.descriere_en || ''
    };

    // Decode base64 template file
    const templateBuffer = Uint8Array.from(atob(templateFile), c => c.charCodeAt(0));

    // Process DOCX file properly using JSZip
    console.log('Processing DOCX file with proper ZIP handling');
    const processedDoc = await processDocxFile(templateBuffer, templateData);

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