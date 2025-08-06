import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Calendar, 
  Car, 
  Clock, 
  Mail, 
  Phone, 
  User, 
  MessageSquare,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

interface TestDriveRequest {
  id: string;
  car_id: string;
  full_name: string;
  phone: string;
  email: string;
  preferred_date: string;
  message: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface CarDetails {
  marca: string;
  model: string;
  an_fabricatie: number;
}

interface TestDriveDetailsProps {
  request: TestDriveRequest;
  carDetails: CarDetails | null;
}

export function TestDriveDetails({ request, carDetails }: TestDriveDetailsProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: ro });
  };

  const getStatusBadge = (status: TestDriveRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">În așteptare</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">Confirmat</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">Finalizat</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">Anulat</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline"
          className="min-h-12 min-w-12 lg:min-h-8 lg:min-w-auto"
        >
          <Info className="h-4 w-4 lg:mr-2" />
          <span className="hidden lg:inline">Detalii</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-auto-green" />
            Detalii Cerere Test Drive
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status și dată cerere */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <h3 className="font-semibold">Status cerere</h3>
              {getStatusBadge(request.status)}
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Trimisă la: {formatDate(request.created_at)}
              </div>
            </div>
          </div>

          {/* Informații client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Informații Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Nume complet</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-auto-green" />
                    <span className="font-medium">{request.full_name}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Telefon</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-auto-green" />
                    <a 
                      href={`tel:${request.phone}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {request.phone}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-auto-green" />
                  <a 
                    href={`mailto:${request.email}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {request.email}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informații automobil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Car className="h-5 w-5" />
                Automobil Solicitat
              </CardTitle>
            </CardHeader>
            <CardContent>
              {carDetails ? (
                <div className="space-y-2">
                  <div className="text-lg font-semibold">
                    {carDetails.marca} {carDetails.model} ({carDetails.an_fabricatie})
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID Automobil: {request.car_id}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Informații automobil indisponibile
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data preferată */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Data și Ora Preferată
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {formatDate(request.preferred_date)}
              </div>
            </CardContent>
          </Card>

          {/* Mesaj client */}
          {request.message && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5" />
                  Mesaj de la Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm leading-relaxed">{request.message}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}