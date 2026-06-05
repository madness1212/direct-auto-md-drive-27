import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import { CarListingForm } from '@/components/Admin/CarListingForm';
import { Import999Listings } from '@/components/Admin/Import999Listings';
import { Sync999Listings } from '@/components/Admin/Sync999Listings';
import { TopOffersManager } from '@/components/Admin/TopOffersManager';
import { TestDriveManager } from '@/components/Admin/TestDriveManager';
import { NotificationBell } from '@/components/Admin/NotificationBell';
import { MobileAdminNav } from '@/components/Admin/MobileAdminNav';
import { ContractGenerator } from '@/components/Admin/ContractGenerator';
import { ContractsManager } from '@/components/Admin/ContractsManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Copy,
  Filter,
  RefreshCw,
  FileText,
  Info
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CarListing {
  id: string;
  marca: string;
  model: string;
  an_fabricatie: number;
  pret: number;
  status: string;
  images: string[];
  created_at: string;
  is_top_offer: boolean;
  is_coming_soon: boolean;
}

export default function Admin() {
  const [carListings, setCarListings] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<CarListing | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('listings');
  const [pendingTestDrives, setPendingTestDrives] = useState(0);
  const [showContractGenerator, setShowContractGenerator] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCarListings();
    fetchPendingTestDrives();
  }, []);

  const fetchPendingTestDrives = async () => {
    try {
      const { data, error } = await supabase
        .from('test_drive_requests')
        .select('id')
        .eq('status', 'pending');

      if (error) throw error;
      setPendingTestDrives(data?.length || 0);
    } catch (error: any) {
      console.error('Error fetching pending test drives:', error);
    }
  };

  const fetchCarListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('car_listings')
        .select('*')
        .order('status', { ascending: true }) // sold cars (vandut) go to bottom
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCarListings(data || []);
    } catch (error: any) {
      toast({
        title: 'Eroare la încărcarea datelor',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = carListings.filter((listing) => {
    const matchesSearch = `${listing.marca} ${listing.model}`.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('car_listings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state immediately
      setCarListings(prev => prev.filter(car => car.id !== id));

      toast({
        title: 'Anunțul a fost șters',
        description: 'Anunțul a fost șters cu succes din baza de date.',
      });
      
      // Also refresh from server to ensure consistency
      fetchCarListings();
    } catch (error: any) {
      toast({
        title: 'Eroare la ștergere',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (id: string, newStatus: string) => {
    
    try {
      const { error } = await supabase
        .from('car_listings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Status actualizat',
        description: `Anunțul a fost ${newStatus === 'active' ? 'activat' : 'dezactivat'}.`,
      });
      fetchCarListings();
    } catch (error: any) {
      toast({
        title: 'Eroare la actualizarea statusului',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleCloneCar = async (car: CarListing) => {
    try {
      const { id, created_at, ...carData } = car;
      const clonedCar = {
        ...carData,
        marca: `${carData.marca} (Copie)`,
        status: 'inactive',
        tip_motor: 'benzina', // default values pentru câmpurile obligatorii
        cutie_viteze: 'manuala',
      };

      const { error } = await supabase
        .from('car_listings')
        .insert([clonedCar]);

      if (error) throw error;

      toast({
        title: 'Anunț clonat',
        description: 'Anunțul a fost clonat cu succes. Poți să-l editezi acum.',
      });
      fetchCarListings();
    } catch (error: any) {
      toast({
        title: 'Eroare la clonare',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Activ</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactiv</Badge>;
      case 'sold':
        return <Badge variant="destructive">Vândut</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCarCategory = (car: CarListing) => {
    const categories = [];
    if (car.is_top_offer) categories.push('Oferte Speciale');
    if (car.is_coming_soon) categories.push('În Curând');
    return categories.length > 0 ? ' - ' + categories.join(', ') : '';
  };

  const getDisplayBadge = (car: CarListing) => {
    if (car.is_top_offer) {
      return <Badge className="bg-green-500 text-white ml-2">Afișare: Oferte Speciale</Badge>;
    }
    if (car.is_coming_soon) {
      return <Badge className="bg-blue-500 text-white ml-2">Afișare: În Curând</Badge>;
    }
    return null;
  };

  const handleNotificationClick = (type: string, relatedId: string) => {
    if (type === 'test_drive_request') {
      setActiveTab('testdrive');
    }
  };

  if (showForm || editingCar) {
    return (
      <AdminLayout>
        <CarListingForm
          onSuccess={() => {
            setShowForm(false);
            setEditingCar(null);
            fetchCarListings();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingCar(null);
          }}
          initialData={editingCar}
          isEditing={!!editingCar}
        />
      </AdminLayout>
    );
  }

  if (showContractGenerator) {
    return (
      <AdminLayout>
        <ContractGenerator
          onClose={() => setShowContractGenerator(false)}
          onContractGenerated={() => {
            setShowContractGenerator(false);
            fetchCarListings();
          }}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <MobileAdminNav 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddNew={() => setShowForm(true)}
        onGenerateContract={() => setShowContractGenerator(true)}
        pendingTestDrives={pendingTestDrives}
      />
      
      <div className="space-y-6">
        {/* Header - Hidden on mobile */}
        <div className="hidden lg:flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Panou Admin Direct Auto</h2>
            <p className="text-muted-foreground">
              Administrează catalogul de mașini și importă anunțuri noi
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell onNotificationClick={handleNotificationClick} />
            <Button 
              onClick={() => setShowContractGenerator(true)} 
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generează Contract
            </Button>
            <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Adaugă anunț nou
            </Button>
          </div>
        </div>

        {/* Tabs pentru diferite secțiuni */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 gap-1">
            <TabsTrigger value="listings" className="text-xs lg:text-sm">
              <span className="lg:hidden">Anunțuri</span>
              <span className="hidden lg:inline">Anunțuri</span>
            </TabsTrigger>
            <TabsTrigger value="sync999" className="text-xs lg:text-sm hidden lg:flex">
              Sincronizare 999
            </TabsTrigger>
            <TabsTrigger value="import" className="text-xs lg:text-sm hidden lg:flex">
              Import 999.md
            </TabsTrigger>
            <TabsTrigger value="offers" className="text-xs lg:text-sm">
              <span className="lg:hidden">Oferte</span>
              <span className="hidden lg:inline">Oferte Speciale</span>
            </TabsTrigger>
            <TabsTrigger value="testdrive" className="text-xs lg:text-sm">
              <span className="lg:hidden">Test Drive</span>
              <span className="hidden lg:inline">Test Drive</span>
            </TabsTrigger>
            <TabsTrigger value="contracts" className="text-xs lg:text-sm">
              <span className="lg:hidden">Contracte</span>
              <span className="hidden lg:inline">Contracte</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs lg:text-sm hidden lg:flex">
              Statistici
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6">
            {/* Filters - Mobile Optimized */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg lg:text-xl">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtre și Căutare
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Caută după marcă sau model..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12 lg:h-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full lg:w-[180px] h-12 lg:h-10">
                      <SelectValue placeholder="Filtrează după status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toate statusurile</SelectItem>
                      <SelectItem value="active">Activ</SelectItem>
                      <SelectItem value="inactive">Inactiv</SelectItem>
                      <SelectItem value="sold">Vândut</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    onClick={fetchCarListings} 
                    disabled={loading}
                    className="h-12 lg:h-10"
                  >
                    <RefreshCw className={`h-4 w-4 lg:mr-2 ${loading ? 'animate-spin' : ''}`} />
                    <span className="hidden lg:inline">Reîmprospătează</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Listings Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Lista Anunțurilor ({filteredListings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden sm:table-cell">Imagine</TableHead>
                        <TableHead>Marcă / Model</TableHead>
                        <TableHead className="hidden lg:table-cell">An</TableHead>
                        <TableHead>Preț</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead>Acțiuni</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Se încarcă...
                        </TableCell>
                      </TableRow>
                    ) : filteredListings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Nu au fost găsite anunțuri
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredListings.map((car) => (
                        <TableRow key={car.id}>
                          <TableCell className="hidden sm:table-cell">
                            {car.images && car.images.length > 0 ? (
                              <img
                                src={car.images[0]}
                                alt={`${car.marca} ${car.model}`}
                                className="w-16 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">Fără imagine</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <div className="font-medium text-sm lg:text-base">{car.marca} {car.model}</div>
                              <div className="lg:hidden text-xs text-muted-foreground">
                                {car.an_fabricatie} • {car.pret.toLocaleString()} EUR
                              </div>
                              <div className="md:hidden">{getStatusBadge(car.status)}</div>
                              {getDisplayBadge(car)}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{car.an_fabricatie}</TableCell>
                          <TableCell className="font-medium hidden lg:table-cell">
                            {car.pret.toLocaleString()} EUR
                          </TableCell>
                           <TableCell className="hidden md:table-cell">{getStatusBadge(car.status)}</TableCell>
                           <TableCell>
                             <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => setEditingCar(car)}
                                 className="w-full lg:w-20 h-10 text-sm font-medium"
                               >
                                 <Edit className="h-4 w-4 lg:mr-1" />
                                 <span className="lg:inline">Editare</span>
                               </Button>
                               
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full lg:w-20 h-10 text-sm font-medium"
                                    >
                                      <Info className="h-4 w-4 lg:mr-1" />
                                      <span className="lg:inline">Info</span>
                                    </Button>
                                  </DialogTrigger>
                                 <DialogContent className="max-w-2xl">
                                   <DialogHeader>
                                     <DialogTitle>Informații complete - {car.marca} {car.model}</DialogTitle>
                                   </DialogHeader>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                     <div className="space-y-2">
                                       <h4 className="font-semibold text-sm">Informații de bază</h4>
                                       <div className="text-sm space-y-1">
                                         <p><span className="font-medium">Marcă:</span> {car.marca}</p>
                                         <p><span className="font-medium">Model:</span> {car.model}</p>
                                         <p><span className="font-medium">An fabricație:</span> {car.an_fabricatie}</p>
                                         <p><span className="font-medium">Preț afișat:</span> {car.pret?.toLocaleString()} EUR</p>
                                         <p><span className="font-medium">Status:</span> {car.status}</p>
                                       </div>
                                     </div>
                                     
                                     <div className="space-y-2">
                                       <h4 className="font-semibold text-sm">Informații pentru contracte</h4>
                                       <div className="text-sm space-y-1">
                                         <p><span className="font-medium">VIN:</span> {(car as any).vin || 'Nu este specificat'}</p>
                                         <p><span className="font-medium">Culoare:</span> {(car as any).culoare || 'Nu este specificată'}</p>
                                         <p><span className="font-medium">Categoria vehicului:</span> {(car as any).categoria_vehicului || 'Nu este specificată'}</p>
                                         <p><span className="font-medium">Greutatea mașinii:</span> {(car as any).greutatea_masinii ? `${(car as any).greutatea_masinii} kg` : 'Nu este specificată'}</p>
                                         <p><span className="font-medium">Sarcina încărcată:</span> {(car as any).sarcina_incarcata ? `${(car as any).sarcina_incarcata} kg` : 'Nu este specificată'}</p>
                                         <p><span className="font-medium">Preț total contract:</span> {(car as any).pret_total ? `${(car as any).pret_total?.toLocaleString()} EUR` : 'Nu este specificat'}</p>
                                         <p><span className="font-medium">Preț în cuvinte:</span> {(car as any).pret_in_cuvinte || 'Se va genera automat'}</p>
                                       </div>
                                     </div>
                                   </div>
                                 </DialogContent>
                               </Dialog>
                               
                               <Select value={car.status} onValueChange={(newStatus) => handleToggleStatus(car.id, newStatus)}>
                                 <SelectTrigger className="min-h-12 min-w-20 lg:min-h-8 lg:min-w-24 text-xs">
                                   <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="active">Activ</SelectItem>
                                   <SelectItem value="inactive">Inactiv</SelectItem>
                                   <SelectItem value="sold">Vândut</SelectItem>
                                 </SelectContent>
                               </Select>
                               
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleCloneCar(car)}
                                 className="min-h-12 min-w-12 lg:min-h-8 lg:min-w-auto"
                               >
                                 <Copy className="h-4 w-4" />
                               </Button>
                               
                               <AlertDialog>
                                 <AlertDialogTrigger asChild>
                                   <Button 
                                     variant="outline" 
                                     size="sm"
                                     className="min-h-12 min-w-12 lg:min-h-8 lg:min-w-auto"
                                   >
                                     <Trash2 className="h-4 w-4" />
                                   </Button>
                                 </AlertDialogTrigger>
                                 <AlertDialogContent>
                                   <AlertDialogHeader>
                                     <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                                     <AlertDialogDescription>
                                       Ești sigur că vrei să ștergi anunțul pentru {car.marca} {car.model}? 
                                       Această acțiune nu poate fi anulată.
                                     </AlertDialogDescription>
                                   </AlertDialogHeader>
                                   <AlertDialogFooter>
                                     <AlertDialogCancel>Anulează</AlertDialogCancel>
                                     <AlertDialogAction 
                                       onClick={() => handleDelete(car.id)}
                                       className="bg-destructive hover:bg-destructive/90"
                                     >
                                       Șterge
                                     </AlertDialogAction>
                                   </AlertDialogFooter>
                                 </AlertDialogContent>
                               </AlertDialog>
                             </div>
                           </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import">
            <Import999Listings />
          </TabsContent>

          <TabsContent value="sync999">
            <Sync999Listings />
          </TabsContent>


          <TabsContent value="offers">
            <TopOffersManager />
          </TabsContent>

          <TabsContent value="testdrive">
            <TestDriveManager />
          </TabsContent>

          <TabsContent value="contracts">
            <ContractsManager />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{carListings.length}</div>
                  <p className="text-xs text-muted-foreground">Total anunțuri</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-600">
                    {carListings.filter(car => car.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Anunțuri active</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-yellow-600">
                    {carListings.filter(car => car.status === 'inactive').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Anunțuri inactive</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-red-600">
                    {carListings.filter(car => car.status === 'sold').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Mașini vândute</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}