import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Euro } from 'lucide-react';

interface CarSale {
  id: string;
  car_id: string;
  sale_price: number;
  sale_date: string;
  payment_method: string;
  notes?: string;
  car_listings?: {
    marca: string;
    model: string;
    an_fabricatie: number;
  };
}

interface CarListing {
  id: string;
  marca: string;
  model: string;
  an_fabricatie: number;
  pret: number;
}

export default function SalesManager() {
  const [sales, setSales] = useState<CarSale[]>([]);
  const [cars, setCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<CarSale | null>(null);
  const [formData, setFormData] = useState({
    car_id: '',
    sale_price: '',
    sale_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    notes: ''
  });

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('car_sales')
        .select(`
          *,
          car_listings!inner(marca, model, an_fabricatie)
        `)
        .order('sale_date', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut încărca vânzările",
        variant: "destructive"
      });
    }
  };

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('car_listings')
        .select('id, marca, model, an_fabricatie, pret')
        .eq('status', 'active')
        .order('marca', { ascending: true });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchCars();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const saleData = {
        car_id: formData.car_id,
        sale_price: parseInt(formData.sale_price),
        sale_date: formData.sale_date,
        payment_method: formData.payment_method,
        notes: formData.notes || null
      };

      if (editingSale) {
        const { error } = await supabase
          .from('car_sales')
          .update(saleData)
          .eq('id', editingSale.id);
        
        if (error) throw error;
        
        toast({
          title: "Succes",
          description: "Vânzarea a fost actualizată cu succes"
        });
      } else {
        const { error } = await supabase
          .from('car_sales')
          .insert(saleData);
        
        if (error) throw error;
        
        toast({
          title: "Succes",
          description: "Vânzarea a fost înregistrată cu succes"
        });

        // Update car status to sold
        await supabase
          .from('car_listings')
          .update({ status: 'sold' })
          .eq('id', formData.car_id);
      }

      setDialogOpen(false);
      setEditingSale(null);
      setFormData({
        car_id: '',
        sale_price: '',
        sale_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        notes: ''
      });
      fetchSales();
      fetchCars();

    } catch (error) {
      console.error('Error saving sale:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut salva vânzarea",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (sale: CarSale) => {
    setEditingSale(sale);
    setFormData({
      car_id: sale.car_id,
      sale_price: sale.sale_price.toString(),
      sale_date: sale.sale_date,
      payment_method: sale.payment_method,
      notes: sale.notes || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (saleId: string, carId: string) => {
    try {
      const { error } = await supabase
        .from('car_sales')
        .delete()
        .eq('id', saleId);

      if (error) throw error;

      // Revert car status back to active
      await supabase
        .from('car_listings')
        .update({ status: 'active' })
        .eq('id', carId);

      toast({
        title: "Succes",
        description: "Vânzarea a fost ștearsă cu succes"
      });

      fetchSales();
      fetchCars();
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut șterge vânzarea",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      cash: 'Numerar',
      credit: 'Credit auto',
      leasing: 'Leasing',
      'trade-in': 'Trade-in'
    };
    return labels[method as keyof typeof labels] || method;
  };

  if (loading) {
    return <div className="flex justify-center py-8">Se încarcă...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestiunea Vânzărilor</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingSale(null);
              setFormData({
                car_id: '',
                sale_price: '',
                sale_date: new Date().toISOString().split('T')[0],
                payment_method: 'cash',
                notes: ''
              });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Adaugă vânzare
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSale ? 'Editează vânzarea' : 'Adaugă vânzare nouă'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="car_id">Mașină</Label>
                <Select value={formData.car_id} onValueChange={(value) => 
                  setFormData({ ...formData, car_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează mașina" />
                  </SelectTrigger>
                  <SelectContent>
                    {cars.map(car => (
                      <SelectItem key={car.id} value={car.id}>
                        {car.marca} {car.model} ({car.an_fabricatie}) - {formatCurrency(car.pret)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sale_price">Preț de vânzare (EUR)</Label>
                <Input
                  id="sale_price"
                  type="number"
                  value={formData.sale_price}
                  onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="sale_date">Data vânzării</Label>
                <Input
                  id="sale_date"
                  type="date"
                  value={formData.sale_date}
                  onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="payment_method">Metoda de plată</Label>
                <Select value={formData.payment_method} onValueChange={(value) => 
                  setFormData({ ...formData, payment_method: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Numerar</SelectItem>
                    <SelectItem value="credit">Credit auto</SelectItem>
                    <SelectItem value="leasing">Leasing</SelectItem>
                    <SelectItem value="trade-in">Trade-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Note (opțional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Detalii suplimentare despre vânzare..."
                />
              </div>

              <Button type="submit" className="w-full">
                {editingSale ? 'Actualizează' : 'Înregistrează'} vânzarea
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sales.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Euro className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nu există vânzări înregistrate încă</p>
            </CardContent>
          </Card>
        ) : (
          sales.map(sale => (
            <Card key={sale.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {sale.car_listings?.marca} {sale.car_listings?.model} ({sale.car_listings?.an_fabricatie})
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Vândut pe {new Date(sale.sale_date).toLocaleDateString('ro-RO')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(sale)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(sale.id, sale.car_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Preț de vânzare</p>
                    <p className="text-lg font-semibold">{formatCurrency(sale.sale_price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Metodă de plată</p>
                    <p className="font-medium">{getPaymentMethodLabel(sale.payment_method)}</p>
                  </div>
                  {sale.notes && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Note</p>
                      <p className="text-sm">{sale.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}