import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  Globe,
  ChevronDown 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "/lovable-uploads/4baf3b13-6bff-467c-92f9-2bdd6b9cb9a4.png";

interface HeaderProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
}

const Header = ({ currentLang, onLanguageChange }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const languages = [
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <header className="bg-background shadow-lg border-b border-border/50">
      {/* Top Bar with Contact Info */}
      <div className="bg-gradient-primary text-primary-foreground py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            {/* Desktop Contact Info - Enhanced Layout */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                <Phone className="h-4 w-4" />
                <span className="font-medium">+373 696 88 999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>directauto.direct@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Chisinau, Grenoble175</span>
              </div>
            </div>

            {/* Medium Screen Contact Info */}
            <div className="hidden md:flex lg:hidden items-center space-x-6">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                <Phone className="h-4 w-4" />
                <span className="font-medium">+373 696 88 999</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Chisinau</span>
              </div>
            </div>

            {/* Mobile Contact Info */}
            <div className="md:hidden flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-2 py-1">
                <Phone className="h-4 w-4" />
                <span className="font-medium">+373 696 88 999</span>
              </div>
            </div>
            
            {/* Language Selector - Enhanced Design */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/20 rounded-full px-4 py-2 transition-all duration-200">
                    <Globe className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">{currentLanguage.flag} {currentLanguage.name}</span>
                    <span className="lg:hidden">{currentLanguage.flag}</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background shadow-xl border border-border/50">
                  {languages.map((lang) => (
                    <DropdownMenuItem 
                      key={lang.code}
                      onClick={() => {
                        console.log('Language change clicked:', lang.code);
                        onLanguageChange(lang.code);
                      }}
                      className="hover:bg-auto-neutral cursor-pointer transition-colors"
                    >
                      {lang.flag} {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Enhanced */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex justify-between items-center">
          {/* Logo - Enhanced */}
          <a href="/" className="flex items-center space-x-3 md:space-x-4 cursor-pointer group">
            <div className="bg-gradient-primary p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <img 
                src={logo} 
                alt="Direct Auto" 
                className="h-10 w-10 md:h-16 md:w-16 object-contain filter brightness-0 invert"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-auto-green">Direct Auto</h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden md:block">Import masini din Europa</p>
            </div>
          </a>

          {/* Desktop Navigation - Enhanced */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-auto-green transition-all duration-200 font-medium relative group">
              {t('header.home')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-auto-green transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a href="/catalog" className="text-foreground hover:text-auto-green transition-all duration-200 font-medium relative group">
              {t('header.catalog')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-auto-green transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a href="/despre" className="text-foreground hover:text-auto-green transition-all duration-200 font-medium relative group">
              {t('header.about')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-auto-green transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a href="/contact" className="text-foreground hover:text-auto-green transition-all duration-200 font-medium relative group">
              {t('header.contact')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-auto-green transition-all duration-200 group-hover:w-full"></span>
            </a>
            
            {/* Call to Action Button - Enhanced */}
            <div className="flex items-center space-x-4">
              <a href="tel:+373696888999" className="flex items-center space-x-2 text-auto-green hover:text-auto-green-dark transition-colors font-semibold">
                <Phone className="h-5 w-5" />
                <span>+373 696 88 999</span>
              </a>
              <Button 
                className="bg-gradient-primary hover:shadow-hero shadow-card px-6 py-2 text-base font-semibold transition-all duration-300 hover:scale-105"
                onClick={() => window.location.href = '/catalog'}
              >
                {t('header.viewStock')}
              </Button>
            </div>
          </nav>

          {/* Medium Screen Navigation */}
          <div className="hidden md:flex lg:hidden items-center space-x-4">
            <Button 
              className="bg-gradient-primary hover:shadow-hero shadow-card transition-all duration-300"
              onClick={() => window.location.href = '/catalog'}
            >
              {t('header.viewStock')}
            </Button>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Selector Mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-foreground hover:bg-auto-green-light p-2 rounded-full">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background shadow-xl">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => {
                      console.log('Mobile language change clicked:', lang.code);
                      onLanguageChange(lang.code);
                    }}
                    className="hover:bg-auto-neutral cursor-pointer"
                  >
                    {lang.flag} {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full hover:bg-auto-green-light"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-6 py-4 border-t border-border/50">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-foreground hover:text-auto-green transition-colors py-3 px-4 rounded-lg hover:bg-auto-green-light/20">
                {t('header.home')}
              </a>
              <a href="/catalog" className="text-foreground hover:text-auto-green transition-colors py-3 px-4 rounded-lg hover:bg-auto-green-light/20">
                {t('header.catalog')}
              </a>
              <a href="/despre" className="text-foreground hover:text-auto-green transition-colors py-3 px-4 rounded-lg hover:bg-auto-green-light/20">
                {t('header.about')}
              </a>
              <a href="/contact" className="text-foreground hover:text-auto-green transition-colors py-3 px-4 rounded-lg hover:bg-auto-green-light/20">
                {t('header.contact')}
              </a>
              <Button 
                className="bg-gradient-primary hover:shadow-hero shadow-card mt-4 w-full"
                onClick={() => window.location.href = '/catalog'}
              >
                {t('header.viewStock')}
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;