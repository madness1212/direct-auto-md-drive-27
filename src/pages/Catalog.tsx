import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  Star,
  Heart,
  Eye,
  Filter,
  Search,
  SlidersHorizontal,
  Phone,
  Mail,
  Car,
  X
} from "lucide-react";

import Layout from "@/components/Layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";


const Catalog = () => {
  const { t } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedBodyType, setSelectedBodyType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [mileageRange, setMileageRange] = useState([0, 200000]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Mock data pentru filtre
  const brands = [t('common.all'), "Toyota", "BMW", "Mercedes-Benz", "Audi", "Ford", "Hyundai", "Kia", "Nissan", "Mazda", "Volkswagen", "Skoda"];
  const models = [t('common.all'), "Camry", "Corolla", "X3", "X5", "A4", "A6", "E-Class", "C-Class", "Focus", "Tucson", "Sportage"];
  const years = [t('common.all'), "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"];
  const fuelTypes = [t('common.all'), "Benzină", "Diesel", "Hibrid", "Electric", "GPL"];
  const transmissions = [t('common.all'), "Manuală", "Automată", "CVT"];
  const bodyTypes = [t('common.all'), "SUV", "Sedan", "Hatchback", "Combi", "Coupe", "Cabriolet"];

  // Funcție pentru încărcarea datelor din Supabase
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase
          .from('car_listings')
          .select('*')
          .eq('status', 'active')
          .eq('is_coming_soon', false);
        
        if (error) {
          console.error('Error fetching cars:', error);
          return;
        }
        
        // Transformă datele pentru a fi compatibile cu UI-ul
        const transformedCars = data?.map(car => ({
          id: car.id,
          brand: car.marca,
          model: car.model,
          year: car.an_fabricatie,
          price: car.pret,
          mileage: car.kilometraj || 0,
          fuel: car.tip_motor,
          transmission: car.cutie_viteze,
          bodyType: car.caroserie || 'N/A',
          engineCapacity: car.capacitate_motor,
          image: car.images && car.images.length > 0 ? car.images[0] : "/placeholder.svg",
          isTopOffer: false, // Poți adăuga logică pentru acest câmp
          rating: 4.5, // Placeholder rating
          phone: "+373 69 123 456" // Placeholder phone
        })) || [];
        
        setCars(transformedCars);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || selectedBrand === t('common.all') || car.brand === selectedBrand;
    const matchesModel = !selectedModel || selectedModel === t('common.all') || car.model === selectedModel;
    const matchesYear = !selectedYear || selectedYear === t('common.all') || car.year.toString() === selectedYear;
    const matchesFuel = !selectedFuel || selectedFuel === t('common.all') || car.fuel === selectedFuel;
    const matchesTransmission = !selectedTransmission || selectedTransmission === t('common.all') || car.transmission === selectedTransmission;
    const matchesBodyType = !selectedBodyType || selectedBodyType === t('common.all') || car.bodyType === selectedBodyType;
    const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
    const matchesMileage = car.mileage >= mileageRange[0] && car.mileage <= mileageRange[1];
    
    return matchesSearch && matchesBrand && matchesModel && matchesYear && 
           matchesFuel && matchesTransmission && matchesBodyType && 
           matchesPrice && matchesMileage;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedYear("");
    setSelectedFuel("");
    setSelectedTransmission("");
    setSelectedBodyType("");
    setPriceRange([0, 100000]);
    setMileageRange([0, 200000]);
  };

  const handleFiltersApply = () => {
    setIsFiltersOpen(false);
  };

  // Funcție pentru generarea slug-ului
  const generateSlug = (brand: string, model: string, year: number, id: string) => {
    const cleanString = (str: string) => 
      str.toLowerCase()
         .replace(/[^\w\s-]/g, '') // Elimină caractere speciale
         .replace(/\s+/g, '-') // Înlocuiește spațiile cu liniuțe
         .replace(/-+/g, '-') // Elimină liniuțele multiple
         .trim();
    
    // Păstrează ID-ul la sfârșit, separat de restul informațiilor
    return `${cleanString(brand)}-${cleanString(model)}-${year}-${id}`;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('catalog.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('catalog.subtitle')}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Button - Only visible on mobile */}
            <div className="lg:hidden mb-4">
              <Drawer open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <DrawerTrigger asChild>
                  <Button className="w-full bg-auto-green hover:bg-auto-green-dark text-white flex items-center justify-center gap-2">
                    <Filter className="h-4 w-4" />
                    {t('catalog.filter')}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[90vh]">
                  <DrawerHeader>
                    <DrawerTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Filter className="h-5 w-5 mr-2 text-auto-green" />
                        Filtrează Rezultatele
                      </span>
                      <DrawerClose asChild>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </DrawerClose>
                    </DrawerTitle>
                  </DrawerHeader>
                  
                  <div className="px-4 overflow-y-auto flex-1">
                    <div className="space-y-6 pb-6">
                      {/* Search */}
                      <div className="space-y-2">
                        <Label htmlFor="search-mobile">{t('catalog.search')}</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="search-mobile"
                            placeholder={t('catalog.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      {/* Brand Filter */}
                      <div className="space-y-2">
                        <Label>{t('catalog.brand')}</Label>
                        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                          <SelectTrigger>
                            <SelectValue placeholder={`${t('catalog.selectBrand')}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((brand) => (
                              <SelectItem key={brand} value={brand}>
                                {brand}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Model Filter */}
                      <div className="space-y-2">
                        <Label>{t('catalog.model')}</Label>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger>
                            <SelectValue placeholder={`${t('catalog.selectModel')}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {models.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Year Filter */}
                      <div className="space-y-2">
                        <Label>{t('catalog.year')}</Label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                          <SelectTrigger>
                            <SelectValue placeholder={`${t('catalog.selectYear')}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Fuel Type Filter */}
                      <div className="space-y-2">
                        <Label>{t('catalog.fuelType')}</Label>
                        <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                          <SelectTrigger>
                            <SelectValue placeholder={`${t('catalog.selectFuel')}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {fuelTypes.map((fuel) => (
                              <SelectItem key={fuel} value={fuel}>
                                {fuel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Transmission Filter */}
                      <div className="space-y-2">
                        <Label>{t('catalog.transmission')}</Label>
                        <Select value={selectedTransmission} onValueChange={setSelectedTransmission}>
                          <SelectTrigger>
                            <SelectValue placeholder={`${t('catalog.selectTransmission')}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {transmissions.map((transmission) => (
                              <SelectItem key={transmission} value={transmission}>
                                {transmission}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Body Type Filter */}
                      <div className="space-y-2">
                        <Label>{t('catalog.bodyType')}</Label>
                        <Select value={selectedBodyType} onValueChange={setSelectedBodyType}>
                          <SelectTrigger>
                            <SelectValue placeholder={`${t('catalog.selectBodyType')}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {bodyTypes.map((bodyType) => (
                              <SelectItem key={bodyType} value={bodyType}>
                                {bodyType}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price Range */}
                      <div className="space-y-2">
                        <Label>{t('catalog.price')}: €{priceRange[0].toLocaleString()} - €{priceRange[1].toLocaleString()}</Label>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={100000}
                          step={1000}
                          className="w-full"
                        />
                      </div>

                      {/* Mileage Range */}
                      <div className="space-y-2">
                        <Label>{t('catalog.mileage')}: {mileageRange[0].toLocaleString()} - {mileageRange[1].toLocaleString()} {t('common.km')}</Label>
                        <Slider
                          value={mileageRange}
                          onValueChange={setMileageRange}
                          max={200000}
                          step={5000}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DrawerFooter className="flex flex-row gap-2">
                    <Button variant="outline" onClick={clearFilters} className="flex-1">
                      {t('catalog.reset')}
                    </Button>
                    <Button onClick={handleFiltersApply} className="flex-1 bg-auto-green hover:bg-auto-green-dark text-white">
                      {t('catalog.apply')}
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>

            {/* Desktop Filters Sidebar - Hidden on mobile */}
            <div className="hidden lg:block lg:w-1/4">
              <Card className="border-0 shadow-card sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Filter className="h-5 w-5 mr-2 text-auto-green" />
                      Filtrează Rezultatele
                    </span>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Resetează
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div className="space-y-2">
                    <Label htmlFor="search">Caută mașina</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Marcă, model..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div className="space-y-2">
                    <Label>Marca</Label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Model Filter */}
                  <div className="space-y-2">
                    <Label>Modelul</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează modelul" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year Filter */}
                  <div className="space-y-2">
                    <Label>Anul</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează anul" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fuel Type Filter */}
                  <div className="space-y-2">
                    <Label>Tip Motor</Label>
                    <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează tipul motorului" />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map((fuel) => (
                          <SelectItem key={fuel} value={fuel}>
                            {fuel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Transmission Filter */}
                  <div className="space-y-2">
                    <Label>Cutie de Viteze</Label>
                    <Select value={selectedTransmission} onValueChange={setSelectedTransmission}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează cutia de viteze" />
                      </SelectTrigger>
                      <SelectContent>
                        {transmissions.map((transmission) => (
                          <SelectItem key={transmission} value={transmission}>
                            {transmission}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Body Type Filter */}
                  <div className="space-y-2">
                    <Label>Caroserie</Label>
                    <Select value={selectedBodyType} onValueChange={setSelectedBodyType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează caroseria" />
                      </SelectTrigger>
                      <SelectContent>
                        {bodyTypes.map((bodyType) => (
                          <SelectItem key={bodyType} value={bodyType}>
                            {bodyType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <Label>Preț (EUR): €{priceRange[0].toLocaleString()} - €{priceRange[1].toLocaleString()}</Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={100000}
                      step={1000}
                      className="w-full"
                    />
                  </div>

                  {/* Mileage Range */}
                  <div className="space-y-2">
                    <Label>Kilometraj: {mileageRange[0].toLocaleString()} - {mileageRange[1].toLocaleString()} km</Label>
                    <Slider
                      value={mileageRange}
                      onValueChange={setMileageRange}
                      max={200000}
                      step={5000}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4 w-full">
              {/* Results Count and Sort */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Găsite {filteredCars.length} automobile
                </p>
                <Select defaultValue="price-asc">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sortează după" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">Preț crescător</SelectItem>
                    <SelectItem value="price-desc">Preț descrescător</SelectItem>
                    <SelectItem value="year-desc">An nou</SelectItem>
                    <SelectItem value="mileage-asc">Kilometraj mic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cars Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-auto-green mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Se încarcă automobilele...</p>
                </div>
              ) : filteredCars.length === 0 ? (
                <div className="text-center py-12">
                  <Car className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Nu au fost găsite automobile</h3>
                  <p className="text-muted-foreground">Încercați să modificați filtrele pentru a găsi mai multe rezultate.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredCars.map((car) => (
                  <Card key={car.id} className="group hover:shadow-xl transition-all duration-300 bg-background border-0 shadow-sm">
                    <CardContent className="p-0">
                      {/* Image Container */}
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img 
                          src={car.image} 
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {car.isTopOffer && (
                          <Badge className="absolute top-4 left-4 bg-auto-green hover:bg-auto-green text-white">
                            TOP OFERTĂ
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {car.brand} {car.model}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < Math.floor(car.rating) 
                                      ? 'text-auto-green fill-current' 
                                      : 'text-muted-foreground'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">({car.rating})</span>
                          </div>
                        </div>

                        {/* Specifications */}
                         <div className="grid grid-cols-2 gap-2 text-sm">
                           <div className="flex items-center space-x-1">
                             <Calendar className="h-3 w-3 text-auto-green" />
                             <span className="text-muted-foreground">{car.year}</span>
                           </div>
                           <div className="flex items-center space-x-1">
                             <Gauge className="h-3 w-3 text-auto-green" />
                             <span className="text-muted-foreground">{car.mileage.toLocaleString()} km</span>
                           </div>
                           <div className="flex items-center space-x-1">
                             <Fuel className="h-3 w-3 text-auto-green" />
                             <span className="text-muted-foreground">{car.fuel}</span>
                           </div>
                           <div className="flex items-center space-x-1">
                             <Settings className="h-3 w-3 text-auto-green" />
                             <span className="text-muted-foreground">{car.transmission}</span>
                           </div>
                           <div className="flex items-center space-x-1">
                             <Car className="h-3 w-3 text-auto-green" />
                             <span className="text-muted-foreground">{car.bodyType}</span>
                           </div>
                           {car.engineCapacity && (
                             <div className="flex items-center space-x-1">
                               <Fuel className="h-3 w-3 text-auto-green" />
                               <span className="text-muted-foreground">{car.engineCapacity}</span>
                             </div>
                           )}
                         </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xl font-bold text-auto-green">
                              €{car.price.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Link to={`/catalog/${generateSlug(car.brand, car.model, car.year, car.id)}`} className="flex-1">
                            <Button className="w-full bg-auto-green hover:bg-auto-green-dark text-white">
                              Vezi Detalii
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            className="flex-1 border-auto-green text-auto-green hover:bg-auto-green hover:text-white"
                            onClick={() => window.open(`tel:${car.phone}`, '_self')}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Sună
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  ))}
                </div>
              )}

              {/* Load More - doar dacă avem rezultate */}
              {!loading && filteredCars.length > 0 && (
                <div className="text-center mt-12">
                  <Button size="lg" variant="outline" className="border-auto-green text-auto-green hover:bg-auto-green hover:text-white px-8">
                    Încarcă Mai Multe Automobile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Catalog;