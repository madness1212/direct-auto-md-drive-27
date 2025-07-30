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
    'home.featuredCars.title': 'Oferte Speciale',
    'home.featuredCars.subtitle': 'Descoperă cele mai bune oferte din catalogul nostru',
    'home.featuredCars.viewAll': 'Vezi Toate Ofertele',
    'home.comingSoon.title': 'În Curând',
    'home.comingSoon.subtitle': 'Descoperă mașinile care vor fi disponibile în curând în Parcul nostru',
    'home.comingSoon.viewAll': 'Vezi Toate Mașinile',
    'home.comingSoon.badge': 'ÎN CURÂND',
    'home.comingSoon.noResults': 'Nu sunt mașini programate să sosească în curând.',
    'home.about.title': 'Despre Direct Auto',
    'home.about.subtitle': 'Cu ani de experiență în industria auto, ne mândrim cu serviciul nostru de calitate și selecția noastră diversă de automobile.',
    'home.about.description': 'Direct Auto este partenerul tău de încredere pentru achiziționarea de automobile în Moldova. Oferim o gamă largă de mașini noi și second-hand, toate verificate și garantate pentru a-ți oferi cea mai bună experiență de cumpărare.',
    'home.about.learnMore': 'Află Mai Multe',
    'home.testimonials.title': 'Ce spun clienții noștri',
    'home.testimonials.subtitle': 'Citește părerile clienților noștri mulțumiți despre experiența lor cu Direct Auto.',
    
    // Car details
    'car.details': 'Detalii',
    'car.contact': 'Contactează',
    'car.backToCatalog': 'Înapoi la Catalog',
    'car.specifications': 'Specificații',
    'car.year': 'Anul',
    'car.mileage': 'Kilometraj',
    'car.engine': 'Motor',
    'car.transmission': 'Cutie',
    'car.fuelType': 'Tip Combustibil',
    'car.bodyType': 'Caroserie',
    'car.drivetrain': 'Tracțiune',
    'car.description': 'Descriere',
    'car.images': 'Imagini',
    'car.video': 'Video',
    'car.topOffer': 'TOP OFERTĂ',
    'car.price': 'Preț',
    'car.loading': 'Se încarcă...',
    'car.notFound': 'Mașina nu a fost găsită',
    'car.error': 'A apărut o eroare la încărcarea datelor.',
    
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
    'contact.info.title': 'Informații de Contact',
    'contact.info.address': 'Adresa',
    'contact.info.workingHours': 'Program de Lucru',
    'contact.info.hours': 'Luni - Vineri: 09:00 - 18:00\nSâmbătă: 10:00 - 16:00\nDuminică: Închis',
    
    // About
    'about.title': 'Despre Direct Auto',
    'about.subtitle': 'Povestea noastră în lumea automobilelor',
    'about.mission.title': 'Misiunea Noastră',
    'about.mission.description': 'Să oferim clienților noștri cele mai bune automobile la prețuri accesibile, cu servicii de calitate superioară.',
    'about.vision.title': 'Viziunea Noastră',
    'about.vision.description': 'Să devenim liderul pieței auto din Moldova prin transparență, calitate și servicii de încredere.',
    'about.values.title': 'Valorile Noastre',
    'about.values.quality': 'Calitate',
    'about.values.trust': 'Încredere',
    'about.values.service': 'Serviciu',
    'about.values.innovation': 'Inovație',
    
    // Footer
    'footer.company': 'Compania',
    'footer.services': 'Servicii',
    'footer.contact': 'Contact',
    'footer.followUs': 'Urmărește-ne',
    'footer.rights': 'Toate drepturile rezervate.',
    'footer.privacy': 'Politica de Confidențialitate',
    'footer.terms': 'Termeni și Condiții',
    
    // Admin
    'admin.title': 'Panou de Administrare',
    'admin.addCar': 'Adaugă Mașină',
    'admin.manageCars': 'Gestionează Mașinile',
    'admin.topOffers': 'Top Oferte',
    'admin.comingSoon': 'În Curând',
    
    // Common
    'common.all': 'Toate',
    'common.loading': 'Se încarcă...',
    'common.km': 'km',
    'common.year': 'an',
    'common.save': 'Salvează',
    'common.cancel': 'Anulează',
    'common.edit': 'Editează',
    'common.delete': 'Șterge',
    'common.confirm': 'Confirmă',
    'common.yes': 'Da',
    'common.no': 'Nu',
    'common.close': 'Închide',
    'common.back': 'Înapoi',
    'common.next': 'Următorul',
    'common.previous': 'Anteriorul',
    'common.viewMore': 'Vezi Mai Mult',
    'common.readMore': 'Citește Mai Mult',
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
    'home.hero.title': 'Подержанные автомобили из Европы',
    'home.hero.subtitle': 'Найдите идеальный автомобиль из нашего отборного ассортимента автомобилей. Гарантированное качество и доступные цены.',
    'home.hero.viewCars': 'Посмотреть Автомобили',
    'home.hero.contactUs': 'Связаться с нами',
    'home.featuredCars.title': 'Специальные Предложения',
    'home.featuredCars.subtitle': 'Откройте для себя лучшие предложения из нашего каталога - проверенные и гарантированные автомобили по конкурентным ценам.',
    'home.featuredCars.viewAll': 'Посмотреть Все Предложения',
    'home.comingSoon.title': 'Скоро в Продаже',
    'home.comingSoon.subtitle': 'Откройте для себя автомобили, которые скоро будут доступны в нашем автосалоне',
    'home.comingSoon.viewAll': 'Посмотреть Все Автомобили',
    'home.comingSoon.badge': 'СКОРО',
    'home.comingSoon.noResults': 'Нет автомобилей, запланированных к поступлению.',
    'home.about.title': 'О Direct Auto',
    'home.about.subtitle': 'С годами опыта в автомобильной индустрии, мы гордимся нашим качественным сервисом и разнообразным выбором автомобилей.',
    'home.about.description': 'Direct Auto - ваш надежный партнер для покупки автомобилей в Молдове. Мы предлагаем широкий ассортимент новых и подержанных автомобилей, все проверенные и гарантированные, чтобы предоставить вам лучший опыт покупки.',
    'home.about.learnMore': 'Узнать Больше',
    'home.testimonials.title': 'Что говорят наши клиенты',
    'home.testimonials.subtitle': 'Прочитайте отзывы наших довольных клиентов об их опыте с Direct Auto.',
    
    // Car details
    'car.details': 'Подробности',
    'car.contact': 'Связаться',
    'car.backToCatalog': 'Назад к Каталогу',
    'car.specifications': 'Характеристики',
    'car.year': 'Год',
    'car.mileage': 'Пробег',
    'car.engine': 'Двигатель',
    'car.transmission': 'Коробка',
    'car.fuelType': 'Тип Топлива',
    'car.bodyType': 'Кузов',
    'car.drivetrain': 'Привод',
    'car.description': 'Описание',
    'car.images': 'Изображения',
    'car.video': 'Видео',
    'car.topOffer': 'ТОП ПРЕДЛОЖЕНИЕ',
    'car.price': 'Цена',
    'car.loading': 'Загрузка...',
    'car.notFound': 'Автомобиль не найден',
    'car.error': 'Произошла ошибка при загрузке данных.',
    
    // Catalog
    'catalog.title': 'Наш Автомобильный Каталог',
    'catalog.subtitle': 'Откройте для себя наш полный ассортимент автомобилей. Используйте фильтры, чтобы найти идеальную машину для вас.',
    'catalog.filter': 'Фильтр',
    'catalog.search': 'Поиск автомобиля',
    'catalog.brand': 'Марка',
    'catalog.model': 'Модель',
    'catalog.year': 'Год',
    'catalog.fuelType': 'Тип Двигателя',
    'catalog.transmission': 'Коробка Передач',
    'catalog.bodyType': 'Кузов',
    'catalog.price': 'Цена (EUR)',
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
    'contact.info.title': 'Контактная Информация',
    'contact.info.address': 'Адрес',
    'contact.info.workingHours': 'Часы Работы',
    'contact.info.hours': 'Понедельник - Пятница: 09:00 - 18:00\nСуббота: 10:00 - 16:00\nВоскресенье: Закрыто',
    
    // About
    'about.title': 'О Direct Auto',
    'about.subtitle': 'Наша история в мире автомобилей',
    'about.mission.title': 'Наша Миссия',
    'about.mission.description': 'Предоставлять нашим клиентам лучшие автомобили по доступным ценам с превосходным качеством обслуживания.',
    'about.vision.title': 'Наше Видение',
    'about.vision.description': 'Стать лидером автомобильного рынка в Молдове через прозрачность, качество и надежные услуги.',
    'about.values.title': 'Наши Ценности',
    'about.values.quality': 'Качество',
    'about.values.trust': 'Доверие',
    'about.values.service': 'Сервис',
    'about.values.innovation': 'Инновации',
    
    // Footer
    'footer.company': 'Компания',
    'footer.services': 'Услуги',
    'footer.contact': 'Контакты',
    'footer.followUs': 'Следите за нами',
    'footer.rights': 'Все права защищены.',
    'footer.privacy': 'Политика Конфиденциальности',
    'footer.terms': 'Условия и Положения',
    
    // Admin
    'admin.title': 'Панель Администратора',
    'admin.addCar': 'Добавить Автомобиль',
    'admin.manageCars': 'Управление Автомобилями',
    'admin.topOffers': 'Топ Предложения',
    'admin.comingSoon': 'Скоро в Продаже',
    
    // Common
    'common.all': 'Все',
    'common.loading': 'Загрузка...',
    'common.km': 'км',
    'common.year': 'год',
    'common.save': 'Сохранить',
    'common.cancel': 'Отменить',
    'common.edit': 'Редактировать',
    'common.delete': 'Удалить',
    'common.confirm': 'Подтвердить',
    'common.yes': 'Да',
    'common.no': 'Нет',
    'common.close': 'Закрыть',
    'common.back': 'Назад',
    'common.next': 'Следующий',
    'common.previous': 'Предыдущий',
    'common.viewMore': 'Посмотреть Больше',
    'common.readMore': 'Читать Далее',
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
    'home.hero.title': 'Used cars imported from Europe',
    'home.hero.subtitle': 'Find the perfect car from our select range of automobiles. Guaranteed quality and competitive prices.',
    'home.hero.viewCars': 'View Cars',
    'home.hero.contactUs': 'Contact Us',
    'home.featuredCars.title': 'Special Offers',
    'home.featuredCars.subtitle': 'Discover the best deals from our catalog - verified and guaranteed automobiles with competitive prices.',
    'home.featuredCars.viewAll': 'View All Offers',
    'home.comingSoon.title': 'Coming Soon',
    'home.comingSoon.subtitle': 'Discover the cars that will be available soon in our showroom',
    'home.comingSoon.viewAll': 'View All Cars',
    'home.comingSoon.badge': 'COMING SOON',
    'home.comingSoon.noResults': 'No cars scheduled to arrive soon.',
    'home.about.title': 'About Direct Auto',
    'home.about.subtitle': 'With years of experience in the automotive industry, we pride ourselves on our quality service and diverse selection of automobiles.',
    'home.about.description': 'Direct Auto is your trusted partner for purchasing automobiles in Moldova. We offer a wide range of new and used cars, all verified and guaranteed to provide you with the best buying experience.',
    'home.about.learnMore': 'Learn More',
    'home.testimonials.title': 'What our customers say',
    'home.testimonials.subtitle': 'Read reviews from our satisfied customers about their experience with Direct Auto.',
    
    // Car details
    'car.details': 'Details',
    'car.contact': 'Contact',
    'car.backToCatalog': 'Back to Catalog',
    'car.specifications': 'Specifications',
    'car.year': 'Year',
    'car.mileage': 'Mileage',
    'car.engine': 'Engine',
    'car.transmission': 'Transmission',
    'car.fuelType': 'Fuel Type',
    'car.bodyType': 'Body Type',
    'car.drivetrain': 'Drivetrain',
    'car.description': 'Description',
    'car.images': 'Images',
    'car.video': 'Video',
    'car.topOffer': 'TOP OFFER',
    'car.price': 'Price',
    'car.loading': 'Loading...',
    'car.notFound': 'Car not found',
    'car.error': 'An error occurred while loading data.',
    
    // Catalog
    'catalog.title': 'Our Car Catalog',
    'catalog.subtitle': 'Discover our complete range of automobiles. Use the filters to find the perfect car for you.',
    'catalog.filter': 'Filter',
    'catalog.search': 'Search car',
    'catalog.brand': 'Brand',
    'catalog.model': 'Model',
    'catalog.year': 'Year',
    'catalog.fuelType': 'Engine Type',
    'catalog.transmission': 'Transmission',
    'catalog.bodyType': 'Body Type',
    'catalog.price': 'Price (EUR)',
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
    'contact.info.title': 'Contact Information',
    'contact.info.address': 'Address',
    'contact.info.workingHours': 'Working Hours',
    'contact.info.hours': 'Monday - Friday: 09:00 - 18:00\nSaturday: 10:00 - 16:00\nSunday: Closed',
    
    // About
    'about.title': 'About Direct Auto',
    'about.subtitle': 'Our story in the world of automobiles',
    'about.mission.title': 'Our Mission',
    'about.mission.description': 'To provide our customers with the best automobiles at affordable prices with superior quality service.',
    'about.vision.title': 'Our Vision',
    'about.vision.description': 'To become the leading automotive market in Moldova through transparency, quality and reliable services.',
    'about.values.title': 'Our Values',
    'about.values.quality': 'Quality',
    'about.values.trust': 'Trust',
    'about.values.service': 'Service',
    'about.values.innovation': 'Innovation',
    
    // Footer
    'footer.company': 'Company',
    'footer.services': 'Services',
    'footer.contact': 'Contact',
    'footer.followUs': 'Follow Us',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms and Conditions',
    
    // Admin
    'admin.title': 'Admin Panel',
    'admin.addCar': 'Add Car',
    'admin.manageCars': 'Manage Cars',
    'admin.topOffers': 'Top Offers',
    'admin.comingSoon': 'Coming Soon',
    
    // Common
    'common.all': 'All',
    'common.loading': 'Loading...',
    'common.km': 'km',
    'common.year': 'year',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.viewMore': 'View More',
    'common.readMore': 'Read More',
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