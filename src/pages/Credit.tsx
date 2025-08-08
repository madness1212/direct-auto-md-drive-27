import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Euro, Users, FileText, Building2 } from "lucide-react";

const Credit = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 leading-relaxed">
              Condiții favorabile de finanțare pentru viitoarea ta mașină
            </h1>
            <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                Planifici să îți achiziționezi un automobil?
              </p>
              <p className="text-lg">
                Oferim consultare dedicată și asistență profesională pentru obținerea celui mai potrivit credit sau leasing.
              </p>
              <p className="text-lg font-medium text-foreground mt-6">
                Alege metoda de finanțare ideală pentru tine împreună cu rata lunară convenabilă și termeni flexibili.
              </p>
            </div>
          </div>

          {/* Important Notice */}
          <Card className="mb-8 border-auto-green/20 bg-auto-green/5">
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                *Orice mașină din gama noastră poate fi achiziționată prin credit bancar sau microfinanțare, 
                conform criteriilor generale de eligibilitate (pot varia în funcție de client și vehicul).
              </p>
            </CardContent>
          </Card>

          {/* Eligibility Conditions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Condiții generale de eligibilitate
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Personal Credit */}
              <Card className="border-0 shadow-card">
                <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
                  <CardTitle className="flex items-center text-xl">
                    <Users className="h-6 w-6 mr-3" />
                    Pentru persoane fizice – credit „Automobil personal"
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-auto-green mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Finanțare până la 75 000 EUR</h4>
                        <p className="text-muted-foreground">și 100% din valoarea automobilului</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-auto-green mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Nu se solicită asigurare CASCO</h4>
                        <p className="text-muted-foreground">Proces simplificat fără complicații suplimentare</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-auto-green mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Confirmarea veniturilor</h4>
                        <p className="text-muted-foreground">Este necesară confirmarea veniturilor pe ultimele 6 luni</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Credit */}
              <Card className="border-0 shadow-card">
                <CardHeader className="bg-auto-green text-white rounded-t-lg">
                  <CardTitle className="flex items-center text-xl">
                    <Building2 className="h-6 w-6 mr-3" />
                    Pentru persoane juridice – „Automobil pentru companii"
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-auto-green mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Finanțare până la 75 000 EUR</h4>
                        <p className="text-muted-foreground">cu posibilitate de înmatriculare pe numele companiei</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-auto-green mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Opțiuni de plată flexibile</h4>
                        <p className="text-muted-foreground">numerar sau transfer bancar</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-auto-green mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Fără restricții</h4>
                        <p className="text-muted-foreground">Nu se solicită CASCO și nu există limită de vârstă a vehiculului</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-auto-green mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Finanțare completă</h4>
                        <p className="text-muted-foreground">100% din valoarea automobilului</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="border-0 shadow-card text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-auto-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Euro className="h-8 w-8 text-auto-green" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Rate flexibile</h3>
                <p className="text-muted-foreground">Alegem împreună rata lunară potrivită pentru bugetul tău</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-auto-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-auto-green" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Consultare dedicată</h3>
                <p className="text-muted-foreground">Asistență profesională pentru cea mai bună soluție de finanțare</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-auto-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-auto-green" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Proces simplificat</h3>
                <p className="text-muted-foreground">Proceduri rapide și transparente pentru aprobarea creditului</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Credit;