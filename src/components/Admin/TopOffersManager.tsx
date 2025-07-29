import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Star, 
  GripVertical, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Loader2,
  Car,
  Edit
} from 'lucide-react';

interface TopOffer {
  id: string;
  marca: string;
  model: string;
  an_fabricatie: number;
  pret: number;
  images: string[];
  top_offer_position: number;
  is_top_offer: boolean;
}

export function TopOffersManager() {
  const [topOffers, setTopOffers] = useState<TopOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTopOffers();
  }, []);

  const fetchTopOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('car_listings')
        .select('*')
        .eq('is_top_offer', true)
        .eq('status', 'active')
        .order('top_offer_position', { ascending: true });

      if (error) throw error;

      setTopOffers(data || []);
    } catch (error: any) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca top ofertele.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(topOffers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Actualizează pozițiile local
    const updatedItems = items.map((item, index) => ({
      ...item,
      top_offer_position: index + 1,
    }));

    setTopOffers(updatedItems);

    // Salvează în baza de date
    setUpdating(true);
    try {
      const updates = updatedItems.map((item) => ({
        id: item.id,
        top_offer_position: item.top_offer_position,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('car_listings')
          .update({ top_offer_position: update.top_offer_position })
          .eq('id', update.id);

        if (error) throw error;
      }

      toast({
        title: 'Succes',
        description: 'Ordinea top ofertelor a fost actualizată.',
      });
    } catch (error: any) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut actualiza ordinea.',
        variant: 'destructive',
      });
      // Revert la starea anterioară
      fetchTopOffers();
    } finally {
      setUpdating(false);
    }
  };

  const removeFromTopOffers = async (carId: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('car_listings')
        .update({ 
          is_top_offer: false,
          top_offer_position: null 
        })
        .eq('id', carId);

      if (error) throw error;

      await fetchTopOffers();
      toast({
        title: 'Succes',
        description: 'Mașina a fost eliminată din top oferte.',
      });
    } catch (error: any) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut elimina mașina din top oferte.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const movePosition = async (carId: string, direction: 'up' | 'down') => {
    const currentIndex = topOffers.findIndex(car => car.id === carId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= topOffers.length) return;

    const items = Array.from(topOffers);
    const [movedItem] = items.splice(currentIndex, 1);
    items.splice(newIndex, 0, movedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      top_offer_position: index + 1,
    }));

    setTopOffers(updatedItems);

    setUpdating(true);
    try {
      const updates = updatedItems.map((item) => ({
        id: item.id,
        top_offer_position: item.top_offer_position,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('car_listings')
          .update({ top_offer_position: update.top_offer_position })
          .eq('id', update.id);

        if (error) throw error;
      }

      toast({
        title: 'Succes',
        description: 'Poziția a fost actualizată.',
      });
    } catch (error: any) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut actualiza poziția.',
        variant: 'destructive',
      });
      fetchTopOffers();
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-auto-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestionare Top Oferte</h2>
          <p className="text-muted-foreground">
            Gestionează mașinile care apar în secțiunea "Top Oferte" de pe pagina principală.
          </p>
        </div>
        <Badge variant="outline" className="border-auto-green text-auto-green">
          {topOffers.length} oferte active
        </Badge>
      </div>

      {topOffers.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nu există top oferte
              </h3>
              <p className="text-muted-foreground mb-4">
                Pentru a adăuga o mașină la top oferte, editează anunțul și activează opțiunea "Top Ofertă".
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-auto-green" />
              Top Oferte Active ({topOffers.length})
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GripVertical className="h-4 w-4" />
              Trage și mută pentru a reordona ofertele. Prima poziție va apărea pe primul loc pe homepage.
            </div>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="top-offers">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-4"
                  >
                    {topOffers.map((offer, index) => (
                      <Draggable key={offer.id} draggableId={offer.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
                              snapshot.isDragging 
                                ? 'border-auto-green bg-auto-green/5 shadow-lg' 
                                : 'border-border hover:border-auto-green/50'
                            }`}
                          >
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="flex flex-col items-center text-muted-foreground hover:text-auto-green transition-colors cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-5 w-5" />
                              <span className="text-xs font-medium">#{index + 1}</span>
                            </div>

                            {/* Car Image */}
                            <div className="w-20 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                              {offer.images && offer.images.length > 0 ? (
                                <img 
                                  src={offer.images[0]} 
                                  alt={`${offer.marca} ${offer.model}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Car className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>

                            {/* Car Info */}
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">
                                {offer.marca} {offer.model}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Anul {offer.an_fabricatie}</span>
                                <span className="font-semibold text-auto-green">
                                  ${offer.pret.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* Position Controls */}
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => movePosition(offer.id, 'up')}
                                disabled={index === 0 || updating}
                                className="h-8 w-8 p-0"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => movePosition(offer.id, 'down')}
                                disabled={index === topOffers.length - 1 || updating}
                                className="h-8 w-8 p-0"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromTopOffers(offer.id)}
                                disabled={updating}
                                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <X className="h-4 w-4" />
                                Elimină
                              </Button>
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

            {updating && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Se actualizează...</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Cum să adaugi noi top oferte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Mergi la secțiunea "Anunțuri Auto" din panoul de administrare</p>
          <p>2. Editează anunțul mașinii pe care vrei să o faci top ofertă</p>
          <p>3. În tabul "Setări", activează opțiunea "Afișează ca Top Ofertă pe pagina principală"</p>
          <p>4. Salvează modificările - mașina va apărea automat în această listă</p>
          <p>5. Reordonează ofertele după cum dorești folosind drag & drop sau butoanele săgeți</p>
        </CardContent>
      </Card>
    </div>
  );
}