import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [currentLang, setCurrentLang] = useState('ro');

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    // În implementarea reală ar schimba limba în întreaga aplicație
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentLang={currentLang} onLanguageChange={handleLanguageChange} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;