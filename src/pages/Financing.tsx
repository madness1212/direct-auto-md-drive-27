import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Calculator, 
  CreditCard, 
  TrendingUp, 
  Shield,
  CheckCircle,
  ArrowRight,
  Percent,
  DollarSign
} from "lucide-react";

import Layout from "@/components/Layout/Layout";

const Financing = () => {
  const [loanAmount, setLoanAmount] = useState([25000]);
  const [downPayment, setDownPayment] = useState([5000]);
  const [loanTerm, setLoanTerm] = useState([60]);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Simulare calcul rata lunară
  const calculateMonthlyPayment = () => {
    const principal = loanAmount[0] - downPayment[0];
    const interestRate = 0.08 / 12; // 8% anual / 12 luni
    const numberOfPayments = loanTerm[0];
    
    const payment = (principal * interestRate * Math.pow(1 + interestRate, numberOfPayments)) / 
                   (Math.pow(1 + interestRate, numberOfPayments) - 1);
    
    setMonthlyPayment(Math.round(payment));
  };

  const features = [
    {
      icon: CreditCard,
      title: "Aprobare Rapidă",
      description: "Obții aprobarea în maximum 24 ore"
    },
    {
      icon: Percent,
      title: "Dobândă Avantajoasă",
      description: "Rate de dobândă de la 6.9% anual"
    },
    {
      icon: Shield,
      title: "Fără Comisioane Ascunse",
      description: "Transparență completă în toate costurile"
    },
    {
      icon: TrendingUp,
      title: "Flexibilitate",
      description: "Termeni de plată de la 12 la 84 luni"
    }
  ];

  const benefits = [
    "Avans de la 0% din valoarea mașinii",
    "Asigurare auto inclusă în pachet",
    "Posibilitatea achitării anticipate fără penalități",
    "Consultanță gratuită de la specialiști",
    "Procesare rapidă a documentelor",
    "Parteneriat cu bănci de top din Moldova"
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-auto-gray">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-auto-dark">
            Calculator de Finanțare Auto
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculează rata lunară pentru mașina visurilor tale. 
            Oferim soluții de finanțare flexibile și avantajoase.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Calculator */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-auto-dark">
                <Calculator className="h-5 w-5 text-auto-green" />
                <span>Calculator Finanțare</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prețul mașinii */}
              <div className="space-y-3">
                <Label>Prețul mașinii: ${loanAmount[0].toLocaleString()}</Label>
                <Slider
                  value={loanAmount}
                  onValueChange={setLoanAmount}
                  max={100000}
                  min={5000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$5,000</span>
                  <span>$100,000</span>
                </div>
              </div>

              {/* Avansul */}
              <div className="space-y-3">
                <Label>Avansul: ${downPayment[0].toLocaleString()}</Label>
                <Slider
                  value={downPayment}
                  onValueChange={setDownPayment}
                  max={loanAmount[0] * 0.5}
                  min={0}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$0</span>
                  <span>${Math.round(loanAmount[0] * 0.5).toLocaleString()}</span>
                </div>
              </div>

              {/* Perioada de creditare */}
              <div className="space-y-3">
                <Label>Perioada: {loanTerm[0]} luni</Label>
                <Slider
                  value={loanTerm}
                  onValueChange={setLoanTerm}
                  max={84}
                  min={12}
                  step={6}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>12 luni</span>
                  <span>84 luni</span>
                </div>
              </div>

              <Button 
                onClick={calculateMonthlyPayment} 
                className="w-full bg-gradient-primary hover:bg-auto-green-dark shadow-card"
                size="lg"
              >
                Calculează Rata
              </Button>

              {/* Rezultat */}
              {monthlyPayment > 0 && (
                <Card className="bg-auto-green text-primary-foreground border-0">
                  <CardContent className="p-4 text-center">
                    <div className="space-y-2">
                      <p className="text-sm opacity-90">Rata lunară estimată:</p>
                      <div className="text-3xl font-bold">${monthlyPayment}</div>
                      <p className="text-sm opacity-90">≈ {(monthlyPayment * 18).toLocaleString()} MDL</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Avantaje */}
          <div className="space-y-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-auto-dark">De Ce Să Alegi Finanțarea Noastră?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-auto-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-auto-green" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-auto-dark text-sm">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-auto-dark">Beneficii Incluse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-auto-green flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Proces de aplicare */}
        <Card className="border-0 shadow-card mb-8">
          <CardHeader>
            <CardTitle className="text-center text-auto-dark">
              Cum Aplici pentru Finanțare?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold">
                  1
                </div>
                <h4 className="font-semibold text-auto-dark">Alege Mașina</h4>
                <p className="text-sm text-muted-foreground">
                  Găsește mașina perfectă din catalogul nostru
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold">
                  2
                </div>
                <h4 className="font-semibold text-auto-dark">Completează Aplicația</h4>
                <p className="text-sm text-muted-foreground">
                  Completează formularul de finanțare online
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold">
                  3
                </div>
                <h4 className="font-semibold text-auto-dark">Obține Aprobarea</h4>
                <p className="text-sm text-muted-foreground">
                  Primește răspunsul în maximum 24 ore
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold">
                  4
                </div>
                <h4 className="font-semibold text-auto-dark">Ridică Mașina</h4>
                <p className="text-sm text-muted-foreground">
                  Semnează contractul și ridică mașina
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="border-0 shadow-card bg-gradient-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Gata să Îți Cumperi Mașina Visurilor?
            </h3>
            <p className="mb-6 opacity-90">
              Aplică acum pentru finanțare și obține aprobarea rapidă!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary-foreground text-auto-green hover:bg-auto-neutral">
                Aplică pentru Finanțare
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-auto-green">
                Contactează Consultantul
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </Layout>
  );
};

export default Financing;