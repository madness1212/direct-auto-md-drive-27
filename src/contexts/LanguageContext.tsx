import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  currentLang: string;
  setCurrentLang: (lang: string) => void;
  t: (key: string) => string;
}

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traducerile pentru diferite limbi
const translations = {
  ro: {
    // Header
    'header.home': 'Acasă',
    'header.catalog': 'Catalog Auto',
    'header.about': 'Despre Noi',
    'header.contact': 'Contact',
    'header.viewStock': 'Vezi Stocul',
    'header.companySlogan': 'Automobile pentru Moldova',
    
    // Home page
    'home.hero.title': 'Automobile cu parcurs importate din Europa',
    'home.hero.subtitle': 'Găsește mașina perfectă din gama noastră selectă de automobile. Calitate garantată și prețuri accesibile.',
    'home.hero.viewCars': 'Vezi Mașinile',
    'home.hero.contactUs': 'Contactează-ne',
    'home.stats.carsInStock': 'Automobile Vândute',
    'home.stats.happyClients': 'Clienți Mulțumiți',
    'home.stats.yearsExperience': 'Ani de Experiență',
    
    // Catalog
    'catalog.title': 'Catalogul Nostru Auto',
    'catalog.subtitle': 'Descoperă gama noastră completă de automobile. Folosește filtrele pentru a găsi mașina perfectă pentru tine.',
    'catalog.filter': 'Filtrează',
    'catalog.search': 'Caută mașina',
    'catalog.brand': 'Marca',
    'catalog.model': 'Modelul',
    'catalog.year': 'Anul',
    'catalog.fuelType': 'Tip Motor',
    'catalog.transmission': 'Cutie de Viteze',
    'catalog.bodyType': 'Caroserie',
    'catalog.price': 'Preț (EUR)',
    'catalog.mileage': 'Kilometraj',
    'catalog.reset': 'Resetează',
    'catalog.apply': 'Aplică Filtrele',
    'catalog.viewDetails': 'Vezi Detalii',
    'catalog.call': 'Sună',
    'catalog.selectBrand': 'Selectează marca',
    'catalog.selectModel': 'Selectează modelul',
    'catalog.selectYear': 'Selectează anul',
    'catalog.selectFuel': 'Selectează tipul motorului',
    'catalog.selectTransmission': 'Selectează cutia de viteze',
    'catalog.selectBodyType': 'Selectează caroseria',
    'catalog.noResults': 'Nu am găsit rezultate',
    'catalog.noResultsText': 'Încearcă să modifici filtrele pentru a găsi mai multe opțiuni.',
    
    // Contact
    'contact.title': 'Contactează-ne',
    'contact.subtitle': 'Suntem aici să te ajutăm să găsești mașina perfectă',
    'contact.name': 'Numele complet',
    'contact.email': 'Email',
    'contact.phone': 'Telefon',
    'contact.message': 'Mesajul',
    'contact.send': 'Trimite Mesajul',
    'contact.sending': 'Se trimite...',
    'contact.success': 'Mesajul a fost trimis cu succes!',
    'contact.error': 'A apărut o eroare. Încercați din nou.',
    
    // About
    'about.title': 'Despre Direct Auto',
    'about.subtitle': 'Povestea noastră în lumea automobilelor',
    
    // Common
    'common.all': 'Toate',
    'common.loading': 'Se încarcă...',
    'common.km': 'km',
    'common.year': 'an',
  },
  
  ru: {
    // Header
    'header.home': 'Главная',
    'header.catalog': 'Каталог Авто',
    'header.about': 'О Нас',
    'header.contact': 'Контакты',
    'header.viewStock': 'Посмотреть Склад',
    'header.companySlogan': 'Автомобили для Молдовы',
    
    // Home page
    'home.hero.title': 'Качественные Автомобили для Молдовы',
    'home.hero.subtitle': 'Найдите идеальный автомобиль из нашего отборного ассортимента новых и подержанных автомобилей. Гарантированное качество и конкурентные цены.',
    'home.hero.viewCars': 'Посмотреть Автомобили',
    'home.hero.contactUs': 'Связаться с нами',
    'home.stats.carsInStock': 'Автомобили Проданы',
    'home.stats.happyClients': 'Довольные Клиенты',
    'home.stats.yearsExperience': 'Лет Опыта',
    
    // Catalog
    'catalog.title': 'Наш Автомобильный Каталог',
    'catalog.subtitle': 'Откройте для себя наш полный ассортимент новых и подержанных автомобилей. Используйте фильтры, чтобы найти идеальную машину для вас.',
    'catalog.filter': 'Фильтр',
    'catalog.search': 'Поиск автомобиля',
    'catalog.brand': 'Марка',
    'catalog.model': 'Модель',
    'catalog.year': 'Год',
    'catalog.fuelType': 'Тип Двигателя',
    'catalog.transmission': 'Коробка Передач',
    'catalog.bodyType': 'Кузов',
    'catalog.price': 'Цена (USD)',
    'catalog.mileage': 'Пробег',
    'catalog.reset': 'Сбросить',
    'catalog.apply': 'Применить Фильтры',
    'catalog.viewDetails': 'Подробнее',
    'catalog.call': 'Звонить',
    'catalog.selectBrand': 'Выберите марку',
    'catalog.selectModel': 'Выберите модель',
    'catalog.selectYear': 'Выберите год',
    'catalog.selectFuel': 'Выберите тип двигателя',
    'catalog.selectTransmission': 'Выберите коробку передач',
    'catalog.selectBodyType': 'Выберите кузов',
    'catalog.noResults': 'Результатов не найдено',
    'catalog.noResultsText': 'Попробуйте изменить фильтры для поиска дополнительных опций.',
    
    // Contact
    'contact.title': 'Свяжитесь с нами',
    'contact.subtitle': 'Мы здесь, чтобы помочь вам найти идеальную машину',
    'contact.name': 'Полное имя',
    'contact.email': 'Email',
    'contact.phone': 'Телефон',
    'contact.message': 'Сообщение',
    'contact.send': 'Отправить Сообщение',
    'contact.sending': 'Отправка...',
    'contact.success': 'Сообщение успешно отправлено!',
    'contact.error': 'Произошла ошибка. Попробуйте снова.',
    
    // About
    'about.title': 'О Direct Auto',
    'about.subtitle': 'Наша история в мире автомобилей',
    
    // Common
    'common.all': 'Все',
    'common.loading': 'Загрузка...',
    'common.km': 'км',
    'common.year': 'год',
  },
  
  en: {
    // Header
    'header.home': 'Home',
    'header.catalog': 'Car Catalog',
    'header.about': 'About Us',
    'header.contact': 'Contact',
    'header.viewStock': 'View Stock',
    'header.companySlogan': 'Automobiles for Moldova',
    
    // Home page
    'home.hero.title': 'Quality Cars for Moldova',
    'home.hero.subtitle': 'Find the perfect car from our select range of new and used automobiles. Guaranteed quality and competitive prices.',
    'home.hero.viewCars': 'View Cars',
    'home.hero.contactUs': 'Contact Us',
    'home.stats.carsInStock': 'Cars Sold',
    'home.stats.happyClients': 'Happy Clients',
    'home.stats.yearsExperience': 'Years Experience',
    
    // Catalog
    'catalog.title': 'Our Car Catalog',
    'catalog.subtitle': 'Discover our complete range of new and used automobiles. Use the filters to find the perfect car for you.',
    'catalog.filter': 'Filter',
    'catalog.search': 'Search car',
    'catalog.brand': 'Brand',
    'catalog.model': 'Model',
    'catalog.year': 'Year',
    'catalog.fuelType': 'Engine Type',
    'catalog.transmission': 'Transmission',
    'catalog.bodyType': 'Body Type',
    'catalog.price': 'Price (USD)',
    'catalog.mileage': 'Mileage',
    'catalog.reset': 'Reset',
    'catalog.apply': 'Apply Filters',
    'catalog.viewDetails': 'View Details',
    'catalog.call': 'Call',
    'catalog.selectBrand': 'Select brand',
    'catalog.selectModel': 'Select model',
    'catalog.selectYear': 'Select year',
    'catalog.selectFuel': 'Select engine type',
    'catalog.selectTransmission': 'Select transmission',
    'catalog.selectBodyType': 'Select body type',
    'catalog.noResults': 'No results found',
    'catalog.noResultsText': 'Try modifying the filters to find more options.',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We are here to help you find the perfect car',
    'contact.name': 'Full Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Message sent successfully!',
    'contact.error': 'An error occurred. Please try again.',
    
    // About
    'about.title': 'About Direct Auto',
    'about.subtitle': 'Our story in the world of automobiles',
    
    // Common
    'common.all': 'All',
    'common.loading': 'Loading...',
    'common.km': 'km',
    'common.year': 'year',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('ro');
  
  console.log('LanguageProvider rendering with currentLang:', currentLang);

  const t = (key: string): string => {
    console.log('Translation request - key:', key, 'currentLang:', currentLang);
    const langTranslations = translations[currentLang as keyof typeof translations] || translations.ro;
    const result = langTranslations[key as keyof typeof langTranslations] || key;
    console.log('Translation result:', result);
    return result;
  };

  const handleSetCurrentLang = (lang: string) => {
    console.log('Context setCurrentLang called with:', lang);
    setCurrentLang(lang);
  };

  const contextValue = { 
    currentLang, 
    setCurrentLang: handleSetCurrentLang, 
    t 
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};