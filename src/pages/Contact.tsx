import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageSquare,
  Send,
  Facebook,
  Instagram
} from "lucide-react";

import Layout from "@/components/Layout/Layout";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aici ar fi logica de trimitere a formularului
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefon",
      details: ["+373 79 357 755", "+373 22 123 456"],
      description: "Sună-ne pentru informații rapide"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["contact@directauto.md", "info@directauto.md"],
      description: "Scrie-ne pentru întrebări detaliate"
    },
    {
      icon: MapPin,
      title: "Adresa",
      details: ["str. București 67/1", "Chișinău, Moldova"],
      description: "Vizitează showroom-ul nostru"
    },
    {
      icon: Clock,
      title: "Program de Lucru",
      details: ["Lun-Vin: 09:00-18:00", "Sâmbătă: 09:00-15:00", "Duminică: Închis"],
      description: "Când ne poți găsi disponibili"
    }
  ];

  const departments = [
    {
      title: "Vânzări Auto",
      phone: "+373 79 357 755",
      email: "vanzari@directauto.md",
      description: "Pentru informații despre automobile și prețuri"
    },
    {
      title: "Finanțare",
      phone: "+373 79 357 756",
      email: "finantare@directauto.md", 
      description: "Pentru credite auto și opțiuni de plată"
    },
    {
      title: "Service Auto",
      phone: "+373 79 357 757",
      email: "service@directauto.md",
      description: "Pentru întreținere și reparații"
    },
    {
      title: "Asigurări",
      phone: "+373 79 357 758",
      email: "asigurari@directauto.md",
      description: "Pentru asigurări auto și asistență rutieră"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-auto-dark">
                  <MessageSquare className="h-5 w-5 text-auto-green" />
                  <span>Trimite-ne un Mesaj</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nume complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Numele tău complet"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+373 ..."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@exemplu.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subiect</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Subiectul mesajului"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mesaj *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Scrie mesajul tău aici..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-primary hover:bg-auto-green-dark shadow-card"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Trimite Mesajul
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

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
                  <Button size="sm" variant="outline" className="border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Departments */}
        <Card className="border-0 shadow-card mb-8">
          <CardHeader>
            <CardTitle className="text-auto-dark">Departamente Specializate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold text-auto-dark">{dept.title}</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📞 {dept.phone}</p>
                    <p>✉️ {dept.email}</p>
                    <p className="text-xs">{dept.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-auto-dark">Locația Showroom-ului</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Vizitează showroom-ul nostru modern pentru a vedea întreaga gamă de automobile 
                și pentru a beneficia de consultanță personalizată de la specialiștii noștri.
              </p>
              
              {/* Placeholder pentru hartă Google Maps */}
              <div className="bg-auto-neutral rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-auto-green" />
                  <p className="font-semibold">Hartă Google Maps</p>
                  <p className="text-sm">str. București 67/1, Chișinău, Moldova</p>
                  <Button size="sm" className="mt-2 bg-gradient-primary hover:bg-auto-green-dark">
                    Vezi pe Google Maps
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <h5 className="font-semibold text-auto-dark">Parcare Gratuită</h5>
                  <p className="text-sm text-muted-foreground">50+ locuri de parcare</p>
                </div>
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