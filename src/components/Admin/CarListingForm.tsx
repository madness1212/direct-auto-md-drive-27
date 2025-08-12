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
  tip_motor: string;
  cutie_viteze: string;
  tractiune?: string;
  pret: number;
  is_price_negotiable?: boolean;
  caroserie?: string;
  capacitate_motor?: string;
  putere?: string;
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

const modelsByBrand: { [key: string]: string[] } = {
  "Audi": [
    "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8",
    "TT", "R8", "e-tron", "allroad", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8",
    "SQ2", "SQ5", "SQ7", "RS3", "RS4", "RS5", "RS6", "RS7", "RS Q3", "RS Q8", "100", "80", "90"
  ],
  "BMW": [
    "Seria 1", "Seria 2", "Seria 3", "Seria 4", "Seria 5", "Seria 6", "Seria 7", "Seria 8",
    "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "M2", "M3", "M4", "M5", "M6", "M8",
    "X3 M", "X4 M", "X5 M", "X6 M", "i3", "i4", "i8", "iX", "iX1", "iX3", "3 Compact", "5 Compact"
  ],
  "Chevrolet": [
    "Aveo", "Camaro", "Captiva", "Cobalt", "Corvette", "Cruze", "Epica", "Evanda", "Lacetti",
    "Malibu", "Nubira", "Orlando", "Rezzo", "Spark", "Tacuma", "Trailblazer", "Trax", "Blazer"
  ],
  "Citroën": [
    "Berlingo", "C1", "C2", "C3", "C3 Aircross", "C3 Picasso", "C4", "C4 Aircross", "C4 Cactus",
    "C4 Picasso", "C5", "C5 Aircross", "C6", "C8", "DS3", "DS4", "DS5", "Jumper", "Jumpy", "Nemo", 
    "SpaceTourer", "Xantia", "Xsara", "Saxo", "BX", "AX", "XM"
  ],
  "Dacia": [
    "1300", "1310", "Duster", "Lodgy", "Logan", "Sandero", "Solenza", "Spring",
    "Nova", "SuperNova", "1307", "1410"
  ],
  "DS Automobiles": [
    "DS 3", "DS 3 Crossback", "DS 4", "DS 4 Crossback", "DS 5", "DS 7 Crossback", "DS 9"
  ],
  "Ford": [
    "B-MAX", "C-MAX", "EcoSport", "Edge", "Escape", "Escort", "Fiesta", "Focus", "Fusion",
    "Galaxy", "Grand C-MAX", "KA", "Kuga", "Mondeo", "Mustang", "Puma", "Ranger", "S-MAX",
    "Tourneo Connect", "Tourneo Courier", "Tourneo Custom", "Probe", "Sierra", "Scorpio"
  ],
  "Haval": [
    "F7", "H2", "H6", "H9", "Jolion", "M6"
  ],
  "Honda": [
    "Accord", "Civic", "CR-V", "CR-Z", "FR-V", "HR-V", "Insight", "Jazz", "Legend", "Prelude"
  ],
  "Hyundai": [
    "Accent", "Atos", "Bayon", "Creta", "Elantra", "Genesis", "Getz", "Grand i10", "i10", "i20",
    "i30", "i40", "Ioniq", "Ioniq 5", "Ioniq 6", "Kona", "Santa Fe", "Sonata", "Tucson", "Veloster",
    "Terracan", "Matrix"
  ],
  "Infiniti": [
    "EX", "FX", "G", "M", "Q30", "Q50", "Q60", "Q70", "QX30", "QX50", "QX55", "QX70", "QX80"
  ],
  "Jaguar": [
    "E-PACE", "F-PACE", "F-TYPE", "I-PACE", "S-TYPE", "XF", "XJ", "XK", "X-TYPE", "X-Type"
  ],
  "Kia": [
    "Carnival", "Carens", "Ceed", "Cerato", "Magentis", "Niro", "Optima", "Picanto", "ProCeed",
    "Rio", "Sedona", "Sorento", "Soul", "Sportage", "Stinger", "Xceed", "Shuma", "Clarus"
  ],
  "Land Rover": [
    "Defender", "Discovery", "Discovery Sport", "Freelander", "Range Rover", "Range Rover Evoque",
    "Range Rover Sport", "Range Rover Velar"
  ],
  "Lexus": [
    "CT", "ES", "GS", "IS", "LC", "LS", "LX", "NX", "RC", "RX", "UX", "HS"
  ],
  "Mazda": [
    "2", "3", "5", "6", "CX-3", "CX-30", "CX-5", "CX-7", "CX-9", "MX-5", "RX-7", "RX-8", "323", "626", "Xedos 6"
  ],
  "Mercedes-Benz": [
    "Clasa A", "Clasa B", "Clasa C", "Clasa CLA", "Clasa CLC", "Clasa CLK", "Clasa CLS",
    "Clasa E", "Clasa G", "Clasa GL", "Clasa GLA", "Clasa GLB", "Clasa GLC", "Clasa GLE",
    "Clasa GLK", "Clasa GLS", "Clasa M", "Clasa R", "Clasa S", "Clasa SL", "Clasa SLC",
    "Clasa SLK", "Clasa V", "Clasa Vito", "Clasa X", "AMG GT", "EQC", "EQE", "EQS", "Maybach",
    "190", "W124", "W140", "W201", "W202", "W203", "W204", "W210", "W211", "W212", "W220", "W221"
  ],
  "Mitsubishi": [
    "ASX", "Carisma", "Colt", "Eclipse", "Eclipse Cross", "Galant", "Grandis", "L200",
    "Lancer", "Lancer Evolution", "Mirage", "Outlander", "Outlander PHEV", "Pajero", "Space Star",
    "Space Wagon", "L300", "Sigma"
  ],
  "Nissan": [
    "350Z", "370Z", "Almera", "Altima", "Cube", "GT-R", "Juke", "Leaf", "Maxima", "Micra",
    "Murano", "Navara", "Note", "NP300", "Pathfinder", "Patrol", "Primera", "Qashqai", "Serena",
    "Sunny", "Terrano", "Tiida", "X-Trail", "Almera Tino", "Bluebird"
  ],
  "Opel": [
    "Adam", "Agila", "Antara", "Astra", "Calibra", "Combo", "Corsa", "Crossland", "Grandland",
    "Insignia", "Karl", "Meriva", "Mokka", "Movano", "Omega", "Signum", "Tigra", "Vectra", "Zafira",
    "Ascona", "Kadett", "Senator", "Monza"
  ],
  "Peugeot": [
    "107", "108", "2008", "206", "207", "208", "3008", "306", "307", "308", "405", "406", "407",
    "508", "5008", "Partner", "Rifter", "Traveller", "205", "605", "806", "807", "1007", "4007", "4008"
  ],
  "Porsche": [
    "911", "Boxster", "Cayenne", "Cayman", "Macan", "Panamera", "Taycan", "924", "928", "944", "968"
  ],
  "Renault": [
    "19", "21", "Captive", "Clio", "Duster", "Fluence", "Kadjar", "Kangoo", "Koleos", "Laguna",
    "Latitude", "Logan", "Master", "Mégane", "Modus", "Scénic", "Symbol", "Taliant", "Twingo",
    "Zoe", "12", "9", "18", "25", "Fuego", "Safrane"
  ],
  "SEAT": [
    "Alhambra", "Altea", "Arona", "Ateca", "Cordoba", "Exeo", "Ibiza", "Leon", "Mii", "Toledo",
    "Marbella", "Malaga", "Ronda"
  ],
  "Škoda": [
    "Citigo", "Enyaq", "Fabia", "Felicia", "Kamiq", "Karoq", "Kodiaq", "Octavia", "Praktik",
    "Rapid", "Roomster", "Scala", "Superb", "Yeti", "100", "110", "120", "130", "Favorit"
  ],
  "Subaru": [
    "Forester", "Impreza", "Legacy", "Outback", "Tribeca", "XV", "Justy", "Alcyone"
  ],
  "Toyota": [
    "Auris", "Avensis", "Aygo", "C-HR", "Camry", "Corolla", "Corolla Verso", "GT86", "Highlander",
    "Hilux", "Land Cruiser", "Prius", "RAV4", "Urban Cruiser", "Verso", "Yaris", "Carina", "Carina E",
    "Celica", "Corona", "Starlet"
  ],
  "Volkswagen": [
    "Amarok", "Arteon", "Beetle", "Bora", "Caddy", "CC", "Cross Polo", "Eos", "Fox", "Golf",
    "ID.3", "ID.4", "ID.5", "Jetta", "Lupo", "Multivan", "Passat", "Phaeton", "Polo", "Scirocco",
    "Sharan", "T-Cross", "T-Roc", "Tiguan", "Touareg", "Touran", "Up", "Golf Plus", "Golf Variant",
    "Vento", "Santana", "Derby", "Iltis"
  ],
  "Volvo": [
    "C30", "C70", "S40", "S60", "S80", "S90", "V40", "V50", "V60", "V70", "V90", "XC40", "XC60",
    "XC90", "850", "940", "960", "240", "740", "760", "440", "460"
  ]
};

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
      is_price_negotiable: initialData?.is_price_negotiable || false,
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
        images_order: uploadedImages.map((_, index) => index),
        created_by: user.id,
        an_fabricatie: Number(data.an_fabricatie),
        pret: Number(data.pret),
        kilometraj: data.kilometraj ? Number(data.kilometraj) : null,
        is_top_offer: isTopOffer,
        is_coming_soon: isComingSoon,
        is_price_negotiable: data.is_price_negotiable || false,
      };

      let result: any;

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
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
              <TabsTrigger value="basic" className="text-xs md:text-sm">Info bază</TabsTrigger>
              <TabsTrigger value="details" className="text-xs md:text-sm">Tehnice</TabsTrigger>
              <TabsTrigger value="descriptions" className="text-xs md:text-sm">Descrieri</TabsTrigger>
              <TabsTrigger value="media" className="text-xs md:text-sm">Media</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs md:text-sm">Setări</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                      <SelectItem value="Mitsubishi">Mitsubishi</SelectItem>
                      <SelectItem value="Nissan">Nissan</SelectItem>
                      <SelectItem value="Opel">Opel</SelectItem>
                      <SelectItem value="Peugeot">Peugeot</SelectItem>
                      <SelectItem value="Porsche">Porsche</SelectItem>
                      <SelectItem value="Renault">Renault</SelectItem>
                      <SelectItem value="SEAT">SEAT</SelectItem>
                      <SelectItem value="Škoda">Škoda</SelectItem>
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
                  <Select 
                    onValueChange={(value) => setValue('model', value)}
                    defaultValue={watch('model')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează modelul" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50 max-h-60 overflow-y-auto">
                      {watch('marca') && modelsByBrand[watch('marca')] ? 
                        modelsByBrand[watch('marca')].map((model: string) => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))
                        : <SelectItem value="placeholder" disabled>Selectează mai întâi marca</SelectItem>
                      }
                    </SelectContent>
                  </Select>
                  {errors.model && (
                    <span className="text-sm text-destructive">{errors.model.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <Label htmlFor="pret">Preț (EUR) *</Label>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
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
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_price_negotiable"
                        checked={watch('is_price_negotiable') || false}
                        onCheckedChange={(checked) => setValue('is_price_negotiable', checked)}
                      />
                      <Label htmlFor="is_price_negotiable" className="text-sm">
                        Negociabil
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectItem value="universal">Universal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacitate_motor">Capacitate motor</Label>
                  <Input
                    id="capacitate_motor"
                    {...register('capacitate_motor')}
                    placeholder="ex: 2.0L, 1.8L TSI, 3.0L V6"
                  />
                </div>
                
                <div>
                  <Label htmlFor="putere">Putere (CP)</Label>
                  <Input
                    id="putere"
                    {...register('putere')}
                    placeholder="ex: 150 CP, 200 CP"
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

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
              Anulează
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Actualizează' : 'Creează'} anunțul
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}