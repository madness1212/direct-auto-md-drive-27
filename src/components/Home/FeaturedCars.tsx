import { Link } from "react-router-dom";
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
  Eye
} from "lucide-react";

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  fuel: string;
  transmission: string;
  image: string;
  isTopOffer: boolean;
  rating: number;
}

const FeaturedCars = () => {
  // Mock data - în implementarea reală ar veni din API
  const cars: Car[] = [
    {
      id: 1,
      brand: "Toyota",
      model: "Camry",
      year: 2022,
      price: 28500,
      currency: "USD",
      mileage: 15000,
      fuel: "Benzină",
      transmission: "Automată",
      image: "/placeholder.svg",
      isTopOffer: true,
      rating: 4.8
    },
    {
      id: 2,
      brand: "BMW",
      model: "X3",
      year: 2021,
      price: 45000,
      currency: "USD",
      mileage: 25000,
      fuel: "Diesel",
      transmission: "Automată",
      image: "/placeholder.svg",
      isTopOffer: true,
      rating: 4.9
    },
    {
      id: 3,
      brand: "Mercedes-Benz",
      model: "C-Class",
      year: 2020,
      price: 35000,
      currency: "USD",
      mileage: 30000,
      fuel: "Benzină",
      transmission: "Automată",
      image: "/placeholder.svg",
      isTopOffer: false,
      rating: 4.7
    },
    {
      id: 4,
      brand: "Audi",
      model: "A4",
      year: 2021,
      price: 38000,
      currency: "USD",
      mileage: 20000,
      fuel: "Diesel",
      transmission: "Automată",
      image: "/placeholder.svg",
      isTopOffer: true,
      rating: 4.8
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cars.map((car) => (
            <Card key={car.id} className="group hover:shadow-hero transition-all duration-300 bg-background border-0">
              <CardContent className="p-0">
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={car.image} 
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {car.isTopOffer && (
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
                      {car.brand} {car.model}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${
                              i < Math.floor(car.rating) 
                                ? 'text-auto-green fill-current' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({car.rating})</span>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-auto-green" />
                      <span className="text-muted-foreground">{car.year}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Gauge className="h-3 w-3 text-auto-green" />
                      <span className="text-muted-foreground">{car.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Fuel className="h-3 w-3 text-auto-green" />
                      <span className="text-muted-foreground">{car.fuel}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Settings className="h-3 w-3 text-auto-green" />
                      <span className="text-muted-foreground">{car.transmission}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-auto-green">
                        ${car.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ≈ {(car.price * 18).toLocaleString()} MDL
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-gradient-primary hover:bg-auto-green-dark text-sm">
                      Detalii
                    </Button>
                    <Button variant="outline" className="flex-1 text-sm border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground">
                      Contactează
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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