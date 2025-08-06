import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import { CarListingForm } from '@/components/Admin/CarListingForm';
import { Import999Listings } from '@/components/Admin/Import999Listings';
import { TopOffersManager } from '@/components/Admin/TopOffersManager';
import { TestDriveManager } from '@/components/Admin/TestDriveManager';
import { NotificationBell } from '@/components/Admin/NotificationBell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  RefreshCw 
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
  const { toast } = useToast();

  useEffect(() => {
    fetchCarListings();
  }, []);

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

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Panou Admin Direct Auto</h2>
            <p className="text-muted-foreground">
              Administrează catalogul de mașini și importă anunțuri noi
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Adaugă anunț nou
            </Button>
          </div>
        </div>

        {/* Tabs pentru diferite secțiuni */}
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="listings">Anunțuri</TabsTrigger>
            <TabsTrigger value="import">Import 999.md</TabsTrigger>
            <TabsTrigger value="offers">Oferte Speciale</TabsTrigger>
            <TabsTrigger value="testdrive">Test Drive</TabsTrigger>
            <TabsTrigger value="stats">Statistici</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtre și Căutare
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Caută după marcă sau model..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrează după status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toate statusurile</SelectItem>
                      <SelectItem value="active">Activ</SelectItem>
                      <SelectItem value="inactive">Inactiv</SelectItem>
                      <SelectItem value="sold">Vândut</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" onClick={fetchCarListings} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Reîmprospătează
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagine</TableHead>
                      <TableHead>Marcă / Model</TableHead>
                      <TableHead>An</TableHead>
                      <TableHead>Preț</TableHead>
                      <TableHead>Status</TableHead>
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
                          <TableCell>
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
                            <div className="flex flex-col">
                              <div className="font-medium">{car.marca} {car.model}</div>
                              {getDisplayBadge(car)}
                            </div>
                          </TableCell>
                          <TableCell>{car.an_fabricatie}</TableCell>
                          <TableCell className="font-medium">
                            {car.pret.toLocaleString()} EUR
                          </TableCell>
                          <TableCell>{getStatusBadge(car.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingCar(car)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleStatus(car.id, car.status)}
                              >
                                {car.status === 'active' ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCloneCar(car)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import">
            <Import999Listings />
          </TabsContent>

          <TabsContent value="offers">
            <TopOffersManager />
          </TabsContent>

          <TabsContent value="testdrive">
            <TestDriveManager />
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