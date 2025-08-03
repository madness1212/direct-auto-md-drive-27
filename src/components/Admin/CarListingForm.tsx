import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Upload, X, Loader2, GripVertical, Star } from 'lucide-react';

interface CarListingFormData {
  marca: string;
  model: string;
  an_fabricatie: number;
  kilometraj?: number;
  parcurs?: number;
  tip_motor: string;
  cutie_viteze: string;
  tractiune?: string;
  pret: number;
  caroserie?: string;
  capacitate_motor?: string;
  descriere?: string;
  descriere_ro?: string;
  descriere_ru?: string;
  descriere_en?: string;
  video_url?: string;
  status: string;
  is_top_offer: boolean;
  is_coming_soon: boolean;
}

interface CarListingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export function CarListingForm({ onSuccess, onCancel, initialData, isEditing = false }: CarListingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialData?.images || []);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isTopOffer, setIsTopOffer] = useState(initialData?.is_top_offer || false);
  const [isComingSoon, setIsComingSoon] = useState(initialData?.is_coming_soon || false);
  const { toast } = useToast();
  const { user } = useAuth();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CarListingFormData>({
    defaultValues: {
      ...initialData,
      status: initialData?.status || 'active',
      tip_motor: initialData?.tip_motor || 'benzina',
      cutie_viteze: initialData?.cutie_viteze || 'manuala',
      is_top_offer: initialData?.is_top_offer || false,
      is_coming_soon: initialData?.is_coming_soon || false,
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    const newImageUrls: string[] = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('car-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('car-images')
          .getPublicUrl(filePath);

        newImageUrls.push(publicUrl);
      }

      setUploadedImages([...uploadedImages, ...newImageUrls]);
      toast({
        title: 'Succes',
        description: `${newImageUrls.length} imagini încărcate cu succes.`,
      });
    } catch (error: any) {
      toast({
        title: 'Eroare la încărcarea imaginilor',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages(uploadedImages.filter((_, index) => index !== indexToRemove));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(uploadedImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setUploadedImages(items);
  };

  const onSubmit = async (data: CarListingFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const carData = {
        ...data,
        images: uploadedImages,
        images_order: uploadedImages.map((_, index) => index), // Salvează ordinea imaginilor
        created_by: user.id,
        an_fabricatie: Number(data.an_fabricatie),
        pret: Number(data.pret),
        kilometraj: data.kilometraj ? Number(data.kilometraj) : null,
        parcurs: data.parcurs ? Number(data.parcurs) : null,
        is_top_offer: isTopOffer,
        is_coming_soon: isComingSoon,
      };

      let result;
      if (isEditing && initialData?.id) {
        result = await supabase
          .from('car_listings')
          .update(carData)
          .eq('id', initialData.id);
      } else {
        result = await supabase
          .from('car_listings')
          .insert([carData]);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: 'Succes',
        description: `Anunțul a fost ${isEditing ? 'actualizat' : 'creat'} cu succes.`,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Eroare',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Editează anunțul' : 'Adaugă anunț nou'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Informații de bază</TabsTrigger>
              <TabsTrigger value="details">Detalii tehnice</TabsTrigger>
              <TabsTrigger value="descriptions">Descrieri</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="settings">Setări</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="marca">Marca *</Label>
                  <Select 
                    onValueChange={(value) => setValue('marca', value)}
                    defaultValue={watch('marca')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează marca" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50 max-h-60 overflow-y-auto">
                      <SelectItem value="Audi">Audi</SelectItem>
                      <SelectItem value="BMW">BMW</SelectItem>
                      <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                      <SelectItem value="Citroën">Citroën</SelectItem>
                      <SelectItem value="Dacia">Dacia</SelectItem>
                      <SelectItem value="DS Automobiles">DS Automobiles</SelectItem>
                      <SelectItem value="Ford">Ford</SelectItem>
                      <SelectItem value="Haval">Haval</SelectItem>
                      <SelectItem value="Honda">Honda</SelectItem>
                      <SelectItem value="Hyundai">Hyundai</SelectItem>
                      <SelectItem value="Infiniti">Infiniti</SelectItem>
                      <SelectItem value="Jaguar">Jaguar</SelectItem>
                      <SelectItem value="Kia">Kia</SelectItem>
                      <SelectItem value="Land Rover">Land Rover</SelectItem>
                      <SelectItem value="Lexus">Lexus</SelectItem>
                      <SelectItem value="Mazda">Mazda</SelectItem>
                      <SelectItem value="Mercedes‑Benz">Mercedes‑Benz</SelectItem>
                      <SelectItem value="Mitsubishi">Mitsubishi</SelectItem>
                      <SelectItem value="Nissan">Nissan</SelectItem>
                      <SelectItem value="Opel">Opel</SelectItem>
                      <SelectItem value="Peugeot">Peugeot</SelectItem>
                      <SelectItem value="Porsche">Porsche</SelectItem>
                      <SelectItem value="Renault">Renault</SelectItem>
                      <SelectItem value="Seat">Seat</SelectItem>
                      <SelectItem value="Skoda">Skoda</SelectItem>
                      <SelectItem value="Subaru">Subaru</SelectItem>
                      <SelectItem value="Toyota">Toyota</SelectItem>
                      <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                      <SelectItem value="Volvo">Volvo</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.marca && (
                    <span className="text-sm text-destructive">{errors.marca.message}</span>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    {...register('model', { required: 'Modelul este obligatoriu' })}
                    placeholder="ex: X5, E-Class, A4"
                  />
                  {errors.model && (
                    <span className="text-sm text-destructive">{errors.model.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="an_fabricatie">An fabricație *</Label>
                  <Input
                    id="an_fabricatie"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    {...register('an_fabricatie', { 
                      required: 'Anul este obligatoriu',
                      min: { value: 1900, message: 'Anul trebuie să fie valid' }
                    })}
                  />
                  {errors.an_fabricatie && (
                    <span className="text-sm text-destructive">{errors.an_fabricatie.message}</span>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="kilometraj">Kilometraj</Label>
                  <Input
                    id="kilometraj"
                    type="number"
                    min="0"
                    {...register('kilometraj')}
                    placeholder="km"
                  />
                </div>
                
                <div>
                  <Label htmlFor="parcurs">Parcurs</Label>
                  <Input
                    id="parcurs"
                    type="number"
                    min="0"
                    {...register('parcurs')}
                    placeholder="km"
                  />
                </div>
                
                <div>
                  <Label htmlFor="pret">Preț (EUR) *</Label>
                  <Input
                    id="pret"
                    type="number"
                    min="0"
                    {...register('pret', { required: 'Prețul este obligatoriu' })}
                  />
                  {errors.pret && (
                    <span className="text-sm text-destructive">{errors.pret.message}</span>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tip_motor">Tip motor *</Label>
                  <Select 
                    onValueChange={(value) => setValue('tip_motor', value)}
                    defaultValue={watch('tip_motor')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează tipul motorului" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Benzină">Benzină</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Gaz / Benzină (propan)">Gaz / Benzină (propan)</SelectItem>
                      <SelectItem value="Gaz / Benzină (metan)">Gaz / Benzină (metan)</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Plug-In Hybrid">Plug-In Hybrid</SelectItem>
                      <SelectItem value="Diesel-Hybrid">Diesel-Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="cutie_viteze">Cutie de viteze *</Label>
                  <Select 
                    onValueChange={(value) => setValue('cutie_viteze', value)}
                    defaultValue={watch('cutie_viteze')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează cutia de viteze" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manuala">Manuală</SelectItem>
                      <SelectItem value="automata">Automată</SelectItem>
                      <SelectItem value="cvt">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tractiune">Tracțiune</Label>
                  <Select onValueChange={(value) => setValue('tractiune', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează tracțiunea" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fata">Față</SelectItem>
                      <SelectItem value="spate">Spate</SelectItem>
                      <SelectItem value="integrala">Integrală (4x4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="caroserie">Caroserie</Label>
                  <Select 
                    onValueChange={(value) => setValue('caroserie', value)}
                    defaultValue={watch('caroserie')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează tipul de caroserie" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="crossover">Crossover</SelectItem>
                      <SelectItem value="combi">Combi/Station Wagon</SelectItem>
                      <SelectItem value="coupe">Coupe</SelectItem>
                      <SelectItem value="cabriolet">Cabriolet</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="minivan">Minivan</SelectItem>
                      <SelectItem value="monovolum">Monovolum</SelectItem>
                      <SelectItem value="roadster">Roadster</SelectItem>
                      <SelectItem value="limuzina">Limuzină</SelectItem>
                      <SelectItem value="microbus">Microbus</SelectItem>
                      <SelectItem value="furgoneta">Furgoneta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacitate_motor">Capacitate motor</Label>
                  <Input
                    id="capacitate_motor"
                    {...register('capacitate_motor')}
                    placeholder="ex: 2.0L, 1.8L TSI, 3.0L V6"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  onValueChange={(value) => setValue('status', value)}
                  defaultValue={watch('status')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează statusul" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activ</SelectItem>
                    <SelectItem value="inactive">Inactiv</SelectItem>
                    <SelectItem value="sold">Vândut</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="descriptions" className="space-y-4">
              <div>
                <Label htmlFor="descriere">Descriere generală</Label>
                <Textarea
                  id="descriere"
                  {...register('descriere')}
                  placeholder="Descrierea generală a vehiculului..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="descriere_ro">Descriere română</Label>
                <Textarea
                  id="descriere_ro"
                  {...register('descriere_ro')}
                  placeholder="Descrierea în română..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="descriere_ru">Descriere rusă</Label>
                <Textarea
                  id="descriere_ru"
                  {...register('descriere_ru')}
                  placeholder="Описание на русском языке..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="descriere_en">Descriere engleză</Label>
                <Textarea
                  id="descriere_en"
                  {...register('descriere_en')}
                  placeholder="Description in English..."
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <div>
                <Label htmlFor="images">Imagini</Label>
                <div className="mt-2">
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImages}
                  />
                  {isUploadingImages && (
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Se încarcă imaginile...
                    </div>
                  )}
                </div>
                
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Trage și mută pentru a reordona imaginile. Prima imagine va fi imaginea principală.
                      </span>
                    </div>
                    
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="images" direction="vertical">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="space-y-3"
                          >
                            {uploadedImages.map((imageUrl, index) => (
                              <Draggable key={`image-${imageUrl}-${index}`} draggableId={`image-${imageUrl}-${index}`} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`relative group rounded-md border p-3 bg-background ${
                                      snapshot.isDragging ? 'border-auto-green bg-auto-green/10 shadow-lg' : 'border-border'
                                    } transition-all duration-200`}
                                  >
                                    <div className="flex items-center gap-4">
                                      <div
                                        {...provided.dragHandleProps}
                                        className="flex-shrink-0 cursor-grab active:cursor-grabbing p-2 rounded hover:bg-muted/50 transition-colors"
                                      >
                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                      </div>
                                      
                                      <div className="relative flex-shrink-0">
                                        <img
                                          src={imageUrl}
                                          alt={`Preview ${index + 1}`}
                                          className="w-20 h-20 object-cover rounded-md border"
                                        />
                                        {index === 0 && (
                                          <div className="absolute -top-2 -left-2 bg-auto-green text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                            <Star className="h-3 w-3" />
                                            Principală
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">Imagine {index + 1}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {index === 0 ? 'Aceasta va fi imaginea principală' : 'Imagine secundară'}
                                        </p>
                                      </div>
                                      
                                      <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="flex-shrink-0 bg-destructive text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/80"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="video_url">Video prezentare</Label>
                <div className="space-y-2">
                  <Input
                    id="video_url"
                    {...register('video_url')}
                    placeholder="Link video (YouTube, Vimeo, TikTok) sau încarcă fișier MP4"
                  />
                  <div className="text-xs text-muted-foreground">
                    Poți adăuga un link către video de pe YouTube/Vimeo/TikTok sau încărca un fișier MP4 direct.
                  </div>
                  <Input
                    type="file"
                    accept="video/mp4"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const fileExt = file.name.split('.').pop();
                          const fileName = `video_${Math.random()}.${fileExt}`;
                          const { data, error } = await supabase.storage
                            .from('car-images')
                            .upload(fileName, file);
                          
                          if (error) throw error;
                          
                          const { data: { publicUrl } } = supabase.storage
                            .from('car-images')
                            .getPublicUrl(fileName);
                          
                          setValue('video_url', publicUrl);
                          toast({
                            title: 'Succes',
                            description: 'Video încărcat cu succes.',
                          });
                        } catch (error: any) {
                          toast({
                            title: 'Eroare',
                            description: 'Eroare la încărcarea video-ului.',
                            variant: 'destructive',
                          });
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="border-auto-green/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-auto-green">
                    <Star className="h-5 w-5" />
                    Top Oferte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="top-offer" className="text-base font-medium">
                        Afișează ca Top Ofertă pe pagina principală
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Când este activat, această mașină va apărea în secțiunea "Top Oferte" de pe homepage.
                      </p>
                    </div>
                    <Switch
                      id="top-offer"
                      checked={isTopOffer}
                      onCheckedChange={setIsTopOffer}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Star className="h-5 w-5" />
                    În Curând
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="coming-soon" className="text-base font-medium">
                        Afișează în secțiunea "În Curând"
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Când este activat, această mașină va apărea în secțiunea "În Curând" de pe homepage pentru mașinile care urmează să fie importate.
                      </p>
                    </div>
                    <Switch
                      id="coming-soon"
                      checked={isComingSoon}
                      onCheckedChange={setIsComingSoon}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Anulează
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Actualizează' : 'Creează'} anunțul
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}