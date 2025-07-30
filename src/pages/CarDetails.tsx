import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  descriere: string;
  descriere_ro: string;
  descriere_ru: string;
  descriere_en: string;
  images: string[];
  video_url: string;
  status: string;
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

  useEffect(() => {
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


  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Gallery */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              <Card className="border-0 shadow-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    {car.images && car.images.length > 0 ? (
                      <img 
                        src={car.images[currentImageIndex]} 
                        alt={`${car.marca} ${car.model}`}
                        className="w-full h-96 object-cover cursor-pointer"
                        onClick={() => setShowImageModal(true)}
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
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
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
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Descriere</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {car.descriere_ro || car.descriere || "Descriere detaliată în curs de actualizare."}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details and Actions */}
            <div className="space-y-6">
              {/* Car Info Card */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-foreground">
                        {car.marca} {car.model}
                      </CardTitle>
                      <p className="text-lg text-muted-foreground mt-1">
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
                  <div className="text-center p-4 bg-auto-green/5 rounded-lg border border-auto-green/20">
                    <div className="text-4xl font-bold text-auto-green">
                      {formatPrice(car.pret)}
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Specificații Tehnice</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-border/50">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-auto-green" />
                          <span className="text-sm font-medium">An fabricație</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{car.an_fabricatie}</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-border/50">
                        <div className="flex items-center space-x-2">
                          <Gauge className="h-4 w-4 text-auto-green" />
                          <span className="text-sm font-medium">Kilometraj</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {car.kilometraj?.toLocaleString() || 0} km
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-border/50">
                        <div className="flex items-center space-x-2">
                          <Fuel className="h-4 w-4 text-auto-green" />
                          <span className="text-sm font-medium">Tip motor</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{car.tip_motor}</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-border/50">
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4 text-auto-green" />
                          <span className="text-sm font-medium">Cutie viteze</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{car.cutie_viteze}</span>
                      </div>
                      
                      {car.tractiune && (
                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-auto-green" />
                            <span className="text-sm font-medium">Tracțiune</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{car.tractiune}</span>
                        </div>
                      )}
                      
                      {car.caroserie && (
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-auto-green" />
                            <span className="text-sm font-medium">Caroserie</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{car.caroserie}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="space-y-3">
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
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative">
            {car?.images && (
              <img 
                src={car.images[currentImageIndex]} 
                alt={`${car.marca} ${car.model}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-background/80 hover:bg-background"
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