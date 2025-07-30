import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import logo from "/lovable-uploads/4baf3b13-6bff-467c-92f9-2bdd6b9cb9a4.png";

const Footer = () => {
  return (
    <footer className="bg-auto-dark text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <img 
                src={logo} 
                alt="Direct Auto" 
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
              />
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Direct Auto</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Automobile pentru Moldova</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Dealership auto de încredere cu experiență de peste 10 ani în vânzarea 
              de automobile noi și rulate în Moldova.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-auto-green cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-auto-green cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Navigare</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-muted-foreground hover:text-auto-green transition-colors">Acasă</a></li>
              <li><a href="/catalog" className="text-muted-foreground hover:text-auto-green transition-colors">Catalog Auto</a></li>
              <li><a href="/finantare" className="text-muted-foreground hover:text-auto-green transition-colors">Finanțare</a></li>
              <li><a href="/despre" className="text-muted-foreground hover:text-auto-green transition-colors">Despre Noi</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-auto-green transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Servicii</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-muted-foreground">Vânzare automobile noi</span></li>
              <li><span className="text-muted-foreground">Vânzare automobile rulate</span></li>
              <li><span className="text-muted-foreground">Finanțare auto</span></li>
              <li><span className="text-muted-foreground">Asigurare auto</span></li>
              <li><span className="text-muted-foreground">Service auto</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-auto-green" />
                <span className="text-muted-foreground">+373 696 88 999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-auto-green" />
                <span className="text-muted-foreground">directauto.direct@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-auto-green" />
                <span className="text-muted-foreground">Chisinau, Grenbole175</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-auto-green" />
                <span className="text-muted-foreground">Lun-Vin: 09:00-18:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-auto-green-dark mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Direct Auto. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;