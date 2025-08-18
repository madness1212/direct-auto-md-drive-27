import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Search, Eye, RefreshCw, Car, User } from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface Contract {
  id: string;
  contract_number: string;
  contract_date: string;
  created_at: string;
  template_path: string;
  car_id: string;
  client_id: string;
  car_listings?: {
    marca: string;
    model: string;
    an_fabricatie: number;
    pret: number;
  } | null;
  clients?: {
    nume_cumparator: string;
    nume_prenume_cumparator: string;
    telefon: string;
  } | null;
}

export function ContractsManager() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          car_listings(marca, model, an_fabricatie, pret),
          clients(nume_cumparator, nume_prenume_cumparator, telefon)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts((data as any) || []);
    } catch (error: any) {
      toast({
        title: 'Eroare la încărcarea contractelor',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contract.contract_number.toLowerCase().includes(searchLower) ||
      contract.car_listings?.marca.toLowerCase().includes(searchLower) ||
      contract.car_listings?.model.toLowerCase().includes(searchLower) ||
      contract.clients?.nume_cumparator.toLowerCase().includes(searchLower) ||
      contract.clients?.nume_prenume_cumparator.toLowerCase().includes(searchLower)
    );
  });

  const handleDownloadContract = async (contract: Contract) => {
    setDownloadingId(contract.id);
    try {
      const { data, error } = await supabase.storage
        .from('car-documents')
        .download(contract.template_path);

      if (error) throw error;

      // Create a blob URL and trigger download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${contract.contract_number}_contract.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Contract descărcat',
        description: `Contractul ${contract.contract_number} a fost descărcat cu succes.`,
      });
    } catch (error: any) {
      toast({
        title: 'Eroare la descărcarea contractului',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: ro });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: ro });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center">
            <FileText className="h-6 w-6 mr-2 text-primary" />
            Managementul Contractelor
          </h2>
          <p className="text-muted-foreground">
            Vizualizează și descarcă toate contractele generate
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={fetchContracts} 
            disabled={loading}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Reîmprospătează
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Căutare și Statistici</span>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {filteredContracts.length} contracte
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Caută după numărul contractului, marcă/model mașină sau nume client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista Contractelor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Număr Contract</TableHead>
                  <TableHead>Data Contract</TableHead>
                  <TableHead>Mașină</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Preț</TableHead>
                  <TableHead>Data Generare</TableHead>
                  <TableHead>Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Se încarcă contractele...
                    </TableCell>
                  </TableRow>
                ) : filteredContracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {searchTerm ? 'Nu au fost găsite contracte care să corespundă căutării' : 'Nu există contracte generate încă'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-mono font-medium">
                            {contract.contract_number}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatDate(contract.contract_date)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {contract.car_listings?.marca} {contract.car_listings?.model}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {contract.car_listings?.an_fabricatie}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {contract.clients?.nume_cumparator}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {contract.clients?.telefon}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">
                          {contract.car_listings?.pret?.toLocaleString()} EUR
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(contract.created_at)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadContract(contract)}
                            disabled={downloadingId === contract.id}
                          >
                            {downloadingId === contract.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
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

      {/* Summary Card */}
      {!loading && contracts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sumar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {contracts.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total contracte
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {contracts
                    .reduce((sum, contract) => sum + (contract.car_listings?.pret || 0), 0)
                    .toLocaleString()} EUR
                </div>
                <div className="text-sm text-muted-foreground">
                  Valoare totală vânzări
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(contracts.map(c => c.client_id)).size}
                </div>
                <div className="text-sm text-muted-foreground">
                  Clienți unici
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}