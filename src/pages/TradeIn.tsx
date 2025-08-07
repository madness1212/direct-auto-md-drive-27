import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Car, Clock, CreditCard, FileCheck } from "lucide-react";

const TradeIn = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Schimbă-ți mașina veche cu una nouă de la Direct Auto
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              La Direct Auto, îți oferim posibilitatea de a schimba mașina ta actuală cu un model din parcul nostru – 
              rapid, sigur și fără complicații.
            </p>
          </div>

          {/* What is Trade-In */}
          <Card className="mb-12 border-0 shadow-card">
            <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
              <CardTitle className="text-2xl text-center">
                Ce înseamnă Trade-In?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-lg text-center text-muted-foreground leading-relaxed">
                Trade-in este procesul prin care îți aduci mașina veche și, pe baza evaluării, 
                achiți doar diferența pentru un alt vehicul disponibil în stoc.
              </p>
            </CardContent>
          </Card>

          {/* Why Choose Direct Auto */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              De ce să alegi Direct Auto?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-card text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-auto-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-auto-green" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Primești o evaluare corectă și rapidă
                  </h3>
                  <p className="text-muted-foreground">
                    Experții noștri evaluează mașina ta în mod profesionist și transparent
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-auto-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="h-8 w-8 text-auto-green" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Îți schimbi mașina pe loc, fără stres
                  </h3>
                  <p className="text-muted-foreground">
                    Proces rapid și eficient, fără așteptări îndelungate sau complicații
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-auto-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Car className="h-8 w-8 text-auto-green" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Poți pleca cu o altă mașină chiar în aceeași zi
                  </h3>
                  <p className="text-muted-foreground">
                    Dacă găsești modelul dorit în stoc, schimbul se poate finaliza imediat
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How it Works */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Cum funcționează?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <Card className="border-0 shadow-card relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-auto-green text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <CardContent className="p-8 pt-12">
                  <div className="w-16 h-16 bg-auto-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Car className="h-8 w-8 text-auto-green" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
                    Adu mașina la locația noastră pentru evaluare
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Experții noștri vor examina vehiculul și îți vor oferi o evaluare corectă pe loc
                  </p>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="border-0 shadow-card relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-auto-green text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <CardContent className="p-8 pt-12">
                  <div className="w-16 h-16 bg-auto-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-auto-green" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
                    Alege un model din stock
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Explorează parcul nostru auto și găsește vehiculul perfect pentru nevoile tale
                  </p>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="border-0 shadow-card relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-auto-green text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <CardContent className="p-8 pt-12">
                  <div className="w-16 h-16 bg-auto-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileCheck className="h-8 w-8 text-auto-green" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
                    Finalizăm schimbul cu actele necesare
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Completăm toate formalitățile și poți pleca cu noua ta mașină
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits Section */}
          <Card className="mb-12 border-auto-green/20 bg-auto-green/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center text-foreground mb-6">
                Avantajele Trade-In la Direct Auto
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-auto-green mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Evaluare profesională</h4>
                    <p className="text-muted-foreground">Primești o evaluare corectă și transparentă a vehiculului tău</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-auto-green mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Economisești timp</h4>
                    <p className="text-muted-foreground">Nu mai pierzi timp căutând cumpărători pentru mașina veche</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-auto-green mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Fără complicații</h4>
                    <p className="text-muted-foreground">Ne ocupăm de toate formalitățile legale și administrative</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-auto-green mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Garanție de calitate</h4>
                    <p className="text-muted-foreground">Toate vehiculele din parcul nostru sunt verificate și garantate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Gata să îți schimbi mașina?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contactează-ne astăzi pentru o evaluare gratuită și descoperă cât de simplu poate fi să îți schimbi mașina!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-auto-green hover:bg-auto-green-dark text-white"
                onClick={() => window.location.href = '/contact'}
              >
                Contactează-ne acum
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-auto-green text-auto-green hover:bg-auto-green hover:text-white"
                onClick={() => window.location.href = '/catalog'}
              >
                Vezi catalogul nostru
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TradeIn;