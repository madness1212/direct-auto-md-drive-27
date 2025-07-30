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

const Catalog = () => {
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
  const brands = ["Toate", "Toyota", "BMW", "Mercedes-Benz", "Audi", "Ford", "Hyundai", "Kia", "Nissan", "Mazda", "Volkswagen", "Skoda"];
  const models = ["Toate", "Camry", "Corolla", "X3", "X5", "A4", "A6", "E-Class", "C-Class", "Focus", "Tucson", "Sportage"];
  const years = ["Toate", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"];
  const fuelTypes = ["Toate", "Benzină", "Diesel", "Hibrid", "Electric", "GPL"];
  const transmissions = ["Toate", "Manuală", "Automată", "CVT"];
  const bodyTypes = ["Toate", "SUV", "Sedan", "Hatchback", "Combi", "Coupe", "Cabriolet"];

  // Funcție pentru încărcarea datelor din Supabase
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase
          .from('car_listings')
          .select('*')
          .eq('status', 'active');
        
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
    const matchesBrand = !selectedBrand || selectedBrand === "Toate" || car.brand === selectedBrand;
    const matchesModel = !selectedModel || selectedModel === "Toate" || car.model === selectedModel;
    const matchesYear = !selectedYear || selectedYear === "Toate" || car.year.toString() === selectedYear;
    const matchesFuel = !selectedFuel || selectedFuel === "Toate" || car.fuel === selectedFuel;
    const matchesTransmission = !selectedTransmission || selectedTransmission === "Toate" || car.transmission === selectedTransmission;
    const matchesBodyType = !selectedBodyType || selectedBodyType === "Toate" || car.bodyType === selectedBodyType;
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
              Catalogul Nostru Auto
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descoperă gama noastră completă de automobile noi și rulate. 
              Folosește filtrele pentru a găsi mașina perfectă pentru tine.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Button - Only visible on mobile */}
            <div className="lg:hidden mb-4">
              <Drawer open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <DrawerTrigger asChild>
                  <Button className="w-full bg-auto-green hover:bg-auto-green-dark text-white flex items-center justify-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrează
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
                        <Label htmlFor="search-mobile">Caută mașina</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="search-mobile"
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
                        <Label>Preț (USD): ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}</Label>
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
                    </div>
                  </div>
                  
                  <DrawerFooter className="flex flex-row gap-2">
                    <Button variant="outline" onClick={clearFilters} className="flex-1">
                      Resetează
                    </Button>
                    <Button onClick={handleFiltersApply} className="flex-1 bg-auto-green hover:bg-auto-green-dark text-white">
                      Aplică Filtrele
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
                    <Label>Preț (USD): ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}</Label>
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                  <Card key={car.id} className="group hover:shadow-xl transition-all duration-300 bg-background border-0 shadow-md">
                    <CardContent className="p-0">
                      {/* Image Container */}
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img 
                          src={car.image} 
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {car.isTopOffer && (
                          <Badge className="absolute top-4 left-4 bg-auto-green hover:bg-auto-green text-white">
                            TOP OFERTĂ
                          </Badge>
                        )}
                        <div className="absolute top-4 right-4 flex space-x-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-background/80 hover:bg-background">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-background/80 hover:bg-background">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">
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
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-auto-green" />
                            <span className="text-muted-foreground">{car.year}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Gauge className="h-4 w-4 text-auto-green" />
                            <span className="text-muted-foreground">{car.mileage.toLocaleString()} km</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Fuel className="h-4 w-4 text-auto-green" />
                            <span className="text-muted-foreground">{car.fuel}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Settings className="h-4 w-4 text-auto-green" />
                            <span className="text-muted-foreground">{car.transmission}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-auto-green" />
                            <span className="text-muted-foreground">{car.bodyType}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-auto-green">
                              ${car.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ≈ {(car.price * 18).toLocaleString()} MDL
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