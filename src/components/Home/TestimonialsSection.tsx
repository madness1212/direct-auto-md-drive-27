import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import { useIsMobile } from "@/hooks/use-mobile";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  car: string;
  avatar: string;
}

const TestimonialsSection = () => {
  const isMobile = useIsMobile();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: true,
    dragFree: true
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Ion Popov",
      location: "Chișinău",
      rating: 5,
      comment: "Experiență excelentă! Am găsit exact mașina pe care o căutam. Personalul foarte profesionist și prețurile corecte. Recomand cu încredere!",
      car: "Toyota Camry 2021",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Maria Andronache",
      location: "Bălți",
      rating: 5,
      comment: "Am cumpărat un BMW X3 și sunt foarte mulțumită. Mașina în stare perfectă, documentele în regulă. Mulțumesc echipei Direct Auto!",
      car: "BMW X3 2020",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Andrei Moraru",
      location: "Căușeni",
      rating: 5,
      comment: "Cel mai bun dealer auto din Moldova! M-au ajutat să obțin finanțare rapidă și avantajoasă. Servicii complete și profesionalism la cel mai înalt nivel.",
      car: "Mercedes-Benz C-Class 2019",
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Elena Rusu",
      location: "Orhei",
      rating: 5,
      comment: "Recomand cu drag! Am fost tratată cu respect și profesionalism. Mașina livrată la timp și în condiții perfecte. Mulțumesc!",
      car: "Audi A4 2020",
      avatar: "/placeholder.svg"
    }
  ];

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onInit = useCallback((embla: any) => {
    setScrollSnaps(embla.scrollSnapList());
  }, []);

  const onSelect = useCallback((embla: any) => {
    setSelectedIndex(embla.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <section className="py-16 bg-auto-gray">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-auto-dark">
            Ce Spun Clienții Noștri
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Încrederea clienților noștri este cea mai mare recompensă. 
            Citește experiențele celor care au ales Direct Auto.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="group hover:shadow-card transition-all duration-300 border-0 bg-background">
              <CardContent className="p-6 space-y-4">
                {/* Quote Icon */}
                <div className="flex justify-center">
                  <div className="w-10 h-10 bg-auto-green/10 rounded-full flex items-center justify-center">
                    <Quote className="h-5 w-5 text-auto-green" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < testimonial.rating 
                          ? 'text-auto-green fill-current' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm text-muted-foreground text-center italic leading-relaxed">
                  "{testimonial.comment}"
                </p>

                {/* Client Info */}
                <div className="text-center space-y-2 pt-4 border-t border-border">
                  <div className="flex items-center justify-center space-x-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-auto-dark text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-auto-green font-medium">
                    {testimonial.car}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex-[0_0_100%] min-w-0 px-2">
                  <Card className="group hover:shadow-card transition-all duration-300 border-0 bg-background">
                    <CardContent className="p-6 space-y-4">
                      {/* Quote Icon */}
                      <div className="flex justify-center">
                        <div className="w-10 h-10 bg-auto-green/10 rounded-full flex items-center justify-center">
                          <Quote className="h-5 w-5 text-auto-green" />
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex justify-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < testimonial.rating 
                                ? 'text-auto-green fill-current' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        ))}
                      </div>

                      {/* Comment */}
                      <p className="text-sm text-muted-foreground text-center italic leading-relaxed">
                        "{testimonial.comment}"
                      </p>

                      {/* Client Info */}
                      <div className="text-center space-y-2 pt-4 border-t border-border">
                        <div className="flex items-center justify-center space-x-3">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-auto-dark text-sm">
                              {testimonial.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {testimonial.location}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-auto-green font-medium">
                          {testimonial.car}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-auto-dark hover:bg-background transition-colors"
            onClick={scrollPrev}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-auto-dark hover:bg-background transition-colors"
            onClick={scrollNext}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dot Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedIndex ? 'bg-auto-green' : 'bg-muted-foreground/30'
                }`}
                onClick={() => scrollTo(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-4">
            Și tu poți face parte din familia Direct Auto!
          </p>
          <div className="flex items-center justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-auto-green fill-current" />
            ))}
            <span className="text-auto-green font-semibold ml-2">4.9/5</span>
            <span className="text-muted-foreground">din 200+ recenzii</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;