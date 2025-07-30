import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Car, Users, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
const heroBanner = "/lovable-uploads/3e709a6f-213f-4bff-877e-c4510989fbec.png";

const HeroSection = () => {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[60vh] flex items-center">
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
            {t('home.hero.title')}
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {t('home.hero.subtitle')}
          </p>

          <div className="flex justify-center items-center mt-8">
            <Button 
              size="lg" 
              className="bg-primary-foreground text-auto-green hover:bg-auto-neutral shadow-hero text-lg px-8 py-3"
              onClick={() => window.location.href = '/catalog'}
            >
              {t('home.hero.viewCars')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;