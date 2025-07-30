import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GenerateCodeRequest {
  userEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail }: GenerateCodeRequest = await req.json();

    if (!userEmail) {
      return new Response(
        JSON.stringify({ error: "Email-ul utilizatorului este obligatoriu" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Email-ul administratorului care va primi codul
    const adminEmail = 'vladvicol09@gmail.com';

    // Creez clientul Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generez un cod unic de 8 caractere
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Setez timpul de expirare la 1 oră de acum
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Șterge codurile vechi pentru același email utilizator
    await supabase
      .from('registration_codes')
      .delete()
      .eq('email', userEmail);

    // Inserez codul nou în baza de date (asociat cu email-ul utilizatorului)
    const { error: insertError } = await supabase
      .from('registration_codes')
      .insert([{
        code,
        email: userEmail,
        expires_at: expiresAt.toISOString(),
        used: false
      }]);

    if (insertError) {
      console.error('Error inserting code:', insertError);
      return new Response(
        JSON.stringify({ error: "Eroare la generarea codului" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Trimit email-ul cu codul la administrator
    const emailResponse = await resend.emails.send({
      from: "Direct Auto MD <directauto.direct@gmail.com>",
      to: [adminEmail],
      subject: "Solicitare cod de înregistrare - Direct Auto MD",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; text-align: center;">Direct Auto MD - Administrare</h1>
          <h2 style="color: #333;">Solicitare cod de înregistrare</h2>
          <p>Bună ziua,</p>
          <p>Un utilizator cu email-ul <strong>${userEmail}</strong> a solicitat un cod de înregistrare pentru platforma Direct Auto MD.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0; margin-bottom: 10px;">Detalii solicitare:</h3>
            <p style="margin: 5px 0;"><strong>Email utilizator:</strong> ${userEmail}</p>
            <p style="margin: 5px 0;"><strong>Data solicitării:</strong> ${new Date().toLocaleString('ro-RO')}</p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="color: #1e40af; margin: 0;">Codul de înregistrare este:</h3>
            <div style="font-size: 28px; font-weight: bold; color: #1e40af; letter-spacing: 3px; margin: 15px 0; font-family: monospace;">
              ${code}
            </div>
            <p style="color: #1e40af; margin: 0; font-size: 14px;">Transmiteți acest cod utilizatorului pentru înregistrare</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;"><strong>⚠️ Important:</strong> Acest cod este valabil doar pentru <strong>1 oră</strong> de la momentul generării și poate fi folosit o singură dată.</p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Sistem de administrare Direct Auto MD<br>
            Email generat automat - nu răspundeți la acest email
          </p>
        </div>
      `,
    });

    console.log("Registration code email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Codul de înregistrare a fost trimis administratorului" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in generate-registration-code function:", error);
    return new Response(
      JSON.stringify({ error: "Eroare internă a serverului" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);