import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetScrollToTop } from "@/utils/scrollUtils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Car,
  Phone,
  Mail,
  Share2,
  ChevronLeft as ArrowLeft,
  ChevronRight as ArrowRight,
  Play,
  X
} from "lucide-react";
import Layout from "@/components/Layout/Layout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { TestDriveForm } from "@/components/TestDriveForm";
import RecommendedCars from "@/components/CarDetails/RecommendedCars";
import FinanceCalculator from "@/components/CarDetails/FinanceCalculator";

interface CarListing {
  id: string;
  marca: string;
  model: string;
  an_fabricatie: number;
  kilometraj: number;
  tip_motor: string;
  cutie_viteze: string;
  tractiune: string;
  pret: number;
  caroserie: string;
  capacitate_motor: string;
  putere?: string;
  descriere: string;
  descriere_ro: string;
  descriere_ru: string;
  descriere_en: string;
  images: string[];
  video_url: string;
  status: string;
  is_coming_soon?: boolean;
  is_price_negotiable?: boolean;
  created_at: string;
  updated_at: string;
}

const CarDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [car, setCar] = useState<CarListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset scroll to top when component mounts
    resetScrollToTop();
    
    const fetchCarDetails = async () => {
      if (!slug) return;
      
      try {
        // Extrage ID-ul din slug - ultimele 36 de caractere (UUID standard)
        // Format slug: marca-model-an-uuid
        const carId = slug.slice(-36); // UUID-ul are întotdeauna 36 de caractere
        
        const { data, error } = await supabase
          .from('car_listings')
          .select('*')
          .eq('id', carId)
          .eq('status', 'active')
          .single();
        
        if (error) {
          console.error('Error fetching car details:', error);
          navigate('/catalog');
          return;
        }
        
        setCar(data);
      } catch (error) {
        console.error('Error:', error);
        navigate('/catalog');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [slug, navigate]);

  // Touch/swipe handling for mobile
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!car?.images || car.images.length <= 1) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Only handle horizontal swipes (ignore vertical scrolling)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - next image
          nextImage();
        } else {
          // Swipe right - previous image
          prevImage();
        }
      }
    };

    const imageContainer = imageContainerRef.current;
    if (imageContainer) {
      imageContainer.addEventListener('touchstart', handleTouchStart);
      imageContainer.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        imageContainer.removeEventListener('touchstart', handleTouchStart);
        imageContainer.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [car?.images]);

  const nextImage = () => {
    if (car?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-auto-green"></div>
        </div>
      </Layout>
    );
  }

  if (!car) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Car className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Mașina nu a fost găsită</h2>
            <p className="text-muted-foreground mb-4">Automobilul căutat nu există sau nu mai este disponibil.</p>
            <Button onClick={() => navigate('/catalog')}>
              Înapoi la Catalog
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) => {
    return `€${price.toLocaleString()}`;
  };

  const formatEngineCapacity = (value?: string | null) => {
    if (!value) return '';
    const original = value.toString();
    try {
      const lower = original.toLowerCase();
      const match = original.match(/[\d.,]+/);
      if (!match) return original;
      const numericStr = match[0].replace(/\s/g, '');
      const isLiters = lower.includes('l');
      let cc = 0;
      if (isLiters) {
        const liters = parseFloat(numericStr.replace(/,/g, '.'));
        if (isNaN(liters)) return original;
        cc = Math.round(liters * 1000);
      } else {
        const parsed = parseInt(numericStr.replace(/[.,]/g, ''), 10);
        if (isNaN(parsed)) return original;
        cc = parsed;
      }
      return `${cc.toLocaleString()} cm³`;
    } catch {
      return original;
    }
  };

  const formatPower = (value?: string | null) => {
    if (!value) return '';
    const match = value.toString().match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (!isNaN(num)) return `${num} CP`;
    }
    return value.toString().toUpperCase().includes('CP') ? value.toString() : `${value} CP`;
  };


  return (
    <Layout>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/catalog')}
              className="flex items-center space-x-2 text-auto-green hover:text-auto-green-dark"
            >
              <ChevronLeft className="h-4 w-4" />
              Înapoi la Catalog
            </Button>
            <span>/</span>
            <span className="text-foreground font-medium">
              {car.marca} {car.model} {car.an_fabricatie}
            </span>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images and Gallery */}
            <div className="space-y-6">
              {/* Main Image */}
              <Card className="border-0 shadow-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative" ref={imageContainerRef}>
                    {car.images && car.images.length > 0 ? (
                      <img 
                        src={car.images[currentImageIndex]} 
                        alt={`${car.marca} ${car.model}`}
                        className="w-full h-96 object-cover cursor-pointer select-none"
                        onClick={() => setShowImageModal(true)}
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-96 bg-muted flex items-center justify-center">
                        <Car className="h-24 w-24 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Navigation Arrows */}
                    {car.images && car.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                          onClick={prevImage}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                          onClick={nextImage}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-background/80 hover:bg-background"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast({
                            title: "Link copiat!",
                            description: "Link-ul a fost copiat în clipboard.",
                          });
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Image Counter */}
                    {car.images && car.images.length > 1 && (
                      <div className="absolute bottom-4 left-4 bg-background/80 rounded-md px-3 py-1 text-sm">
                        {currentImageIndex + 1} / {car.images.length}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Thumbnail Gallery */}
              {car.images && car.images.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {car.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-auto-green ring-2 ring-auto-green/30' 
                          : 'border-border hover:border-auto-green/50'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${car.marca} ${car.model} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Video Section */}
              {car.video_url && (
                <Card className="border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Play className="h-5 w-5 text-auto-green" />
                      <span>Video Prezentare</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden max-w-md">
                      {car.video_url.endsWith('.mp4') ? (
                        <video 
                          controls
                          className="w-full h-full object-cover"
                          src={car.video_url}
                        >
                          Browserul tău nu suportă video HTML5.
                        </video>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Button 
                            variant="outline" 
                            size="lg"
                            onClick={() => window.open(car.video_url, '_blank')}
                            className="border-auto-green text-auto-green hover:bg-auto-green hover:text-white"
                          >
                            <Play className="h-5 w-5 mr-2" />
                            Vezi Video
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description Section with Expand/Collapse */}
              {car.descriere && (
                <Card className="border-0 shadow-card">
                  <CardHeader>
                    <CardTitle>Descriere</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className={`text-muted-foreground whitespace-pre-wrap ${
                        showFullDescription ? '' : 'line-clamp-3'
                      }`}>
                        {car.descriere}
                      </div>
                      {car.descriere.length > 150 && (
                        <Button
                          variant="ghost"
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-auto-green hover:text-auto-green-dark p-0 h-auto font-medium"
                        >
                          {showFullDescription ? 'Vezi mai puțin' : 'Vezi mai mult'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Details and Actions */}
            <div className="space-y-6">
              {/* Car Info Card */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl text-foreground">
                        {car.marca} {car.model}
                      </CardTitle>
                      <p className="text-xl text-muted-foreground mt-1 font-medium">
                        {car.an_fabricatie}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-auto-green text-auto-green">
                      {car.status === 'active' ? 'Disponibil' : 'Indisponibil'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price */}
                  <div className="text-center p-6 bg-auto-green/5 rounded-lg border border-auto-green/20">
                    {car.is_coming_soon && car.is_price_negotiable ? (
                      <div className="text-4xl font-bold text-auto-green">
                        Negociabil
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {car.is_coming_soon && (
                          <div className="text-xl font-semibold text-muted-foreground">
                            Preț Estimativ
                          </div>
                        )}
                        <div className="text-4xl font-bold text-auto-green">
                          {formatPrice(car.pret)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Technical Specifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Specificații Tehnice</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-border/50">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-auto-green" />
                          <span className="font-medium">An fabricație</span>
                        </div>
                        <span className="text-muted-foreground">{car.an_fabricatie}</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-border/50">
                        <div className="flex items-center space-x-3">
                          <Gauge className="h-5 w-5 text-auto-green" />
                          <span className="font-medium">Kilometraj</span>
                        </div>
                        <span className="text-muted-foreground">
                          {car.kilometraj?.toLocaleString() || 0} km
                        </span>
                      </div>
                  
                      
                      <div className="flex items-center justify-between py-3 border-b border-border/50">
                        <div className="flex items-center space-x-3">
                          <Fuel className="h-5 w-5 text-auto-green" />
                          <span className="font-medium">Tip Combustibil</span>
                        </div>
                        <span className="text-muted-foreground">{car.tip_motor?.replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </div>
                      
                      {car.capacitate_motor && (
                        <div className="flex items-center justify-between py-3 border-b border-border/50">
                          <div className="flex items-center space-x-3">
                            <Fuel className="h-5 w-5 text-auto-green" />
                            <span className="font-medium">Capacitate motor</span>
                          </div>
                          <span className="text-muted-foreground">{formatEngineCapacity(car.capacitate_motor)}</span>
                        </div>
                      )}
                      
                      {car.putere && (
                        <div className="flex items-center justify-between py-3 border-b border-border/50">
                          <div className="flex items-center space-x-3">
                            <Settings className="h-5 w-5 text-auto-green" />
                            <span className="font-medium">Putere</span>
                          </div>
                          <span className="text-muted-foreground">{formatPower(car.putere)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between py-3 border-b border-border/50">
                        <div className="flex items-center space-x-3">
                          <Settings className="h-5 w-5 text-auto-green" />
                          <span className="font-medium">Cutie viteze</span>
                        </div>
                        <span className="text-muted-foreground">{car.cutie_viteze?.replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </div>
                      
                      {car.tractiune && (
                        <div className="flex items-center justify-between py-3 border-b border-border/50">
                          <div className="flex items-center space-x-3">
                            <Car className="h-5 w-5 text-auto-green" />
                            <span className="font-medium">Tracțiune</span>
                          </div>
                          <span className="text-muted-foreground">{car.tractiune?.replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </div>
                      )}
                      
                      {car.caroserie && (
                        <div className="flex items-center justify-between py-3">
                          <div className="flex items-center space-x-3">
                            <Car className="h-5 w-5 text-auto-green" />
                            <span className="font-medium">Caroserie</span>
                          </div>
                          <span className="text-muted-foreground">{car.caroserie?.replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* Test Drive Button */}
                    <TestDriveForm 
                      carId={car.id} 
                      carTitle={`${car.marca} ${car.model} ${car.an_fabricatie}`}
                    />
                    
                    <Button 
                      className="w-full bg-auto-green hover:bg-auto-green-dark text-white" 
                      size="lg"
                      onClick={() => window.open('tel:+373696888999', '_self')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Sună Acum
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-auto-green text-auto-green hover:bg-auto-green hover:text-white" 
                      size="lg"
                      onClick={() => navigate('/contact')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contactează-ne
                    </Button>
                  </div>

                  {/* Contact Info */}
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Sau sună direct la:</p>
                    <p className="font-semibold text-auto-green">+373 696 88 999</p>
                  </div>
                </CardContent>
              </Card>
          </div>
          
        {/* Recommended Cars Section */}
        <RecommendedCars currentCarId={car.id} />
        </div>
      </div>
      </div>

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 [&>button]:hidden">
          <div className="relative">
            {car?.images && (
              <img 
                src={car.images[currentImageIndex]} 
                alt={`${car.marca} ${car.model}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
            
            {/* Custom Close Button in Box */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-background border border-border shadow-lg hover:bg-accent rounded-md p-2"
              onClick={() => setShowImageModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            {/* Navigation Arrows for Modal */}
            {car?.images && car.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={prevImage}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={nextImage}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {/* Image Counter for Modal */}
            {car?.images && car.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 rounded-md px-3 py-1 text-sm">
                {currentImageIndex + 1} / {car.images.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CarDetails;