import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, RefreshCw, Search, Eye, Download, RotateCw } from 'lucide-react';

interface Advert999 {
  id_999: string;
  title: string;
  price: number;
  price_unit: string;
  state: string;
  thumbnail: string | null;
  posted: string;
  imported: boolean;
  local_id: string | null;
  an_fabricatie: number | null;
}

interface AdvertDetail {
  id_999: string;
  title: string;
  marca: string;
  model: string;
  an_fabricatie: number;
  kilometraj: number;
  pret: number;
  caroserie: string;
  tip_motor: string;
  cutie_viteze: string;
  tractiune: string;
  culoare: string | null;
  putere: string | null;
  vin: string | null;
  descriere: string;
  images: string[];
}

export function Sync999Listings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [adverts, setAdverts] = useState<Advert999[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'imported'>('all');
  const [search, setSearch] = useState('');
  const [actingId, setActingId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdvertDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const callFn = async (action: string, body: Record<string, unknown> = {}) => {
    const { data, error } = await supabase.functions.invoke('sync-999', {
      body: { action, ...body },
    });
    if (error) throw new Error(error.message || 'Eroare la apel');
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await callFn('list');
      setAdverts(data.adverts || []);
    } catch (e: any) {
      toast({
        title: 'Eroare la conexiunea cu 999.md',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return adverts.filter((a) => {
      if (filter === 'new' && a.imported) return false;
      if (filter === 'imported' && !a.imported) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.id_999.includes(q)
      );
    });
  }, [adverts, filter, search]);

  const counts = useMemo(() => ({
    all: adverts.length,
    new: adverts.filter((a) => !a.imported).length,
    imported: adverts.filter((a) => a.imported).length,
  }), [adverts]);

  const openDetail = async (id_999: string) => {
    setDetail(null);
    setDetailLoading(true);
    try {
      const data = await callFn('detail', { id_999 });
      setDetail(data.detail);
    } catch (e: any) {
      toast({ title: 'Eroare la încărcarea detaliilor', description: e.message, variant: 'destructive' });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleImportOrUpdate = async (advert: Advert999) => {
    const action = advert.imported ? 'update' : 'import';
    setActingId(advert.id_999);
    try {
      await callFn(action, { id_999: advert.id_999 });
      toast({
        title: advert.imported ? 'Anunț actualizat' : 'Anunț importat',
        description: advert.title,
      });
      // Update local state without full re-fetch
      setAdverts((prev) =>
        prev.map((a) => (a.id_999 === advert.id_999 ? { ...a, imported: true } : a))
      );
    } catch (e: any) {
      toast({ title: 'Eroare', description: e.message, variant: 'destructive' });
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 flex-wrap">
            <span>Sincronizare 999.md</span>
            <Button variant="outline" size="sm" onClick={fetchList} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Reîmprospătează
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută după titlu, marcă sau ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">Toate ({counts.all})</TabsTrigger>
                <TabsTrigger value="new">Noi ({counts.new})</TabsTrigger>
                <TabsTrigger value="imported">Importate ({counts.imported})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Imagine</TableHead>
                  <TableHead>Titlu</TableHead>
                  <TableHead className="hidden md:table-cell">ID 999</TableHead>
                  <TableHead>Preț</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin inline mr-2" />
                      Se încarcă din 999.md...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      Nu sunt mașini de afișat
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((a) => (
                    <TableRow key={a.id_999}>
                      <TableCell className="hidden sm:table-cell">
                        {a.thumbnail ? (
                          <img src={a.thumbnail} alt={a.title} className="w-20 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-20 h-14 bg-muted rounded" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{a.title}</div>
                        <div className="text-xs text-muted-foreground md:hidden">ID: {a.id_999}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs">{a.id_999}</TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {a.price.toLocaleString()} {a.price_unit.toUpperCase()}
                      </TableCell>
                      <TableCell>
                        {a.imported ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Importat</Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Nou</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetail(a.id_999)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Verifică
                          </Button>
                          <Button
                            size="sm"
                            disabled={actingId === a.id_999}
                            onClick={() => handleImportOrUpdate(a)}
                            className={a.imported ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary hover:bg-primary/90'}
                          >
                            {actingId === a.id_999 ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : a.imported ? (
                              <RotateCw className="h-4 w-4 mr-1" />
                            ) : (
                              <Download className="h-4 w-4 mr-1" />
                            )}
                            {a.imported ? 'Actualizează' : 'Importă'}
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

      <Dialog open={!!detail || detailLoading} onOpenChange={(open) => { if (!open) { setDetail(null); } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{detail?.title || 'Detalii anunț'}</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : detail ? (
            <div className="space-y-4">
              {detail.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {detail.images.slice(0, 12).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${detail.marca} ${i + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <Spec label="Marcă" value={detail.marca} />
                <Spec label="Model" value={detail.model} />
                <Spec label="An" value={detail.an_fabricatie} />
                <Spec label="Preț" value={`${detail.pret.toLocaleString()} EUR`} />
                <Spec label="Kilometraj" value={`${detail.kilometraj.toLocaleString()} km`} />
                <Spec label="Caroserie" value={detail.caroserie} />
                <Spec label="Combustibil" value={detail.tip_motor} />
                <Spec label="Cutie viteze" value={detail.cutie_viteze} />
                <Spec label="Tracțiune" value={detail.tractiune} />
                <Spec label="Putere" value={detail.putere || '—'} />
                <Spec label="Culoare" value={detail.culoare || '—'} />
                <Spec label="VIN" value={detail.vin || '—'} />
              </div>

              {detail.descriere && (
                <div>
                  <h4 className="font-semibold mb-2">Descriere</h4>
                  <p className="text-sm whitespace-pre-wrap text-muted-foreground">{detail.descriere}</p>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border rounded p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium capitalize">{value}</div>
    </div>
  );
}
