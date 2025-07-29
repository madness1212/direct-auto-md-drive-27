import { useState } from "react";
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
  Car
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

  // Mock data pentru filtre
  const brands = ["Toate", "Toyota", "BMW", "Mercedes-Benz", "Audi", "Ford", "Hyundai", "Kia", "Nissan", "Mazda", "Volkswagen", "Skoda"];
  const models = ["Toate", "Camry", "Corolla", "X3", "X5", "A4", "A6", "E-Class", "C-Class", "Focus", "Tucson", "Sportage"];
  const years = ["Toate", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"];
  const fuelTypes = ["Toate", "Benzină", "Diesel", "Hibrid", "Electric", "GPL"];
  const transmissions = ["Toate", "Manuală", "Automată", "CVT"];
  const bodyTypes = ["Toate", "SUV", "Sedan", "Hatchback", "Combi", "Coupe", "Cabriolet"];

  // Mock cars data - mai multe mașini pentru catalog
  const cars = [
    {
      id: 1,
      brand: "Toyota",
      model: "Camry",
      year: 2022,
      price: 28500,
      mileage: 15000,
      fuel: "Benzină",
      transmission: "Automată",
      bodyType: "Sedan",
      image: "/placeholder.svg",
      isTopOffer: true,
      rating: 4.8,
      phone: "+373 69 123 456"
    },
    {
      id: 2,
      brand: "BMW",
      model: "X3",
      year: 2021,
      price: 45000,
      mileage: 25000,
      fuel: "Diesel",
      transmission: "Automată",
      bodyType: "SUV",
      image: "/placeholder.svg",
      isTopOffer: true,
      rating: 4.9,
      phone: "+373 69 123 456"
    },
    {
      id: 3,
      brand: "Mercedes-Benz",
      model: "E-Class",
      year: 2020,
      price: 42000,
      mileage: 35000,
      fuel: "Diesel",
      transmission: "Automată",
      bodyType: "Sedan",
      image: "/placeholder.svg",
      isTopOffer: false,
      rating: 4.7,
      phone: "+373 69 123 456"
    },
    {
      id: 4,
      brand: "Audi",
      model: "A4",
      year: 2023,
      price: 38000,
      mileage: 12000,
      fuel: "Benzină",
      transmission: "Automată",
      bodyType: "Sedan",
      image: "/placeholder.svg",
      isTopOffer: false,
      rating: 4.6,
      phone: "+373 69 123 456"
    },
    {
      id: 5,
      brand: "Toyota",
      model: "Corolla",
      year: 2022,
      price: 22000,
      mileage: 18000,
      fuel: "Hibrid",
      transmission: "CVT",
      bodyType: "Hatchback",
      image: "/placeholder.svg",
      isTopOffer: false,
      rating: 4.5,
      phone: "+373 69 123 456"
    },
    {
      id: 6,
      brand: "Ford",
      model: "Focus",
      year: 2021,
      price: 18500,
      mileage: 28000,
      fuel: "Benzină",
      transmission: "Manuală",
      bodyType: "Hatchback",
      image: "/placeholder.svg",
      isTopOffer: false,
      rating: 4.4,
      phone: "+373 69 123 456"
    },
    {
      id: 7,
      brand: "Hyundai",
      model: "Tucson",
      year: 2023,
      price: 32000,
      mileage: 8000,
      fuel: "Benzină",
      transmission: "Automată",
      bodyType: "SUV",
      image: "/placeholder.svg",
      isTopOffer: true,
      rating: 4.8,
      phone: "+373 69 123 456"
    },
    {
      id: 8,
      brand: "Volkswagen",
      model: "Golf",
      year: 2020,
      price: 24000,
      mileage: 45000,
      fuel: "Diesel",
      transmission: "Manuală",
      bodyType: "Hatchback",
      image: "/placeholder.svg",
      isTopOffer: false,
      rating: 4.3,
      phone: "+373 69 123 456"
    },
    {
      id: 9,
      brand: "Kia",
      model: "Sportage",
      year: 2022,
      price: 29000,
      mileage: 20000,
      fuel: "Benzină",
      transmission: "Automată",
      bodyType: "SUV",
      image: "/placeholder.svg",
      isTopOffer: false,
      rating: 4.6,
      phone: "+373 69 123 456"
    },
    {
      id: 10,
      brand: "Nissan",
      model: "Qashqai",
      year: 2021,
      price: 26500,
      mileage: 30000,
      fuel: "Benzină",
      transmission: "CVT",
      bodyType: "SUV",
      image: "/placeholder.svg",
      isTopOffer: false,
      rating: 4.4,
      phone: "+373 69 123 456"
    },
    {
      id: 11,
      brand: "Skoda",
      model: "Octavia",
      year: 2023,
      price: 25000,
      mileage: 5000,
      fuel: "Diesel",
      transmission: "Automată",
      bodyType: "Combi",
      image: "/placeholder.svg",
      isTopOffer: true,
      rating: 4.7,
      phone: "+373 69 123 456"
    },
    {
      id: 12,
      brand: "Mazda",
      model: "CX-5",
      year: 2022,
      price: 31000,
      mileage: 16000,
      fuel: "Benzină",
      transmission: "Automată",
      bodyType: "SUV",
      image: "/placeholder.svg",
      isTopOffer: false,
      rating: 4.5,
      phone: "+373 69 123 456"
    }
  ];

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
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
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
            <div className="lg:w-3/4">
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
                          <Button className="flex-1 bg-auto-green hover:bg-auto-green-dark text-white">
                            Vezi Detalii
                          </Button>
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

              {/* Load More */}
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" className="border-auto-green text-auto-green hover:bg-auto-green hover:text-white px-8">
                  Încarcă Mai Multe Automobile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Catalog;