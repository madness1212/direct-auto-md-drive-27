import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Facebook
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";

import Layout from "@/components/Layout/Layout";

const Contact = () => {

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefon",
      details: ["+373 696 88 999"],
      description: "Sună-ne pentru informații rapide"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["directauto.direct@gmail.com"],
      description: "Scrie-ne pentru întrebări detaliate"
    },
    {
      icon: MapPin,
      title: "Adresa",
      details: ["str. Grenoble175, Chișinău, Republica Moldova"],
      description: "Vizitează parcul auto"
    },
    {
      icon: Clock,
      title: "Program de Lucru",
      details: ["Lun-Vin: 09:00-18:00", "Sâmbătă: 09:00-15:00", "Duminică: 09:00-15:00"],
      description: "Când ne poți găsi disponibili"
    }
  ];


  return (
    <Layout>
      <div className="min-h-screen bg-auto-gray">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-auto-dark">
            Contactează-ne
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Suntem aici să te ajutăm! Contactează-ne prin oricare dintre metodele de mai jos 
            sau vizitează showroom-ul nostru pentru o experiență personalizată.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-0 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-auto-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-auto-green" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-auto-dark">{info.title}</h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground">{detail}</p>
                      ))}
                      <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Social Media */}
            <Card className="border-0 shadow-card">
              <CardContent className="p-4">
                <h4 className="font-semibold text-auto-dark mb-3">Urmărește-ne</h4>
                 <div className="flex space-x-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground"
                    onClick={() => window.open('https://www.facebook.com/directauto.md/', '_blank')}
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground"
                    onClick={() => window.open('https://www.tiktok.com/@directauto?lang=ro-RO', '_blank')}
                  >
                    <FaTiktok className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


        {/* Map Placeholder */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-auto-dark">Locația Showroom-ului</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Vizitează parcul auto pentru a vedea întreaga gamă de automobile 
                și pentru a beneficia de consultaţie de la specialiștii noștri.
              </p>
              
              {/* Placeholder pentru hartă Google Maps */}
              <div className="bg-auto-neutral rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-auto-green" />
                  <p className="font-semibold">Hartă Google Maps</p>
                  <p className="text-sm">Chisinau, Grenbole175</p>
                  <Button 
                    size="sm" 
                    className="mt-2 bg-gradient-primary hover:bg-auto-green-dark"
                    onClick={() => window.open('https://www.google.com/maps/place/Direct-AutoMD/@46.9814578,28.8379172,17z/data=!3m1!4b1!4m6!3m5!1s0x40c97fd8e912c99d:0xd30c3ad4e70b4542!8m2!3d46.9814578!4d28.8404921!16s%2Fg%2F11f7h618mk?entry=ttu&g_ep=EgoyMDI1MDcyOC4wIKXMDSoASAFQAw%3D%3D', '_blank')}
                  >
                    Vezi pe Google Maps
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <h5 className="font-semibold text-auto-dark">Test Drive</h5>
                  <p className="text-sm text-muted-foreground">Programează un test drive</p>
                </div>
                <div className="space-y-1">
                  <h5 className="font-semibold text-auto-dark">Consultanță</h5>
                  <p className="text-sm text-muted-foreground">Specialiști la dispoziție</p>
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

export default Contact;