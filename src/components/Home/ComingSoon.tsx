import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, Loader2, Clock } from "lucide-react";
import { Link } from "react-router-dom";

import { useLanguage } from "@/contexts/LanguageContext";

interface Car {
  id: string;
  marca: string;
  model: string;
  an_fabricatie: number;
  pret: number;
  kilometraj: number | null;
  tip_motor: string;
  cutie_viteze: string;
  images: string[];
  is_coming_soon: boolean;
  coming_soon_position: number | null;
}

const ComingSoon = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { t } = useLanguage();

  useEffect(() => {
    fetchComingSoonCars();
  }, []);

  const fetchComingSoonCars = async () => {
    try {
      const { data, error } = await supabase
        .from('car_listings')
        .select('*')
        .eq('status', 'active')
        .eq('is_coming_soon', true)
        .order('coming_soon_position', { ascending: true })
        .limit(4);

      if (error) {
        console.error('Error fetching coming soon cars:', error);
        return;
      }

      setCars(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cleanString = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const generateSlug = (car: Car) => {
    const brandSlug = cleanString(car.marca);
    const modelSlug = cleanString(car.model);
    return `${brandSlug}-${modelSlug}-${car.an_fabricatie}-${car.id}`;
  };

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="h-6 w-6 text-auto-green" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('home.comingSoon.title')}
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('home.comingSoon.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">{t('common.loading')}</span>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {t('home.comingSoon.noResults')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {cars.map((car) => (
                <Card key={car.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={car.images?.[0] || "/placeholder.svg"}
                        alt={`${car.marca} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <Badge className="absolute top-2 left-2 bg-blue-600 hover:bg-blue-700">
                      {t('home.comingSoon.badge')}
                    </Badge>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-foreground">
                        {car.marca} {car.model}
                      </h3>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Anul:</span>
                        <span className="font-medium">{car.an_fabricatie}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Kilometraj:</span>
                        <span className="font-medium">{car.kilometraj?.toLocaleString() || 'N/A'} km</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Motor:</span>
                        <span className="font-medium">{car.tip_motor}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cutie:</span>
                        <span className="font-medium">{car.cutie_viteze}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-3xl font-bold text-primary">
                          €{car.pret.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link to={`/catalog/${generateSlug(car)}`}>
                          {t('car.details')}
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1">
                        <Link to="/contact">{t('car.contact')}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/catalog">
                  {t('home.comingSoon.viewAll')}
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ComingSoon;