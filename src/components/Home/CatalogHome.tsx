import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Phone,
  Car,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { resetScrollToTop } from "@/utils/scrollUtils";

const CatalogHome = () => {
  const { t } = useLanguage();
  
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedBodyType, setSelectedBodyType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [mileageRange, setMileageRange] = useState([0, 400000]);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableFuelTypes, setAvailableFuelTypes] = useState<string[]>([]);
  const [availableBodyTypes, setAvailableBodyTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [hasComingSoonCars, setHasComingSoonCars] = useState(false);

  const transmissionTypes = [t('common.all'), "Automat", "Manual"];
  const carsPerPage = 12; // 3 cars x 4 rows for desktop
  
  // Generate year options dynamically based on available cars
  const availableYears = [...new Set(cars.map(car => car.year.toString()))].sort((a, b) => parseInt(b) - parseInt(a));
  const years = [t('common.all'), ...availableYears];

  // Fetch cars from Supabase
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
          isTopOffer: car.is_top_offer || false,
          isComingSoon: car.is_coming_soon || false,
          rating: 4.5,
          phone: "+373 696 88 999"
        })) || [];
        
        setCars(transformedCars);
        
        // Check if there are coming soon cars
        const checkComingSoonCars = async () => {
          const { data, error } = await supabase
            .from('car_listings')
            .select('id')
            .eq('status', 'active')
            .eq('is_coming_soon', true)
            .limit(1);
          
          if (!error && data && data.length > 0) {
            setHasComingSoonCars(true);
          } else {
            setHasComingSoonCars(false);
          }
        };
        
        checkComingSoonCars();
        
        // Extract unique values for filters
        const uniqueBrands = [t('common.all'), ...new Set(transformedCars.map(car => car.brand))];
        setAvailableBrands(uniqueBrands);
        
        const uniqueFuelTypes = [t('common.all'), ...new Set(transformedCars.map(car => car.fuel).filter(Boolean))];
        setAvailableFuelTypes(uniqueFuelTypes);
        
        const uniqueBodyTypes = [t('common.all'), ...new Set(transformedCars.map(car => car.bodyType).filter(Boolean))];
        if (!uniqueBodyTypes.includes('Universal')) {
          uniqueBodyTypes.splice(1, 0, 'Universal');
        }
        setAvailableBodyTypes(uniqueBodyTypes);
        
        const filteredModels = selectedBrand && selectedBrand !== t('common.all') 
          ? transformedCars.filter(car => car.brand === selectedBrand).map(car => car.model)
          : transformedCars.map(car => car.model);
        const uniqueModels = [t('common.all'), ...new Set(filteredModels)];
        setAvailableModels(uniqueModels);
        
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [selectedBrand, t]);
  
  // Update available models when brand changes
  useEffect(() => {
    if (cars.length > 0) {
      const filteredModels = selectedBrand && selectedBrand !== t('common.all') 
        ? cars.filter(car => car.brand === selectedBrand).map(car => car.model)
        : cars.map(car => car.model);
      const uniqueModels = [t('common.all'), ...new Set(filteredModels)];
      setAvailableModels(uniqueModels);
      
      if (selectedModel && selectedModel !== t('common.all') && !uniqueModels.includes(selectedModel)) {
        setSelectedModel("");
      }
    }
  }, [selectedBrand, cars, t, selectedModel]);

  const filteredCars = cars.filter(car => {
    const matchesBrand = !selectedBrand || selectedBrand === t('common.all') || car.brand === selectedBrand;
    const matchesModel = !selectedModel || selectedModel === t('common.all') || car.model === selectedModel;
    const matchesYear = !selectedYear || selectedYear === t('common.all') || car.year.toString() === selectedYear;
    const matchesFuel = !selectedFuel || selectedFuel === t('common.all') || car.fuel.toLowerCase() === selectedFuel.toLowerCase();
    const matchesTransmission = !selectedTransmission || selectedTransmission === t('common.all') || 
      car.transmission.toLowerCase().includes(selectedTransmission.toLowerCase()) ||
      (selectedTransmission.toLowerCase() === 'automat' && car.transmission.toLowerCase().includes('automat')) ||
      (selectedTransmission.toLowerCase() === 'manual' && (car.transmission.toLowerCase().includes('manual') || car.transmission.toLowerCase().includes('manuala')));
    const matchesBodyType = !selectedBodyType || selectedBodyType === t('common.all') || 
      (car.bodyType && car.bodyType.toLowerCase().includes(selectedBodyType.toLowerCase()));
    const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
    const matchesMileage = car.mileage >= mileageRange[0] && car.mileage <= mileageRange[1];
    
    return matchesBrand && matchesModel && matchesYear && 
           matchesFuel && matchesTransmission && matchesBodyType && 
           matchesPrice && matchesMileage;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
        return b.year - a.year;
      default:
        return 0;
    }
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

  const clearFilters = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedYear("");
    setSelectedFuel("");
    setSelectedTransmission("");
    setSelectedBodyType("");
    setPriceRange([0, 100000]);
    setMileageRange([0, 400000]);
    setCurrentPage(1);
  };

  const generateSlug = (brand: string, model: string, year: number, id: string) => {
    const cleanString = (str: string) => 
      str.toLowerCase()
         .replace(/[^\w\s-]/g, '')
         .replace(/\s+/g, '-')
         .replace(/-+/g, '-')
         .trim();
    
    return `${cleanString(brand)}-${cleanString(model)}-${year}-${id}`;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <Button
          key="prev"
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentPage(currentPage - 1);
            resetScrollToTop();
          }}
          className="border-auto-green text-auto-green hover:bg-auto-green hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      );
    }

    // First page if not in range
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setCurrentPage(1);
            resetScrollToTop();
          }}
          className={currentPage === 1 
            ? "bg-auto-green text-white" 
            : "border-auto-green text-auto-green hover:bg-auto-green hover:text-white"
          }
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="px-2">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setCurrentPage(i);
            resetScrollToTop();
          }}
          className={currentPage === i 
            ? "bg-auto-green text-white" 
            : "border-auto-green text-auto-green hover:bg-auto-green hover:text-white"
          }
        >
          {i}
        </Button>
      );
    }

    // Last page if not in range
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="px-2">...</span>);
      }
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setCurrentPage(totalPages);
            resetScrollToTop();
          }}
          className={currentPage === totalPages 
            ? "bg-auto-green text-white" 
            : "border-auto-green text-auto-green hover:bg-auto-green hover:text-white"
          }
        >
          {totalPages}
        </Button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <Button
          key="next"
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentPage(currentPage + 1);
            resetScrollToTop();
          }}
          className="border-auto-green text-auto-green hover:bg-auto-green hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      );
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        {pages}
      </div>
    );
  };

  return (
    <section className="py-8 bg-auto-gray">
      <div className="container mx-auto px-4">

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
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
                    {/* Brand Filter */}
                    <div className="space-y-2">
                      <Label>Marca</Label>
                      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează marca" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableBrands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Model Filter */}
                    {selectedBrand && selectedBrand !== t('common.all') && (
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează modelul" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableModels.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

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
                      <Label>Tipul motorului</Label>
                      <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează tipul motorului" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFuelTypes.map((fuel) => (
                            <SelectItem key={fuel} value={fuel}>
                              {fuel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Transmission Filter */}
                    <div className="space-y-2">
                      <Label>Cutia de viteze</Label>
                      <Select value={selectedTransmission} onValueChange={setSelectedTransmission}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează cutia de viteze" />
                        </SelectTrigger>
                        <SelectContent>
                          {transmissionTypes.map((transmission) => (
                            <SelectItem key={transmission} value={transmission}>
                              {transmission}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Body Type Filter */}
                    <div className="space-y-2">
                      <Label>Tipul caroseriei</Label>
                      <Select value={selectedBodyType} onValueChange={setSelectedBodyType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează tipul caroseriei" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableBodyTypes.map((bodyType) => (
                            <SelectItem key={bodyType} value={bodyType}>
                              {bodyType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                      <Label>Preț: €{priceRange[0].toLocaleString()} - €{priceRange[1].toLocaleString()}</Label>
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
                        max={400000}
                        step={5000}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex gap-2">
                  <Button variant="outline" onClick={clearFilters} className="flex-1">
                    Resetează
                  </Button>
                  <Button onClick={() => setIsFiltersOpen(false)} className="flex-1 bg-auto-green hover:bg-auto-green-dark text-white">
                    Aplică
                  </Button>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-1/4">
            <Card className="border-0 shadow-card sticky top-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-auto-green" />
                    Filtrează Rezultatele
                  </h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Resetează
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Brand Filter */}
                  <div className="space-y-2">
                    <Label>Marca</Label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBrands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Model Filter */}
                  {selectedBrand && selectedBrand !== t('common.all') && (
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează modelul" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

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
                    <Label>Tipul motorului</Label>
                    <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează tipul motorului" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFuelTypes.map((fuel) => (
                          <SelectItem key={fuel} value={fuel}>
                            {fuel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Transmission Filter */}
                  <div className="space-y-2">
                    <Label>Cutia de viteze</Label>
                    <Select value={selectedTransmission} onValueChange={setSelectedTransmission}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează cutia de viteze" />
                      </SelectTrigger>
                      <SelectContent>
                        {transmissionTypes.map((transmission) => (
                          <SelectItem key={transmission} value={transmission}>
                            {transmission}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Body Type Filter */}
                  <div className="space-y-2">
                    <Label>Tipul caroseriei</Label>
                    <Select value={selectedBodyType} onValueChange={setSelectedBodyType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează tipul caroseriei" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBodyTypes.map((bodyType) => (
                          <SelectItem key={bodyType} value={bodyType}>
                            {bodyType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <Label>Preț: €{priceRange[0].toLocaleString()} - €{priceRange[1].toLocaleString()}</Label>
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
                      max={400000}
                      step={5000}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Cars Grid */}
          <div className="lg:w-3/4">
            {/* Sort Options */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:space-x-4 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    const featuredSection = document.querySelector('[data-section="featured-cars"]');
                    if (featuredSection) {
                      featuredSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full sm:w-auto border-auto-green text-auto-green hover:bg-auto-green hover:text-white"
                >
                  Oferte speciale
                </Button>
                {hasComingSoonCars && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const comingSoonSection = document.querySelector('[data-section="coming-soon"]');
                      if (comingSoonSection) {
                        comingSoonSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full sm:w-auto border-auto-green text-auto-green hover:bg-auto-green hover:text-white"
                  >
                    În curând
                  </Button>
                )}
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Cele mai noi</SelectItem>
                  <SelectItem value="price-asc">Preț crescător</SelectItem>
                  <SelectItem value="price-desc">Preț descrescător</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Se încarcă automobilele...</p>
              </div>
            ) : currentCars.length === 0 ? (
              <div className="text-center py-12">
                <Car className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Nu au fost găsite automobile</h3>
                <p className="text-muted-foreground mb-4">Încearcă să modifici filtrele pentru mai multe rezultate</p>
                <Button onClick={clearFilters} variant="outline">
                  Resetează Filtrele
                </Button>
              </div>
            ) : (
              <>
                {/* Cars Grid - 3x4 layout for desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentCars.map((car) => (
                    <Link key={car.id} to={`/catalog/${generateSlug(car.brand, car.model, car.year, car.id)}`}>
                      <Card className="border-0 shadow-card hover:shadow-lg transition-all duration-300 group cursor-pointer">
                        <CardContent className="p-0">
                          {/* Image Container */}
                          <div className="relative overflow-hidden rounded-t-lg">
                            <img
                              src={car.image}
                              alt={`${car.brand} ${car.model}`}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                              {car.isTopOffer && (
                                <Badge className="bg-gradient-primary text-white">
                                  <Star className="h-3 w-3 mr-1 fill-current" />
                                  Ofertă Top
                                </Badge>
                              )}
                            </div>
                          </div>

                        {/* Content */}
                        <div className="p-5 space-y-4">
                          <div>
                            <h3 className="text-sm font-semibold text-foreground truncate">
                              {car.brand} {car.model}
                            </h3>
                          </div>

                          {/* Specifications */}
                          <div className="grid grid-cols-2 gap-2 text-base">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-auto-green" />
                              <span className="text-muted-foreground">{car.year}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Gauge className="h-4 w-4 text-auto-green" />
                              <span className="text-muted-foreground">{car.mileage.toLocaleString()} km</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Fuel className="h-4 w-4 text-auto-green" />
                              <span className="text-muted-foreground capitalize">{car.fuel}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Settings className="h-4 w-4 text-auto-green" />
                              <span className="text-muted-foreground capitalize">{car.transmission}</span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className={`text-xl font-bold ${
                                car.isTopOffer 
                                  ? 'bg-gradient-primary bg-clip-text text-transparent' 
                                  : 'text-auto-green'
                              }`}>
                                €{car.price.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <Button className="w-full bg-auto-green hover:bg-auto-green-dark text-white">
                              Vezi Detalii
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1 border-auto-green text-auto-green hover:bg-auto-green hover:text-white"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(`tel:${car.phone}`, '_self');
                              }}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Sună
                            </Button>
                          </div>
                        </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogHome;
