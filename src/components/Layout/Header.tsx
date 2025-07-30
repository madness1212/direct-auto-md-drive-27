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
import logo from "@/assets/logo.png";

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
    <header className="bg-background shadow-sm">
      {/* Top Bar */}
      <div className="bg-auto-green text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            {/* Desktop Contact Info */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+373 696 88 999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@directauto.md</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Chisinau, Grenoble175</span>
              </div>
            </div>

            {/* Mobile Contact Info */}
            <div className="md:hidden flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+373 696 88 999</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Chisinau, Grenoble175</span>
              </div>
            </div>
            
            {/* Language Selector - Desktop only */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-auto-green-light">
                    <Globe className="h-4 w-4 mr-2" />
                    {currentLanguage.flag} {currentLanguage.name}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background">
                  {languages.map((lang) => (
                    <DropdownMenuItem 
                      key={lang.code}
                      onClick={() => {
                        console.log('Language change clicked:', lang.code);
                        onLanguageChange(lang.code);
                      }}
                      className="hover:bg-auto-neutral cursor-pointer"
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

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 cursor-pointer">
            <img src={logo} alt="Direct Auto" className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-bold text-auto-green">Direct Auto</h1>
              <p className="text-sm text-muted-foreground hidden md:block">{t('header.companySlogan')}</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-auto-green transition-colors">
              {t('header.home')}
            </a>
            <a href="/catalog" className="text-foreground hover:text-auto-green transition-colors">
              {t('header.catalog')}
            </a>
            <a href="/despre" className="text-foreground hover:text-auto-green transition-colors">
              {t('header.about')}
            </a>
            <a href="/contact" className="text-foreground hover:text-auto-green transition-colors">
              {t('header.contact')}
            </a>
            <Button 
              className="bg-gradient-primary hover:bg-auto-green-dark shadow-card"
              onClick={() => window.location.href = '/catalog'}
            >
              {t('header.viewStock')}
            </Button>
          </nav>

          {/* Mobile Language & Menu */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Selector Mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-foreground hover:bg-auto-green-light">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background">
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
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-foreground hover:text-auto-green transition-colors py-2">
                {t('header.home')}
              </a>
              <a href="/catalog" className="text-foreground hover:text-auto-green transition-colors py-2">
                {t('header.catalog')}
              </a>
              <a href="/despre" className="text-foreground hover:text-auto-green transition-colors py-2">
                {t('header.about')}
              </a>
              <a href="/contact" className="text-foreground hover:text-auto-green transition-colors py-2">
                {t('header.contact')}
              </a>
              <Button 
                className="bg-gradient-primary hover:bg-auto-green-dark shadow-card mt-4"
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