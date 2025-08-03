import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, ChevronLeft, ChevronRight, Star, Calendar, Gauge, Fuel, Settings, Car } from "lucide-react";
import { Link } from "react-router-dom";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

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
  caroserie?: string;
  capacitate_motor?: string;
  images: string[];
  is_coming_soon: boolean;
  coming_soon_position: number | null;
}

const ComingSoon = () => {
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
                           <Link to={`/catalog/${generateSlug(car)}`}>
                             <img 
                               src={car.images && car.images.length > 0 ? car.images[0] : "/placeholder.svg"} 
                               alt={`${car.marca} ${car.model}`}
                               className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                             />
                           </Link>
                           <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700">
                             {t('home.comingSoon.badge')}
                           </Badge>
                         </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
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
                           <div className="grid grid-cols-2 gap-2 text-base">
                             <div className="flex items-center space-x-1">
                               <Calendar className="h-4 w-4 text-auto-green" />
                               <span className="text-muted-foreground">{car.an_fabricatie}</span>
                             </div>
                             <div className="flex items-center space-x-1">
                               <Gauge className="h-4 w-4 text-auto-green" />
                               <span className="text-muted-foreground">{(car.kilometraj || 0).toLocaleString()} km</span>
                             </div>
                             <div className="flex items-center space-x-1">
                               <Fuel className="h-4 w-4 text-auto-green" />
                               <span className="text-muted-foreground capitalize">{car.tip_motor}</span>
                             </div>
                             <div className="flex items-center space-x-1">
                               <Settings className="h-4 w-4 text-auto-green" />
                               <span className="text-muted-foreground capitalize">{car.cutie_viteze}</span>
                             </div>
                             {car.capacitate_motor && (
                               <div className="flex items-center space-x-1">
                                 <Fuel className="h-4 w-4 text-auto-green" />
                                 <span className="text-muted-foreground capitalize">{car.capacitate_motor}</span>
                               </div>
                             )}
                             {car.caroserie && (
                               <div className="flex items-center space-x-1">
                                 <Car className="h-4 w-4 text-auto-green" />
                                 <span className="text-muted-foreground capitalize">{car.caroserie}</span>
                               </div>
                             )}
                           </div>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xl font-bold text-auto-green">
                                €{car.pret.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <Link 
                              to={`/catalog/${generateSlug(car)}`}
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
          <Button asChild variant="outline" size="lg" className="border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground">
            <Link to="/catalog">
              {t('home.comingSoon.viewAll')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;