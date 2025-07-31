import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Globe,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "/lovable-uploads/4baf3b13-6bff-467c-92f9-2bdd6b9cb9a4.png";

const Header = ({ currentLang, onLanguageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const languages = [
    { code: "ro", name: "Română", flag: "🇷🇴" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇬🇧" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === currentLang) || languages[0];

  return (
    <header className="bg-background shadow-sm">
      {/* Top Bar */}
      <div className="bg-auto-green text-primary-foreground py-1.5 text-sm tracking-wide">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+373 696 88 999</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>directauto.direct@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Chisinau, Grenoble175</span>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-3 md:gap-4">
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
                    onClick={() => onLanguageChange(lang.code)}
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

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-3 md:py-5">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center space-x-3 md:space-x-4 cursor-pointer">
            <img
              src={logo}
              alt="Direct Auto"
              className="h-10 w-10 md:h-16 md:w-16 object-contain rounded-full border-2 border-auto-green shadow-sm"
            />
            <div>
              <h1 className="text-lg md:text-3xl font-semibold text-auto-green tracking-wide">Direct Auto</h1>
            </div>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-auto-green transition-colors">
              {t("header.home")}
            </a>
            <a href="/catalog" className="text-foreground hover:text-auto-green transition-colors">
              {t("header.catalog")}
            </a>
            <a href="/despre" className="text-foreground hover:text-auto-green transition-colors">
              {t("header.about")}
            </a>
            <a href="/contact" className="text-foreground hover:text-auto-green transition-colors">
              {t("header.contact")}
            </a>
            <Button
              className="bg-gradient-to-r from-auto-green to-green-700 hover:from-green-700 hover:to-auto-green text-white px-5 py-2 rounded-full shadow-lg transition-all duration-300"
              onClick={() => (window.location.href = "/catalog")}
            >
              🚗 {t("header.viewStock")}
            </Button>
          </nav>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-foreground hover:bg-auto-green-light p-2">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className="hover:bg-auto-neutral cursor-pointer"
                  >
                    {lang.flag} {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-border animate-slide-in">
            <div className="flex flex-col space-y-3">
              {[
                { href: "/", label: t("header.home") },
                { href: "/catalog", label: t("header.catalog") },
                { href: "/despre", label: t("header.about") },
                { href: "/contact", label: t("header.contact") },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-foreground hover:text-auto-green transition-colors py-2 border-b border-border"
                >
                  {item.label}
                </a>
              ))}
              <Button
                className="bg-gradient-primary hover:bg-auto-green-dark shadow-card mt-4"
                onClick={() => (window.location.href = "/catalog")}
              >
                🚗 {t("header.viewStock")}
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
