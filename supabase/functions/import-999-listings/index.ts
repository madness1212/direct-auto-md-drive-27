import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CarListing {
  marca: string;
  model: string;
  an_fabricatie: number;
  pret: number;
  kilometraj?: number;
  tip_motor: string;
  cutie_viteze: string;
  caroserie?: string;
  descriere: string;
  images: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting 999.md import process...');

    const { url } = await req.json();
    
    if (!url) {
      throw new Error('URL is required');
    }

    // Get Firecrawl API key from secrets
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      throw new Error('FIRECRAWL_API_KEY not found in secrets');
    }

    console.log('Making request to Firecrawl API...');
    
    // Use Firecrawl to scrape the website
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        formats: ['extract'],
        extract: {
          schema: {
            type: "object",
            properties: {
              listings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    marca: { type: "string", description: "Car brand/make" },
                    model: { type: "string", description: "Car model" },
                    an_fabricatie: { type: "number", description: "Year of manufacture" },
                    pret: { type: "number", description: "Price in euros" },
                    kilometraj: { type: "number", description: "Mileage in kilometers" },
                    tip_motor: { type: "string", description: "Engine type: benzina, diesel, hibrid, electric, GPL" },
                    cutie_viteze: { type: "string", description: "Transmission: manuala, automata, CVT" },
                    caroserie: { type: "string", description: "Body type: SUV, sedan, hatchback, combi, coupe, cabriolet" },
                    descriere: { type: "string", description: "Car description" },
                    images: { type: "array", items: { type: "string" }, description: "Array of image URLs" }
                  },
                  required: ["marca", "model", "an_fabricatie", "pret", "tip_motor", "cutie_viteze"]
                }
              }
            }
          }
        }
      })
    });

    if (!firecrawlResponse.ok) {
      const errorText = await firecrawlResponse.text();
      console.error('Firecrawl API error:', errorText);
      throw new Error(`Firecrawl API error: ${firecrawlResponse.status} - ${errorText}`);
    }

    const firecrawlData = await firecrawlResponse.json();
    console.log('Firecrawl response received:', firecrawlData);

    if (!firecrawlData.success) {
      throw new Error('Firecrawl scraping failed');
    }

    // Parse the extracted data
    let carListings: CarListing[] = [];
    
    try {
      if (firecrawlData.extract) {
        carListings = firecrawlData.extract.listings || [];
      } else if (firecrawlData.data?.extract) {
        carListings = firecrawlData.data.extract.listings || [];
      } else {
        console.log('No extraction found, trying to parse content manually...');
        // Fallback: try to extract basic info from content
        const content = firecrawlData.data?.content || firecrawlData.content || '';
        carListings = parseContentManually(content);
      }
    } catch (parseError) {
      console.error('Error parsing extracted data:', parseError);
      carListings = [];
    }

    console.log(`Extracted ${carListings.length} car listings`);

    if (carListings.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No car listings found on the provided URL',
        extractedContent: firecrawlData.data?.content?.substring(0, 500) || 'No content extracted'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Process and insert car listings
    const insertedListings = [];
    const errors = [];

    for (const listing of carListings) {
      try {
        // Validate and clean data
        const cleanedListing = {
          marca: listing.marca || 'Unknown',
          model: listing.model || 'Unknown',
          an_fabricatie: listing.an_fabricatie || new Date().getFullYear(),
          pret: listing.pret || 0,
          kilometraj: listing.kilometraj || 0,
          tip_motor: listing.tip_motor || 'benzina',
          cutie_viteze: listing.cutie_viteze || 'manuala',
          caroserie: listing.caroserie || 'sedan',
          descriere: listing.descriere || 'Imported from 999.md',
          descriere_ro: listing.descriere || 'Importat de pe 999.md',
          descriere_en: listing.descriere || 'Imported from 999.md',
          descriere_ru: listing.descriere || 'Импортировано с 999.md',
          images: listing.images || [],
          status: 'active',
          tractiune: 'fata', // default value
          video_url: '',
          is_top_offer: false,
          is_coming_soon: false
        };

        const { data, error } = await supabase
          .from('car_listings')
          .insert(cleanedListing)
          .select();

        if (error) {
          console.error('Error inserting listing:', error);
          errors.push({ listing: cleanedListing, error: error.message });
        } else {
          insertedListings.push(data[0]);
        }
      } catch (listingError) {
        console.error('Error processing listing:', listingError);
        errors.push({ listing, error: listingError.message });
      }
    }

    console.log(`Successfully imported ${insertedListings.length} listings`);
    console.log(`Errors: ${errors.length}`);

    return new Response(JSON.stringify({
      success: true,
      imported: insertedListings.length,
      errors: errors.length,
      listings: insertedListings,
      errorDetails: errors
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Import error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});

function parseContentManually(content: string): CarListing[] {
  // Basic fallback parser for when LLM extraction fails
  const listings: CarListing[] = [];
  
  // This is a simple implementation - you might want to enhance this
  // based on the actual structure of 999.md pages
  const priceMatches = content.match(/(\d+)\s*(euro|eur|€)/gi);
  const yearMatches = content.match(/20\d{2}/g);
  
  if (priceMatches && priceMatches.length > 0) {
    priceMatches.forEach((priceMatch, index) => {
      const price = parseInt(priceMatch.replace(/[^\d]/g, ''));
      const year = yearMatches && yearMatches[index] ? parseInt(yearMatches[index]) : new Date().getFullYear();
      
      listings.push({
        marca: 'Unknown',
        model: 'Unknown',
        an_fabricatie: year,
        pret: price,
        kilometraj: 0,
        tip_motor: 'benzina',
        cutie_viteze: 'manuala',
        caroserie: 'sedan',
        descriere: 'Imported from 999.md - manual parsing',
        images: []
      });
    });
  }
  
  return listings;
}