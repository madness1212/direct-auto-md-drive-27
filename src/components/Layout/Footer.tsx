import { Phone, Mail, MapPin, Clock, Facebook } from "lucide-react";
import { FaTelegram, FaTiktok } from "react-icons/fa";
import logo from "/lovable-uploads/21462d59-8c74-456a-a6d1-a437d902f255.png";

const Footer = () => {
  return (
    <footer className="bg-auto-dark text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="Direct Auto" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold">Direct Auto</h3>
                <p className="text-sm text-muted-foreground">Automobile pentru Moldova</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Parc auto de încredere cu experiență de peste 15 ani în vânzarea și importarea  
              automobilelor din Europa în Republica Moldova.
            </p>
            
            {/* Social Media */}
            <div className="space-y-2">
              <h4 className="text-base font-semibold">Urmărește-ne</h4>
              <div className="flex space-x-3">
                <Facebook 
                  className="h-5 w-5 text-muted-foreground hover:text-auto-green cursor-pointer transition-colors" 
                  onClick={() => window.open('https://www.facebook.com/directauto.md/', '_blank')}
                />
                <FaTelegram 
                  className="h-5 w-5 text-muted-foreground hover:text-auto-green cursor-pointer transition-colors" 
                  onClick={() => window.open('https://t.me/directautomd', '_blank')}
                />
                <FaTiktok 
                  className="h-5 w-5 text-muted-foreground hover:text-auto-green cursor-pointer transition-colors" 
                  onClick={() => window.open('https://www.tiktok.com/@directauto?lang=ro-RO', '_blank')}
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold">Navigare</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-auto-green transition-colors">
                  Acasă
                </a>
              </li>
              <li>
                <a href="/catalog" className="text-muted-foreground hover:text-auto-green transition-colors">
                  Catalog Auto
                </a>
              </li>
              <li>
                <a href="/despre" className="text-muted-foreground hover:text-auto-green transition-colors">
                  Despre Noi
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-auto-green transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Phone className="h-4 w-4 text-auto-green mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">+373 696 88 999</span>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-auto-green mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground break-all">directauto.direct@gmail.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-auto-green mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Chisinau, Grenoble175</span>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-auto-green mt-0.5 flex-shrink-0" />
                <div className="text-muted-foreground">
                  <div>Lun-Vin: 09:00-18:00</div>
                  <div>Sâm-Dum: 09:00-15:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-auto-green-dark pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2025 Direct Auto. Toate drepturile rezervate.
            </p>
            <p className="text-xs text-muted-foreground text-center md:text-right">
              Made by <span className="text-auto-green">Vlad Vicol</span> • vladvicol09@gmail.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;