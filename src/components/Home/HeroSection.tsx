import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Car, Users, Award } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBanner})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
            Automobile de Calitate
            <span className="block text-white">pentru Moldova</span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Descoperă gama noastră largă de automobile noi și rulate. 
            Calitate garantată, prețuri competitive și servicii complete.
          </p>

          <div className="flex justify-center items-center mt-8">
            <Button 
              size="lg" 
              className="bg-primary-foreground text-auto-green hover:bg-auto-neutral shadow-hero text-lg px-8 py-3"
              onClick={() => window.location.href = '/catalog'}
            >
              Vezi Catalogul
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-8 border-t border-primary-foreground/20">
            <div className="flex flex-col items-center space-y-2">
              <Car className="h-8 w-8 text-auto-green-light" />
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-primary-foreground/80">Automobile în Stoc</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Users className="h-8 w-8 text-auto-green-light" />
              <div className="text-3xl font-bold">2000+</div>
              <div className="text-sm text-primary-foreground/80">Clienți Mulțumiți</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Award className="h-8 w-8 text-auto-green-light" />
              <div className="text-3xl font-bold">10+</div>
              <div className="text-sm text-primary-foreground/80">Ani de Experiență</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;