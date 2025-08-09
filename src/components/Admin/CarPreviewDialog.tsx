import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fuel, Settings, Car as CarIcon } from "lucide-react";

interface CarListing {
  id: string;
  marca: string;
  model: string;
  an_fabricatie: number;
  pret: number;
  images: string[] | null;
  tip_motor?: string | null;
  capacitate_motor?: string | null;
  putere?: string | number | null;
  cutie_viteze?: string | null;
  tractiune?: string | null;
  caroserie?: string | null;
}

const formatEngineCapacity = (value?: string | null) => {
  if (!value) return "";
  const original = value.toString();
  try {
    const lower = original.toLowerCase();
    const match = original.match(/[\d.,]+/);
    if (!match) return original;
    const numericStr = match[0].replace(/\s/g, "");
    const isLiters = lower.includes("l");
    let cc = 0;
    if (isLiters) {
      const liters = parseFloat(numericStr.replace(/,/g, "."));
      if (isNaN(liters)) return original;
      cc = Math.round(liters * 1000);
    } else {
      const parsed = parseInt(numericStr.replace(/[.,]/g, ""), 10);
      if (isNaN(parsed)) return original;
      cc = parsed;
    }
    return `${cc.toLocaleString()} cm³`;
  } catch {
    return original;
  }
};

const formatPower = (value?: string | number | null) => {
  if (value === null || value === undefined) return "";
  const str = value.toString();
  const match = str.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    if (!isNaN(num)) return `${num} CP`;
  }
  return str.toUpperCase().includes("CP") ? str : `${str} CP`;
};

export function CarPreviewDialog({ carId }: { carId: string }) {
  const [car, setCar] = useState<CarListing | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCar = async () => {
      const { data } = await supabase
        .from("car_listings")
        .select("*")
        .eq("id", carId)
        .single();
      setCar((data as unknown as CarListing) || null);
      setLoading(false);
    };
    fetchCar();
  }, [carId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-auto-green"></div>
      </div>
    );
  }

  if (!car) {
    return <div className="p-6 text-muted-foreground">Anunțul nu a fost găsit.</div>;
  }

  const slug = `${car.marca?.toLowerCase()?.replace(/[^a-z0-9]/g, "-")}-${car.model?.toLowerCase()?.replace(/[^a-z0-9]/g, "-")}-${car.an_fabricatie}-${car.id}`;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-40 h-28 rounded-md overflow-hidden border">
          {car.images?.[0] ? (
            <img
              src={car.images[0]}
              alt={`${car.marca} ${car.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <CarIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-semibold text-foreground">
                {car.marca} {car.model}
              </div>
              <div className="text-muted-foreground">{car.an_fabricatie}</div>
            </div>
            <div className="text-auto-green text-2xl font-bold">€{(car.pret || 0).toLocaleString()}</div>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <Fuel className="h-4 w-4 text-auto-green" /> Combustibil
              </span>
              <span className="text-muted-foreground">{car.tip_motor}</span>
            </div>
            {car.capacitate_motor && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  <Settings className="h-4 w-4 text-auto-green" /> Capacitate
                </span>
                <span className="text-muted-foreground">{formatEngineCapacity(car.capacitate_motor)}</span>
              </div>
            )}
            {car.putere && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  <Settings className="h-4 w-4 text-auto-green" /> Putere
                </span>
                <span className="text-muted-foreground">{formatPower(car.putere)}</span>
              </div>
            )}
            {car.cutie_viteze && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  <Settings className="h-4 w-4 text-auto-green" /> Cutie
                </span>
                <span className="text-muted-foreground">{car.cutie_viteze}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          onClick={() => navigate(`/car/${slug}`)}
          className="border-auto-green text-auto-green hover:bg-auto-green hover:text-white"
        >
          Deschide pagina anunț
        </Button>
      </div>
    </div>
  );
}
