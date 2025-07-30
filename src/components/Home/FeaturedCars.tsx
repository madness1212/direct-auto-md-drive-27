import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  Star,
  Heart,
  Eye,
  Loader2,
  Car as CarIcon
} from "lucide-react";

interface Car {
  id: string;
  marca: string;
  model: string;
  an_fabricatie: number;
  pret: number;
  kilometraj: number;
  tip_motor: string;
  cutie_viteze: string;
  images: string[];
  is_top_offer: boolean;
  top_offer_position: number;
}

const FeaturedCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopOffers();
  }, []);

  const fetchTopOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('car_listings')
        .select('*')
        .eq('is_top_offer', true)
        .eq('status', 'active')
        .order('top_offer_position', { ascending: true })
        .limit(4); // Limitează la primele 4 top oferte

      if (error) {
        console.error('Error fetching top offers:', error);
        return;
      }

      setCars(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funcție pentru generarea slug-ului
  const generateSlug = (brand: string, model: string, year: number, id: string) => {
    const cleanString = (str: string) => 
      str.toLowerCase()
         .replace(/[^\w\s-]/g, '') // Elimină caractere speciale
         .replace(/\s+/g, '-') // Înlocuiește spațiile cu liniuțe
         .replace(/-+/g, '-') // Elimină liniuțele multiple
         .trim();
    
    return `${cleanString(brand)}-${cleanString(model)}-${year}-${id}`;
  };

  return (
    <section className="py-16 bg-auto-gray">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="h-6 w-6 text-auto-green" />
            <h2 className="text-3xl md:text-4xl font-bold text-auto-dark">
              Oferte Speciale
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descoperă cele mai bune oferte din catalogul nostru - 
            automobile verificate și garantate cu prețuri competitive.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-auto-green" />
            <span className="ml-2 text-muted-foreground">Se încarcă ofertele...</span>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12">
            <CarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Nu există top oferte</h3>
            <p className="text-muted-foreground">
              Top ofertele vor fi afișate aici când vor fi configurate în panoul de administrare.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cars.map((car) => (
              <Card key={car.id} className="group hover:shadow-hero transition-all duration-300 bg-background border-0">
                <CardContent className="p-0">
                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={car.images && car.images.length > 0 ? car.images[0] : "/placeholder.svg"} 
                      alt={`${car.marca} ${car.model}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {car.is_top_offer && (
                      <Badge className="absolute top-4 left-4 bg-auto-green hover:bg-auto-green-dark">
                        TOP OFERTĂ
                      </Badge>
                    )}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-background/80 hover:bg-background">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-background/80 hover:bg-background">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                </div>

                  {/* Content */}
                  <div className="p-4 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-auto-dark">
                        {car.marca} {car.model}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${
                                i < 4 // Placeholder rating de 4.5
                                  ? 'text-auto-green fill-current' 
                                  : 'text-muted-foreground'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">(4.5)</span>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-auto-green" />
                        <span className="text-muted-foreground">{car.an_fabricatie}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Gauge className="h-3 w-3 text-auto-green" />
                        <span className="text-muted-foreground">{(car.kilometraj || 0).toLocaleString()} km</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Fuel className="h-3 w-3 text-auto-green" />
                        <span className="text-muted-foreground">{car.tip_motor}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Settings className="h-3 w-3 text-auto-green" />
                        <span className="text-muted-foreground">{car.cutie_viteze}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-auto-green">
                          €{car.pret.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ≈ {(car.pret * 18).toLocaleString()} MDL
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link 
                        to={`/catalog/${generateSlug(car.marca, car.model, car.an_fabricatie, car.id)}`}
                        className="flex-1"
                      >
                        <Button className="w-full bg-gradient-primary hover:bg-auto-green-dark text-sm">
                          Detalii
                        </Button>
                      </Link>
                      <Button asChild variant="outline" className="flex-1 text-sm border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground">
                        <Link to="/contact">Contactează</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link to="/catalog">
            <Button size="lg" variant="outline" className="border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground">
              Vezi Toate Ofertele
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;