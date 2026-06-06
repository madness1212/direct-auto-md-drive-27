// Edge function: proxy + import for 999.md partners API
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const API_BASE = "https://partners-api.999.md";
const IMG_PREFIX = "https://i.simpalsmedia.com/999.md/BoardImages/900x900/";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function basicAuthHeader(apiKey: string) {
  return "Basic " + btoa(`${apiKey}:`);
}

async function api(path: string, apiKey: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: basicAuthHeader(apiKey) },
  });
  const text = await res.text();
  let data: any = null;
  try { data = JSON.parse(text); } catch { /* ignore */ }
  if (!res.ok) {
    throw new Error(`999.md API ${res.status}: ${text.slice(0, 200)}`);
  }
  return data;
}

// Resolve dropdown option title from a feature's options[]
function optionTitle(feature: any, value: any): string | null {
  if (!feature?.options || value == null) return null;
  const opt = feature.options.find((o: any) => String(o.id) === String(value));
  return opt ? String(opt.title) : null;
}

function findFeature(groups: any[], id: number) {
  for (const g of groups) {
    for (const f of g.feature) {
      if (Number(f.id) === id) return f;
    }
  }
  return null;
}

// Map 999.md fuel option title to project enum
function mapFuel(title: string | null): string {
  if (!title) return "benzina";
  const t = title.toLowerCase();
  if (t.includes("diesel") || t.includes("motorină") || t.includes("motorina")) return "diesel";
  if (t.includes("hibrid") && t.includes("diesel")) return "hybrid_diesel";
  if (t.includes("plug")) return "plug-in hybrid";
  if (t.includes("hibrid") || t.includes("hybrid")) return "hybrid";
  if (t.includes("electric")) return "electric";
  if (t.includes("gaz") || t.includes("gpl")) return "gpl";
  return "benzina";
}

function mapGearbox(title: string | null): string {
  if (!title) return "manuala";
  const t = title.toLowerCase();
  if (t.includes("autom") || t.includes("авто")) return "automata";
  return "manuala";
}

function mapBody(title: string | null): string {
  if (!title) return "sedan";
  return title.toLowerCase();
}

function mapTraction(title: string | null): string {
  if (!title) return "fata";
  const t = title.toLowerCase();
  if (t.includes("4") || t.includes("integral") || t.includes("полн")) return "integrala";
  if (t.includes("spate") || t.includes("задн")) return "spate";
  return "fata";
}

