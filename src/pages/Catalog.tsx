import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  SlidersHorizontal
} from "lucide-react";

import Layout from "@/components/Layout/Layout";

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // Mock data pentru filtre
  const brands = ["Toate", "Toyota", "BMW", "Mercedes-Benz", "Audi", "Ford", "Hyundai", "Kia", "Nissan", "Mazda"];
  const years = ["Toate", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];
  const priceRanges = ["Toate", "0-15000", "15000-25000", "25000-35000", "35000-50000", "50000+"];

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
      image: "/placeholder.svg",
      isTopOffer: true,
      rating: 4.8
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
      image: "/placeholder.svg",
      isTopOffer: true,
      rating: 4.9
    },
    // ... Alte mașini ar fi adăugate aici
  ];

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || selectedBrand === "Toate" || car.brand === selectedBrand;
    const matchesYear = !selectedYear || selectedYear === "Toate" || car.year.toString() === selectedYear;
    
    return matchesSearch && matchesBrand && matchesYear;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-auto-gray">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-auto-dark">
            Catalogul Nostru Auto
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descoperă gama noastră completă de automobile noi și rulate. 
            Folosește filtrele pentru a găsi mașina perfectă pentru tine.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-0 shadow-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Prețul (USD)</Label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează prețul" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range === "Toate" ? "Toate prețurile" : `$${range}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* More Filters Button */}
              <div className="flex items-end">
                <Button variant="outline" className="w-full border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Mai multe filtre
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car) => (
            <Card key={car.id} className="group hover:shadow-hero transition-all duration-300 bg-background border-0">
              <CardContent className="p-0">
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={car.image} 
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {car.isTopOffer && (
                    <Badge className="absolute top-4 left-4 bg-auto-green hover:bg-auto-green-dark">
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
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-auto-dark">
                      {car.brand} {car.model}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${
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
                    <Button className="flex-1 bg-gradient-primary hover:bg-auto-green-dark text-sm">
                      Detalii
                    </Button>
                    <Button variant="outline" className="flex-1 text-sm border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground">
                      Contactează
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button size="lg" variant="outline" className="border-auto-green text-auto-green hover:bg-auto-green hover:text-primary-foreground">
            Încarcă Mai Multe
          </Button>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Catalog;