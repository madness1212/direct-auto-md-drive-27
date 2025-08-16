import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileText, Download, Car, User, Search } from "lucide-react";

interface Car {
  id: string;
  model: string;
  marca?: string;
  vin?: string;
  an_fabricatie: number;
  culoare?: string;
  caroserie?: string;
  capacitate_motor?: string;
  greutatea_masinii?: number;
  sarcina_incarcata?: number;
  pret?: number;
  pret_total?: number;
  pret_in_cuvinte?: string;
  status: string;
  cutie_viteze?: string;
  kilometraj?: number;
  putere?: string;
  tractiune?: string;
  categoria_vehicului?: string;
}

interface Client {
  id: string;
  nume_cumparator: string;
  nume_prenume_cumparator: string;
  idnp: string;
  adresa: string;
  telefon: string;
}

interface ContractGeneratorProps {
  onClose: () => void;
  onContractGenerated: () => void;
}

export const ContractGenerator = ({ onClose, onContractGenerated }: ContractGeneratorProps) => {
  const [step, setStep] = useState<'template' | 'select' | 'client' | 'generate'>('template');
  const [template, setTemplate] = useState<File | null>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({
    nume_cumparator: '',
    nume_prenume_cumparator: '',
    idnp: '',
    adresa: '',
    telefon: ''
  });
  const [cars, setCars] = useState<Car[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useNewClient, setUseNewClient] = useState(false);
  const [carSearchTerm, setCarSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchCarsAndClients = async () => {
    try {
      const [carsResponse, clientsResponse] = await Promise.all([
        supabase.from('car_listings').select('*').eq('status', 'active'),
        supabase.from('clients').select('*')
      ]);

      if (carsResponse.error) throw carsResponse.error;
      if (clientsResponse.error) throw clientsResponse.error;

      setCars(carsResponse.data || []);
      setClients(clientsResponse.data || []);
    } catch (error) {
      console.error('Eroare la încărcarea datelor:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca datele necesare.",
        variant: "destructive",
      });
    }
  };

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.docx')) {
        toast({
          title: "Format invalid",
          description: "Te rog să încarci un fișier .docx",
          variant: "destructive",
        });
        return;
      }
      setTemplate(file);
      toast({
        title: "Șablon încărcat",
        description: `Fișierul ${file.name} a fost încărcat cu succes.`,
      });
    }
  };

  const proceedToSelection = () => {
    if (!template) {
      toast({
        title: "Șablon lipsă",
        description: "Te rog să încarci mai întâi un șablon DOCX.",
        variant: "destructive",
      });
      return;
    }
    fetchCarsAndClients();
    setStep('select');
  };

  const proceedToClient = () => {
    if (!selectedCar) {
      toast({
        title: "Mașină neselectată",
        description: "Te rog să alegi o mașină.",
        variant: "destructive",
      });
      return;
    }
    setStep('client');
  };

  const generateContract = async () => {
    if (!selectedCar || (!selectedClient && !useNewClient) || !template) {
      toast({
        title: "Date incomplete",
        description: "Te rog să completezi toate datele necesare.",
        variant: "destructive",
      });
      return;
    }

    // Validate new client data if using new client
    if (useNewClient) {
      // Validate IDNP format (13 digits)
      if (!/^[0-9]{13}$/.test(newClient.idnp)) {
        toast({
          title: "IDNP invalid",
          description: "IDNP-ul trebuie să conțină exact 13 cifre.",
          variant: "destructive",
        });
        return;
      }

      // Validate phone format
      if (!/^\+?[0-9\s\-\(\)]+$/.test(newClient.telefon)) {
        toast({
          title: "Telefon invalid",
          description: "Numărul de telefon conține caractere invalide.",
          variant: "destructive",
        });
        return;
      }

      // Validate required fields
      if (!newClient.nume_cumparator || !newClient.nume_prenume_cumparator || !newClient.adresa) {
        toast({
          title: "Date incomplete",
          description: "Te rog să completezi toate câmpurile obligatorii.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      let clientData = selectedClient;
      
      // Dacă folosim client nou, îl salvăm mai întâi cu validare
      if (useNewClient) {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('Nu ești autentificat');
        
        // Validare date client
        if (!newClient.idnp || newClient.idnp.length !== 13 || !/^[0-9]{13}$/.test(newClient.idnp)) {
          throw new Error('IDNP-ul trebuie să conțină exact 13 cifre');
        }
        
        if (!newClient.telefon || !/^\+?[0-9\s\-\(\)]+$/.test(newClient.telefon)) {
          throw new Error('Numărul de telefon are un format invalid');
        }
        
        const { data: newClientData, error } = await supabase
          .from('clients')
          .insert([{ ...newClient, user_id: user.id }])
          .select()
          .single();
        
        if (error) throw error;
        clientData = newClientData;
      }

      // Obținem user-ul curent pentru RLS
      const { data: { user: currentUser }, error: currentAuthError } = await supabase.auth.getUser();
      if (currentAuthError || !currentUser) throw new Error('Nu ești autentificat');

      // Generăm numărul contractului
      const contractNumber = `CT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      // Citim template-ul și populăm datele
      const templateBuffer = await template.arrayBuffer();
      
      // Pregătim datele pentru înlocuire - adăugăm numarContract
      const templateData: Record<string, any> = {
        "data": new Date().toLocaleDateString('ro-RO'),
        "numarContract": contractNumber,
        "numeCumparator": clientData?.nume_cumparator || '',
        "modelMasina": `${selectedCar.marca || ''} ${selectedCar.model || ''}`.trim(),
        "vin": selectedCar.vin || '',
        "anFabricatie": selectedCar.an_fabricatie?.toString() || '',
        "culoare": selectedCar.culoare || '',
        "categoriaVehiculului": selectedCar.caroserie || selectedCar.categoria_vehicului || '',
        "capacitateMotor": selectedCar.capacitate_motor || '',
        "greutateaMasinii": selectedCar.greutatea_masinii?.toString() || '',
        "sarcinaIncarcata": selectedCar.sarcina_incarcata?.toString() || '',
        "pret": selectedCar.pret?.toString() || '',
        "pretTotal": selectedCar.pret_total?.toString() || '',
        "pretInCuvinte": selectedCar.pret_in_cuvinte || '',
        "pret2": selectedCar.pret?.toString() || '',
        "pretInCuvinte2": selectedCar.pret_in_cuvinte || '',
        "numePrenumeCumparator": clientData?.nume_prenume_cumparator || '',
        "idnp": clientData?.idnp || '',
        "adresa": clientData?.adresa || '',
        "tel": clientData?.telefon || '',
        "numePrenume": clientData?.nume_prenume_cumparator || ''
      };

      // Importăm createReport dinamic
      const { createReport } = await import('docx-templates');
      
      // Procesăm template-ul cu delimitatori standard
      const processedDoc = await createReport({
        template: new Uint8Array(templateBuffer),
        data: templateData,
        cmdDelimiter: ['#', '#'],
        noSandbox: false, // Activăm sandbox-ul pentru siguranță
        additionalJsContext: {
          // Adăugăm funcții helper dacă sunt necesare
          formatNumber: (num: number) => num?.toLocaleString() || '0',
          formatDate: (date: string) => new Date(date).toLocaleDateString('ro-RO')
        }
      });

      // Generăm un număr unic pentru fișier (folosim contractNumber)
      const fileNumber = contractNumber;
      
      // Încărcăm template-ul procesat în storage
      const processedFileName = `${currentUser.id}/contracts/${fileNumber}_contract.docx`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('car-documents')
        .upload(processedFileName, new Uint8Array(processedDoc));

      if (uploadError) throw uploadError;

      // Salvăm contractul în baza de date
      const { data: contractData, error: contractError } = await supabase
        .from('contracts')
        .insert([{
          contract_number: contractNumber,
          car_id: selectedCar.id,
          client_id: clientData!.id,
          contract_date: new Date().toISOString().split('T')[0],
          template_path: uploadData.path,
          user_id: currentUser.id
        }])
        .select()
        .single();

      if (contractError) throw contractError;

      // Actualizăm statusul mașinii
      await supabase
        .from('car_listings')
        .update({ status: 'sold' })
        .eq('id', selectedCar.id);

      toast({
        title: "Contract generat",
        description: `Contractul ${contractNumber} a fost generat cu succes.`,
      });

      onContractGenerated();
      onClose();
    } catch (error) {
      console.error('Eroare la generarea contractului:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la generarea contractului.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Activ</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Generator Contracte</h1>
          <p className="text-muted-foreground">
            Creează un contract de vânzare automat
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-8">
        {['template', 'select', 'client', 'generate'].map((s, index) => (
          <div key={s} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step === s ? 'bg-primary text-primary-foreground' : 
                ['template', 'select', 'client', 'generate'].indexOf(step) > index ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}
            `}>
              {index + 1}
            </div>
            {index < 3 && <div className="w-8 h-px bg-muted mx-2" />}
          </div>
        ))}
      </div>

      {/* Step 1: Template Upload */}
      {step === 'template' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Încarcă Șablonul DOCX
            </CardTitle>
            <CardDescription>
              Încarcă un fișier .docx cu tagurile care vor fi înlocuite automat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="template">Șablon Contract (.docx)</Label>
              <div className="flex items-center gap-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx"
                  onChange={handleTemplateUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Alege fișier
                </Button>
                {template && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileText className="h-4 w-4" />
                    {template.name}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Taguri disponibile pentru înlocuire:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>Date mașină:</strong>
                  <ul className="list-disc list-inside text-muted-foreground mt-1">
                    <li>#modelMasina#</li>
                    <li>#vin#</li>
                    <li>#anFabricatie#</li>
                    <li>#culoare#</li>
                    <li>#categoriaVehiculului#</li>
                    <li>#capacitateMotor#</li>
                    <li>#greutateaMasinii#</li>
                    <li>#sarcinaIncarcata#</li>
                    <li>#pret#, #pretTotal#</li>
                    <li>#pretInCuvinte#</li>
                  </ul>
                </div>
                <div>
                  <strong>Date client:</strong>
                  <ul className="list-disc list-inside text-muted-foreground mt-1">
                    <li>#numeCumparator#</li>
                    <li>#numePrenumeCumparator#</li>
                    <li>#idnp#</li>
                    <li>#adresa#</li>
                    <li>#tel#</li>
                  </ul>
                  <strong>Date contract:</strong>
                  <ul className="list-disc list-inside text-muted-foreground mt-1">
                    <li>#data#</li>
                    <li>#numarContract#</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-1">
                    Notă: Numărul contractului se generează automat
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={proceedToSelection} disabled={!template} className="w-full">
              Continuă cu selectarea mașinii
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Car Selection */}
      {step === 'select' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Selectează Mașina
            </CardTitle>
            <CardDescription>
              Alege mașina pentru care vrei să generezi contractul
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută mașini după marcă, model..."
                value={carSearchTerm}
                onChange={(e) => setCarSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {cars.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nu există mașini disponibile pentru contract.
              </p>
            ) : (
              <>
                {(() => {
                  const filteredCars = cars.filter(car => 
                    (car.marca?.toLowerCase().includes(carSearchTerm.toLowerCase()) || false) ||
                    car.model.toLowerCase().includes(carSearchTerm.toLowerCase())
                  );
                  
                  return filteredCars.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nu s-au găsit mașini care să corespundă căutării.
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredCars.map((car) => (
                        <div
                          key={car.id}
                          className={`
                            p-4 border rounded-lg cursor-pointer transition-all
                            ${selectedCar?.id === car.id 
                              ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                              : 'border-muted hover:border-primary/50'
                            }
                          `}
                          onClick={() => setSelectedCar(car)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{car.marca ? `${car.marca} ${car.model}` : car.model}</h3>
                            {getStatusBadge(car.status)}
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>VIN: {car.vin || 'Nu este specificat'}</p>
                            <p>An: {car.an_fabricatie} • {car.culoare || 'Nu este specificată'}</p>
                            <p>Preț: {car.pret_total?.toLocaleString() || car.pret?.toLocaleString()} EUR</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </>
            )}
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('template')}>
                Înapoi
              </Button>
              <Button onClick={proceedToClient} disabled={!selectedCar} className="flex-1">
                Continuă cu clientul
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Client Selection */}
      {step === 'client' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Date Client
            </CardTitle>
            <CardDescription>
              Selectează un client existent sau adaugă unul nou
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Button
                variant={!useNewClient ? "default" : "outline"}
                onClick={() => setUseNewClient(false)}
                className="flex-1"
              >
                Client Existent
              </Button>
              <Button
                variant={useNewClient ? "default" : "outline"}
                onClick={() => setUseNewClient(true)}
                className="flex-1"
              >
                Client Nou
              </Button>
            </div>

            {!useNewClient ? (
              <div className="space-y-4">
                <Label>Selectează client</Label>
                <Select onValueChange={(value) => {
                  const client = clients.find(c => c.id === value);
                  setSelectedClient(client || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alege un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.nume_prenume_cumparator} - {client.nume_cumparator}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedClient && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Date client selectat:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><strong>Nume:</strong> {selectedClient.nume_prenume_cumparator}</p>
                      <p><strong>Cumpărător:</strong> {selectedClient.nume_cumparator}</p>
                      <p><strong>IDNP:</strong> {selectedClient.idnp}</p>
                      <p><strong>Telefon:</strong> {selectedClient.telefon}</p>
                      <p className="col-span-2"><strong>Adresa:</strong> {selectedClient.adresa}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nume_cumparator">Nume Cumpărător</Label>
                  <Input
                    id="nume_cumparator"
                    value={newClient.nume_cumparator}
                    onChange={(e) => setNewClient({...newClient, nume_cumparator: e.target.value})}
                    placeholder="Ex: SC COMPANY SRL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nume_prenume_cumparator">Nume Prenume Cumpărător</Label>
                  <Input
                    id="nume_prenume_cumparator"
                    value={newClient.nume_prenume_cumparator}
                    onChange={(e) => setNewClient({...newClient, nume_prenume_cumparator: e.target.value})}
                    placeholder="Ex: Popescu Ion"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idnp">IDNP</Label>
                  <Input
                    id="idnp"
                    value={newClient.idnp}
                    onChange={(e) => setNewClient({...newClient, idnp: e.target.value})}
                    placeholder="Ex: 2001234567890"
                    maxLength={13}
                    pattern="[0-9]{13}"
                  />
                  <p className="text-xs text-muted-foreground">IDNP trebuie să conțină exact 13 cifre</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefon">Telefon</Label>
                  <Input
                    id="telefon"
                    value={newClient.telefon}
                    onChange={(e) => setNewClient({...newClient, telefon: e.target.value})}
                    placeholder="Ex: +373 60 123 456"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="adresa">Adresa</Label>
                  <Textarea
                    id="adresa"
                    value={newClient.adresa}
                    onChange={(e) => setNewClient({...newClient, adresa: e.target.value})}
                    placeholder="Ex: mun. Chișinău, str. Ștefan cel Mare 1, ap. 1"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('select')}>
                Înapoi
              </Button>
              <Button 
                onClick={() => setStep('generate')} 
                disabled={!selectedClient && (!useNewClient || !newClient.nume_cumparator)}
                className="flex-1"
              >
                Continuă cu generarea
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Generate */}
      {step === 'generate' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generează Contract
            </CardTitle>
            <CardDescription>
              Verifică datele și generează contractul final
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Date Mașină:</h4>
                {selectedCar && (
                  <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-1">
                    <p><strong>Model:</strong> {selectedCar.model}</p>
                    <p><strong>VIN:</strong> {selectedCar.vin || 'Nu este specificat'}</p>
                    <p><strong>An fabricație:</strong> {selectedCar.an_fabricatie}</p>
                    <p><strong>Culoare:</strong> {selectedCar.culoare || 'Nu este specificată'}</p>
                    <p><strong>Tip caroserie:</strong> {selectedCar.caroserie || selectedCar.categoria_vehicului || 'Nu este specificat'}</p>
                    <p><strong>Capacitate motor:</strong> {selectedCar.capacitate_motor || 'Nu este specificată'}</p>
                    <p><strong>Greutate:</strong> {selectedCar.greutatea_masinii ? `${selectedCar.greutatea_masinii} kg` : 'Nu este specificată'}</p>
                    <p><strong>Preț:</strong> {selectedCar.pret_total?.toLocaleString() || selectedCar.pret?.toLocaleString()} EUR</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Date Client:</h4>
                {(selectedClient || useNewClient) && (
                  <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-1">
                    <p><strong>Nume:</strong> {selectedClient?.nume_prenume_cumparator || newClient.nume_prenume_cumparator}</p>
                    <p><strong>Cumpărător:</strong> {selectedClient?.nume_cumparator || newClient.nume_cumparator}</p>
                    <p><strong>IDNP:</strong> {selectedClient?.idnp || newClient.idnp}</p>
                    <p><strong>Telefon:</strong> {selectedClient?.telefon || newClient.telefon}</p>
                    <p><strong>Adresa:</strong> {selectedClient?.adresa || newClient.adresa}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('client')}>
                Înapoi
              </Button>
              <Button 
                onClick={generateContract} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>Generez contractul...</>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generează Contract
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};