// Parse a 999.md advert detail into our schema fields
function parseAdvertDetail(advert: any, features: any) {
  const groups = features?.featuresGroups || [];

  const fMarca = findFeature(groups, 20);
  const fModel = findFeature(groups, 21);
  const fYear = findFeature(groups, 19);
  const fKm = findFeature(groups, 104);
  const fBody = findFeature(groups, 102);
  const fFuel = findFeature(groups, 151);
  const fGear = findFeature(groups, 101);
  const fDrive = findFeature(groups, 108);
  const fColor = findFeature(groups, 17);
  const fPower = findFeature(groups, 107);
  const fVin = findFeature(groups, 2512);
  const fDesc = findFeature(groups, 13);
  const fImages = findFeature(groups, 14);

  const descVal = fDesc?.value;
  const descRo = typeof descVal === "object" ? (descVal?.ro || descVal?.ru || "") : (descVal || "");
  const descRu = typeof descVal === "object" ? (descVal?.ru || descRo) : descRo;

  const imageIds: string[] = (fImages?.value as string[]) || (advert?.images?.value as string[]) || [];
  const images = imageIds.map((id) => `${IMG_PREFIX}${id}`);

  const marca = optionTitle(fMarca, fMarca?.value) || "Unknown";
  // Model options are loaded dynamically by 999.md based on marca and are NOT
  // included in the features payload, so optionTitle() returns null. Derive
  // the model from advert.title by stripping the marca prefix.
  let model = optionTitle(fModel, fModel?.value);
  if (!model) {
    const title = String(advert?.title || "").trim();
    if (marca && marca !== "Unknown" && title.toLowerCase().startsWith(marca.toLowerCase())) {
      model = title.slice(marca.length).trim();
    } else {
      // Fallback: take everything after the first word in the title
      const parts = title.split(/\s+/);
      model = parts.length > 1 ? parts.slice(1).join(" ") : title;
    }
  }
  if (!model) model = "Unknown";
  const an = Number(fYear?.value) || new Date().getFullYear();
  const km = Number(fKm?.value) || 0;
  const pret = Number(advert?.price?.value) || 0;

  return {
    id_999: String(advert.id),
    title: advert.title,
    marca,
    model,
    an_fabricatie: an,
    kilometraj: km,
    pret,
    caroserie: mapBody(optionTitle(fBody, fBody?.value)),
    tip_motor: mapFuel(optionTitle(fFuel, fFuel?.value)),
    cutie_viteze: mapGearbox(optionTitle(fGear, fGear?.value)),
    tractiune: mapTraction(optionTitle(fDrive, fDrive?.value)),
    culoare: optionTitle(fColor, fColor?.value) || null,
    putere: fPower?.value ? `${fPower.value} ${fPower.unit || "cp"}` : null,
    vin: fVin?.value || null,
    descriere: descRo,
    descriere_ro: descRo,
    descriere_ru: descRu,
    descriere_en: descRo,
    images,
    state: advert.state,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const apiKey = Deno.env.get("API_999_KEY");
  if (!apiKey) return jsonResponse({ error: "API_999_KEY not configured" }, 500);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  // Auth: require logged-in admin
  const authHeader = req.headers.get("authorization") || "";
  const jwt = authHeader.replace("Bearer ", "");
  const userClient = createClient(supabaseUrl, anonKey);
  const { data: { user } } = await userClient.auth.getUser(jwt);
  if (!user) return jsonResponse({ error: "Unauthorized" }, 401);

  // Check admin role
  const { data: prof } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (prof?.role !== "admin") return jsonResponse({ error: "Forbidden" }, 403);

  try {
    const body = req.method === "POST" ? await req.json() : {};
    const action = body.action || new URL(req.url).searchParams.get("action") || "list";

    if (action === "list") {
      // Fetch all pages
      const all: any[] = [];
      let page = 1;
      const pageSize = 100;
      while (true) {
        const data = await api(`/adverts?lang=ro&page=${page}&page_size=${pageSize}`, apiKey);
        const items = data?.adverts || [];
        all.push(...items);
        if (items.length < pageSize) break;
        page++;
        if (page > 20) break; // safety
      }

      const simplified = all.map((a: any) => ({
        id_999: String(a.id),
        title: a.title,
        price: a.price?.value || 0,
        price_unit: a.price?.unit || "eur",
        state: a.state,
        thumbnail: a.images?.value?.[0]
          ? `https://i.simpalsmedia.com/999.md/BoardImages/320x240/${a.images.value[0]}`
          : null,
        posted: a.posted,
      }));

      // Fetch existing id_999 list from DB to mark as imported
      const ids = simplified.map((s) => s.id_999);
      const { data: existing } = await supabase
        .from("car_listings")
        .select("id, id_999, an_fabricatie")
        .in("id_999", ids);
      const existingMap = new Map((existing || []).map((e: any) => [e.id_999, e]));

      const result = simplified.map((s) => ({
        ...s,
        imported: existingMap.has(s.id_999),
        local_id: existingMap.get(s.id_999)?.id || null,
        an_fabricatie: existingMap.get(s.id_999)?.an_fabricatie || null,
      }));

      return jsonResponse({ adverts: result });
    }

    if (action === "detail") {
      const id = body.id_999;
      if (!id) return jsonResponse({ error: "id_999 required" }, 400);
      const [advert, features] = await Promise.all([
        api(`/adverts/${id}?lang=ro`, apiKey),
        api(`/adverts/${id}/features?lang=ro`, apiKey),
      ]);
      const parsed = parseAdvertDetail(advert, features);
      return jsonResponse({ detail: parsed });
    }

    if (action === "import" || action === "update") {
      const id = body.id_999;
      if (!id) return jsonResponse({ error: "id_999 required" }, 400);
      const [advert, features] = await Promise.all([
        api(`/adverts/${id}?lang=ro`, apiKey),
        api(`/adverts/${id}/features?lang=ro`, apiKey),
      ]);
      const parsed = parseAdvertDetail(advert, features);

      const row = {
        id_999: parsed.id_999,
        marca: parsed.marca,
        model: parsed.model,
        an_fabricatie: parsed.an_fabricatie,
        kilometraj: parsed.kilometraj,
        pret: parsed.pret,
        caroserie: parsed.caroserie,
        tip_motor: parsed.tip_motor,
        cutie_viteze: parsed.cutie_viteze,
        tractiune: parsed.tractiune,
        culoare: parsed.culoare,
        putere: parsed.putere,
        vin: parsed.vin,
        descriere: parsed.descriere,
        descriere_ro: parsed.descriere_ro,
        descriere_ru: parsed.descriere_ru,
        descriere_en: parsed.descriere_en,
        images: parsed.images,
        status: "active",
        created_by: user.id,
      };

      if (action === "import") {
        const { data, error } = await supabase
          .from("car_listings")
          .upsert(row, { onConflict: "id_999" })
          .select()
          .single();
        if (error) throw error;
        return jsonResponse({ success: true, listing: data });
      } else {
        const { id_999: _ignore, created_by: _c, ...updateRow } = row;
        const { data, error } = await supabase
          .from("car_listings")
          .update(updateRow)
          .eq("id_999", id)
          .select()
          .single();
        if (error) throw error;
        return jsonResponse({ success: true, listing: data });
      }
    }

    return jsonResponse({ error: "Unknown action" }, 400);
  } catch (e: any) {
    console.error("sync-999 error:", e);
    return jsonResponse({ error: e.message || String(e) }, 500);
  }
});
