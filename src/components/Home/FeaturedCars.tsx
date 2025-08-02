import { useState, useEffect, useCallback } from "react";
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
  Loader2,
  Car as CarIcon,
  Car,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import { useLanguage } from "@/contexts/LanguageContext";

interface Car {
  id: string;
  marca: string;
  model: string;
  an_fabricatie: number;
  pret: number;
  kilometraj: number;
  tip_motor: string;
  cutie_viteze: string;
  caroserie?: string;
  capacitate_motor?: string;
  images: string[];
  is_top_offer: boolean;
  top_offer_position: number;
}

const FeaturedCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { t } = useLanguage();

  // Configurez carousel-ul cu autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 3 },
        '(min-width: 1280px)': { slidesToScroll: 4 }
      }
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

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
    <section className="py-8 bg-auto-gray">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="h-6 w-6 text-auto-green" />
            <h2 className="text-3xl md:text-4xl font-bold text-auto-dark">
              {t('home.featuredCars.title')}
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.featuredCars.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-auto-green" />
            <span className="ml-2 text-muted-foreground">{t('common.loading')}</span>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12">
            <CarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('catalog.noResults')}</h3>
            <p className="text-muted-foreground">
              {t('catalog.noResultsText')}
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                {cars.map((car) => (
                  <div key={car.id} className="flex-[0_0_90%] min-w-0 md:flex-[0_0_45%] lg:flex-[0_0_30%] xl:flex-[0_0_22%] pl-4">
                    <Card className="group hover:shadow-hero transition-all duration-300 bg-background border-0 mr-4 shadow-lg">
                      <CardContent className="p-0">
                        {/* Image Container */}
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img 
                            src={car.images && car.images.length > 0 ? car.images[0] : "/placeholder.svg"} 
                            alt={`${car.marca} ${car.model}`}
                            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {car.is_top_offer && (
                            <Badge className="absolute top-4 left-4 bg-auto-green hover:bg-auto-green-dark">
                              {t('car.topOffer')}
                            </Badge>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-3 space-y-3">
                          <div>
                            <h3 className="text-sm font-semibold text-auto-dark truncate">
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
                            {car.capacitate_motor && (
                              <div className="flex items-center space-x-1">
                                <Fuel className="h-3 w-3 text-auto-green" />
                                <span className="text-muted-foreground">{car.capacitate_motor}</span>
                              </div>
                            )}
                            {car.caroserie && (
                              <div className="flex items-center space-x-1">
                                <Car className="h-3 w-3 text-auto-green" />
                                <span className="text-muted-foreground">{car.caroserie}</span>
                              </div>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <div className="relative">
                              {car.is_top_offer ? (
                                <div className="bg-gradient-to-r from-auto-green to-auto-green-dark p-3 rounded-lg text-center transform -rotate-1 shadow-lg border-2 border-white">
                                  <div className="text-2xl font-bold text-white">
                                    €{car.pret.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-white/90 font-medium mt-1">
                                    ★ OFERTĂ SPECIALĂ ★
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xl font-bold text-auto-green">
                                  €{car.pret.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <Link 
                              to={`/catalog/${generateSlug(car.marca, car.model, car.an_fabricatie, car.id)}`}
                              className="flex-1"
                            >
                              <Button className="w-full bg-gradient-primary hover:bg-auto-green-dark text-sm">
                                {t('car.details')}
                              </Button>
                            </Link>
                            <Button asChild variant="outline" className="flex-1 text-sm border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground">
                              <Link to="/contact">{t('car.contact')}</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows - Hidden on Mobile */}
            <Button
              variant="outline"
              size="icon"
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm border-auto-green text-auto-green hover:bg-auto-green hover:text-white z-10"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background/90 backdrop-blur-sm border-auto-green text-auto-green hover:bg-auto-green hover:text-white z-10"
              onClick={scrollNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Dots Indicators */}
        {!loading && cars.length > 0 && (
          <div className="flex justify-center mt-6 space-x-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? 'bg-auto-green scale-110'
                    : 'bg-auto-green/30 hover:bg-auto-green/50'
                }`}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/catalog">
            <Button size="lg" variant="outline" className="border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground">
              {t('home.featuredCars.viewAll')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;