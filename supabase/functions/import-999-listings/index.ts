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
        formats: ['markdown', 'html']
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
      console.log('Parsing content manually since we use simple scraping...');
      // Get the content from Firecrawl response
      const content = firecrawlData.data?.markdown || firecrawlData.data?.content || firecrawlData.markdown || firecrawlData.content || '';
      const htmlContent = firecrawlData.data?.html || firecrawlData.html || '';
      carListings = parseContentManually(content, htmlContent);
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

    // Get the current user from the JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }
    
    // Initialize Supabase client for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Create a client with the user's JWT to get user info
    const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY')!;
    const userClient = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { authorization: authHeader } }
    });
    
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Failed to get user information');
    }

    // Process and insert car listings
    const insertedListings = [];
    const errors = [];

    for (const listing of carListings) {
      try {
        console.log(`Processing listing ${listing.marca} ${listing.model}...`);
        
        // Upload images to Supabase Storage
        const uploadedImageUrls: string[] = [];
        for (let i = 0; i < listing.images.length; i++) {
          const imageUrl = listing.images[i];
          if (imageUrl.startsWith('http')) {
            // Generate unique filename
            const timestamp = Date.now();
            const fileName = `999md-import/${listing.marca}-${listing.model}-${timestamp}-${i}.jpg`;
            
            const uploadedUrl = await uploadImageFromUrl(imageUrl, fileName, supabase);
            if (uploadedUrl) {
              uploadedImageUrls.push(uploadedUrl);
            }
          }
        }
        
        console.log(`Uploaded ${uploadedImageUrls.length} images for ${listing.marca} ${listing.model}`);
        
        // Validate and clean data with proper capitalization
        const cleanedListing = {
          marca: capitalizeText(listing.marca || 'Unknown'),
          model: capitalizeText(listing.model || 'Unknown'),
          an_fabricatie: listing.an_fabricatie || new Date().getFullYear(),
          pret: listing.pret || 0,
          kilometraj: listing.kilometraj || 0,
          tip_motor: listing.tip_motor || 'benzina',
          cutie_viteze: listing.cutie_viteze || 'manuala',
          caroserie: capitalizeText(listing.caroserie || 'sedan'),
          descriere: listing.descriere || 'Importat de pe 999.md',
          descriere_ro: listing.descriere || 'Importat de pe 999.md',
          descriere_en: listing.descriere || 'Imported from 999.md',
          descriere_ru: listing.descriere || 'Импортировано с 999.md',
          images: uploadedImageUrls, // Use uploaded Storage URLs
          status: 'active',
          tractiune: capitalizeText('fata'), // default value
          video_url: '',
          is_top_offer: false,
          is_coming_soon: false,
          created_by: user.id // Add the user ID for RLS policies
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

// Helper function to capitalize text properly
function capitalizeText(text: string): string {
  return text.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper function to download and upload images to Supabase Storage
async function uploadImageFromUrl(imageUrl: string, fileName: string, supabase: any): Promise<string | null> {
  try {
    console.log('Downloading image:', imageUrl);
    
    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error('Failed to download image:', response.status);
      return null;
    }
    
    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('car-images')
      .upload(fileName, uint8Array, {
        contentType: imageBlob.type || 'image/jpeg',
        upsert: true
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      return null;
    }
    
    // Return the public URL
    const { data: publicUrlData } = supabase.storage
      .from('car-images')
      .getPublicUrl(fileName);
    
    console.log('Image uploaded successfully:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

function parseContentManually(content: string, htmlContent: string = ''): CarListing[] {
  const listings: CarListing[] = [];
  console.log('Content length:', content.length);
  console.log('HTML content length:', htmlContent.length);
  
  // Extract image URLs from HTML content
  const imageUrls: string[] = [];
  if (htmlContent) {
    const imgMatches = htmlContent.match(/<img[^>]+src="([^"]+)"/gi);
    if (imgMatches) {
      imgMatches.forEach(match => {
        const srcMatch = match.match(/src="([^"]+)"/i);
        if (srcMatch && srcMatch[1]) {
          const imageUrl = srcMatch[1];
          // Only include images that look like car photos (avoid tiny icons, logos etc)
          if (imageUrl.includes('999.md') || imageUrl.includes('cdn') || imageUrl.includes('img') || imageUrl.includes('photo')) {
            imageUrls.push(imageUrl);
          }
        }
      });
    }
  }
  
  console.log(`Found ${imageUrls.length} potential car images`);
  
  // Try to find car listings using various patterns
  const lines = content.split('\n');
  let currentListing: Partial<CarListing> = {};
  
  for (const line of lines) {
    const trimmedLine = line.trim().toLowerCase();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Look for prices (in various formats)
    const priceMatch = trimmedLine.match(/(\d+[\s,]*\d*)\s*(euro|eur|€|\$|lei)/i);
    if (priceMatch) {
      const price = parseInt(priceMatch[1].replace(/[^\d]/g, ''));
      if (price > 500 && price < 200000) { // Reasonable car price range
        if (currentListing.pret) {
          // Save previous listing and start new one
          if (currentListing.marca && currentListing.model) {
            listings.push(currentListing as CarListing);
          }
          currentListing = {};
        }
        currentListing.pret = price;
      }
    }
    
    // Look for years
    const yearMatch = trimmedLine.match(/\b(20[0-2][0-9]|19[8-9][0-9])\b/);
    if (yearMatch && currentListing.pret) {
      currentListing.an_fabricatie = parseInt(yearMatch[1]);
    }
    
    // Look for common car brands
    const brands = ['mercedes', 'bmw', 'audi', 'volkswagen', 'toyota', 'honda', 'ford', 'opel', 'skoda', 'nissan', 'hyundai', 'kia', 'mazda', 'renault', 'peugeot', 'citroen', 'fiat', 'alfa', 'volvo', 'lexus', 'infiniti', 'acura', 'cadillac', 'chevrolet', 'dodge', 'jeep', 'land', 'rover', 'jaguar', 'porsche', 'mini', 'smart', 'seat', 'dacia'];
    
    for (const brand of brands) {
      if (trimmedLine.includes(brand) && currentListing.pret && !currentListing.marca) {
        currentListing.marca = capitalizeText(brand);
        
        // Try to extract model from the same line
        const brandIndex = trimmedLine.indexOf(brand);
        const afterBrand = trimmedLine.substring(brandIndex + brand.length).trim();
        const modelMatch = afterBrand.match(/^([a-z0-9\-\s]+)/i);
        if (modelMatch) {
          currentListing.model = capitalizeText(modelMatch[1].trim().split(' ')[0]);
        }
        break;
      }
    }
    
    // Look for mileage
    const mileageMatch = trimmedLine.match(/(\d+[\s,]*\d*)\s*(km|mil)/i);
    if (mileageMatch && currentListing.pret) {
      const mileage = parseInt(mileageMatch[1].replace(/[^\d]/g, ''));
      if (mileage < 1000000) { // Reasonable mileage range
        currentListing.kilometraj = mileage;
      }
    }
    
    // Look for engine types
    if (trimmedLine.includes('diesel') && currentListing.pret) {
      currentListing.tip_motor = 'diesel';
    } else if (trimmedLine.includes('benzin') && currentListing.pret) {
      currentListing.tip_motor = 'benzina';
    } else if (trimmedLine.includes('hibrid') && currentListing.pret) {
      currentListing.tip_motor = 'hibrid';
    } else if (trimmedLine.includes('electric') && currentListing.pret) {
      currentListing.tip_motor = 'electric';
    } else if (trimmedLine.includes('gpl') && currentListing.pret) {
      currentListing.tip_motor = 'GPL';
    }
    
    // Look for transmission
    if (trimmedLine.includes('automat') && currentListing.pret) {
      currentListing.cutie_viteze = 'automata';
    } else if (trimmedLine.includes('manual') && currentListing.pret) {
      currentListing.cutie_viteze = 'manuala';
    }
  }
  
  // Add the last listing if it's complete
  if (currentListing.pret && currentListing.marca && currentListing.model) {
    listings.push(currentListing as CarListing);
  }
  
  // Distribute images among listings
  const imagesPerListing = Math.floor(imageUrls.length / Math.max(listings.length, 1));
  
  // Fill in missing values with defaults and proper capitalization
  const completeListings = listings.map((listing, index) => {
    // Assign images to this listing
    const startIndex = index * imagesPerListing;
    const endIndex = startIndex + imagesPerListing;
    const listingImages = imageUrls.slice(startIndex, endIndex);
    
    return {
      marca: capitalizeText(listing.marca || 'Unknown'),
      model: capitalizeText(listing.model || 'Unknown'),
      an_fabricatie: listing.an_fabricatie || new Date().getFullYear(),
      pret: listing.pret || 0,
      kilometraj: listing.kilometraj || 0,
      tip_motor: listing.tip_motor || 'benzina',
      cutie_viteze: listing.cutie_viteze || 'manuala',
      caroserie: capitalizeText(listing.caroserie || 'sedan'),
      descriere: `${capitalizeText(listing.marca || 'Unknown')} ${capitalizeText(listing.model || 'Unknown')} - Importat de pe 999.md`,
      images: listingImages // Raw URLs, will be processed later
    };
  });
  
  console.log(`Parsed ${completeListings.length} car listings from content`);
  return completeListings;
}