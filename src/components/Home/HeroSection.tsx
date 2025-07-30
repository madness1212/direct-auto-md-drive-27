import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Car, Users, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
const heroBanner = "/lovable-uploads/23a86efd-805a-4ce9-a13d-0472dc2cbb45.png";

const HeroSection = () => {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-2 bg-cover bg-center bg-no-repeat md:bg-contain md:bg-center"
        style={{
          backgroundImage: `url(${heroBanner})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          <h1 className="text-3xl md:text-6xl font-bold leading-tight text-white">
            {t('home.hero.title')}
          </h1>
          
          <p className="text-base md:text-xl text-primary-foreground/90 max-w-2xl mx-auto px-4">
            {t('home.hero.subtitle')}
          </p>

          <div className="flex justify-center items-center mt-6 md:mt-8">
            <Button 
              size="lg" 
              className="bg-primary-foreground text-auto-green hover:bg-auto-neutral shadow-hero text-base md:text-lg px-6 md:px-8 py-2 md:py-3"
              onClick={() => window.location.href = '/catalog'}
            >
              {t('home.hero.viewCars')}
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;