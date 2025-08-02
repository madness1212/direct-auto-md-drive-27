import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Users, 
  Car, 
  Shield, 
  Clock,
  MapPin,
  TrendingUp,
  Heart,
  Target,
  Handshake
} from "lucide-react";

import Layout from "@/components/Layout/Layout";

const About = () => {
  const stats = [
    {
      icon: Users,
      number: "2000+",
      label: "Clienți Mulțumiți",
      description: "Încrederea lor este cea mai mare recompensă"
    },
    {
      icon: Award,
      number: "15+",
      label: "Ani de Experiență",
      description: "Peste un deceniu în domeniul auto"
    },
    {
      icon: Shield,
      number: "100%",
      label: "Garantam calitatea automobilelor",
      description: "Toate mașinile verificate la service autorizat"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Pasiune pentru Automobil",
      description: "Fiecare membru al echipei noastre împărtășește aceeași pasiune pentru automobile de calitate și servicii de excelență."
    },
    {
      icon: Shield,
      title: "Încredere și Transparență",
      description: "Construim relații de lungă durată cu clienții noștri prin onestitate, transparență și respect mutual."
    },
    {
      icon: Target,
      title: "Orientare către Client",
      description: "Nevoile și satisfacția clienților noștri sunt întotdeauna prioritatea noastră numărul unu."
    },
    {
      icon: TrendingUp,
      title: "Inovație Continuă",
      description: "Ne adaptăm constant la nevoile pieței și implementăm cele mai noi tehnologii în serviciile noastre."
    }
  ];

  const milestones = [
    {
      year: "2014",
      title: "Înființarea Direct Auto",
      description: "Am deschis primul showroom cu o viziune clară: să oferim automobile de calitate la prețuri corecte."
    },
    {
      year: "2017",
      title: "Expansiunea Serviciilor",
      description: "Am introdus serviciile de finanțare auto și asigurări, oferind soluții complete clienților."
    },
    {
      year: "2020",
      title: "Modernizarea Showroom-ului",
      description: "Am investit într-un showroom modern și tehnologii avansate pentru o experiență îmbunătățită."
    },
    {
      year: "2024",
      title: "Liderul Pieței Auto",
      description: "Am ajuns unul dintre cei mai respectați dealeri auto din Moldova, cu peste 2000 de clienți mulțumiți."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-auto-gray">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-auto-dark">
            Despre Direct Auto
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Cu peste 15 ani de experiență pe piața auto din Moldova, Direct Auto s-a impus 
            ca unul dintre cei mai de încredere dealeri auto din țară. Misiunea noastră este 
            să oferim automobile de cea mai înaltă calitate la prețuri competitive, 
            alături de servicii complete și profesionale.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-card bg-background">
              <CardContent className="p-6 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <stat.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-auto-green">{stat.number}</div>
                  <div className="text-lg font-semibold text-auto-dark">{stat.label}</div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


        {/* Valorile noastre */}
        <div className="mb-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-auto-dark">Valorile Noastre</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Principiile care ne ghidează în fiecare decizie și interacțiune cu clienții noștri.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-card bg-background">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-auto-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <value.icon className="h-6 w-6 text-auto-green" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-auto-dark mb-2">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Locația și contactul */}
        <Card className="border-0 shadow-card">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-auto-dark">
                  Vizitează Parcul Auto
                </h2>
                <p className="text-muted-foreground">
                  Te invităm să descoperi gama noastră completă de automobile la parcul nostru auto
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-auto-green" />
                    <span className="text-muted-foreground">str. Grenoble175, Chișinău, Moldova</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-auto-green" />
                    <span className="text-muted-foreground">Lun-Vin: 09:00-18:00, Sâm: 09:00-15:00, dum: 09:00-18:00</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Handshake className="h-5 w-5 text-auto-green" />
                    <span className="text-muted-foreground">Consultații si test-drive complet gratuit</span>
                  </div>
                </div>
              </div>
              <div className="bg-auto-neutral rounded-lg p-8 text-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-auto-dark">
                    Ai Întrebări?
                  </h3>
                  <p className="text-muted-foreground">
                    Echipa noastră de consultanți este gata să te ajute să găsești 
                    mașina perfectă pentru nevoile tale.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground" asChild>
                      <a href="tel:+373696888999">Sună Acum: +373 696 88 999</a>
                    </Button>
                    <Button variant="outline" className="w-full border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground text-xs sm:text-sm" asChild>
                      <a href="mailto:directauto.direct@gmail.com" className="break-all">
                        <span className="block">Scrie-ne:</span>
                        <span className="block">directauto.direct@gmail.com</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </Layout>
  );
};

export default About;