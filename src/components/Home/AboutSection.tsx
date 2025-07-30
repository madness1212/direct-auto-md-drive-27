import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Award, 
  Users, 
  Clock,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Award,
      title: "Experiență de 10+ Ani",
      description: "Suntem lideri pe piața auto din Moldova cu peste 10 ani de experiență."
    },
    {
      icon: Users,
      title: "2000+ Clienți Mulțumiți",
      description: "Peste 2000 de clienți au ales să-și cumpere automobil de la noi."
    },
    {
      icon: Clock,
      title: "Service Rapid",
      description: "Oferim servicii complete de întreținere și reparații auto."
    }
  ];

  const benefits = [
    "Verificare tehnică completă pentru fiecare automobil",
    "Garanție extinsă și service post-vânzare",
    "Prețuri competitive și transparente",
    "Opțiuni de finanțare flexibile",
    "Echipă de profesioniști cu experiență",
    "Showroom modern cu peste 500 de automobile"
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-auto-dark mb-4">
                De Ce Să Alegi 
                <span className="text-auto-green"> Direct Auto?</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Cu peste 10 ani de experiență pe piața auto din Moldova, 
                Direct Auto s-a impus ca unul dintre cei mai de încredere 
                dealeri auto din țară.
              </p>
            </div>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-auto-green flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-primary hover:bg-auto-green-dark shadow-card">
                Află Mai Multe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground">
                Contactează-ne
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-card transition-all duration-300 border-0 bg-auto-gray">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-auto-dark">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;