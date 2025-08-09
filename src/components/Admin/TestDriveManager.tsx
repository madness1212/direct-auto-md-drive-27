import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TestDriveDetails } from "./TestDriveDetails";
import { CarPreviewDialog } from "./CarPreviewDialog";
import { Calendar, Car, Clock, Mail, Phone, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

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

export const TestDriveManager = () => {
  const [requests, setRequests] = useState<TestDriveRequest[]>([]);
  const [carDetails, setCarDetails] = useState<Record<string, CarDetails>>({});
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Funcție pentru generarea slug-ului pentru mașină
  const generateCarSlug = (carId: string, carData: CarDetails) => {
    const marca = carData.marca.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const model = carData.model.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const an = carData.an_fabricatie;
    return `${marca}-${model}-${an}-${carId}`;
  };

  useEffect(() => {
    fetchTestDriveRequests();
  }, []);

  const fetchTestDriveRequests = async () => {
    try {
      setLoading(true);
      
      // Fetch test drive requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('test_drive_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching test drive requests:', requestsError);
        toast({
          title: "Eroare",
          description: "Nu am putut încărca cererile de test drive.",
          variant: "destructive"
        });
        return;
      }

      setRequests((requestsData || []) as TestDriveRequest[]);
      
      // Count pending requests
      const pending = requestsData?.filter(req => req.status === 'pending').length || 0;
      setPendingCount(pending);

      // Fetch car details for each unique car_id
      const uniqueCarIds = [...new Set(requestsData?.map(req => req.car_id) || [])];
      
      if (uniqueCarIds.length > 0) {
        const { data: carsData, error: carsError } = await supabase
          .from('car_listings')
          .select('id, marca, model, an_fabricatie')
          .in('id', uniqueCarIds);

        if (!carsError && carsData) {
          const carDetailsMap = carsData.reduce((acc, car) => {
            acc[car.id] = {
              marca: car.marca,
              model: car.model,
              an_fabricatie: car.an_fabricatie
            };
            return acc;
          }, {} as Record<string, CarDetails>);
          
          setCarDetails(carDetailsMap);
        }
      }

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare neașteptată.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: TestDriveRequest['status']) => {
    try {
      const { error } = await supabase
        .from('test_drive_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) {
        console.error('Error updating request status:', error);
        toast({
          title: "Eroare",
          description: "Nu am putut actualiza statusul cererii.",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );

      // Update pending count
      const updatedRequests = requests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      );
      const newPendingCount = updatedRequests.filter(req => req.status === 'pending').length;
      setPendingCount(newPendingCount);

      toast({
        title: "Succes",
        description: "Statusul cererii a fost actualizat.",
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare neașteptată.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: TestDriveRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50"><AlertCircle className="h-3 w-3 mr-1" />În așteptare</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50"><CheckCircle className="h-3 w-3 mr-1" />Confirmat</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50"><CheckCircle className="h-3 w-3 mr-1" />Finalizat</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50"><XCircle className="h-3 w-3 mr-1" />Anulat</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: ro });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-auto-green"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-auto-green" />
            <span>Cereri Test Drive</span>
          </div>
          {pendingCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {pendingCount} noi
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nu există cereri de test drive.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden lg:table-cell">Client</TableHead>
                  <TableHead>Automobil</TableHead>
                  <TableHead className="hidden sm:table-cell">Data dorită</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-auto-green" />
                          <span className="font-medium">{request.full_name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{request.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{request.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {carDetails[request.car_id] ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-auto-green" />
                            <span>
                              {carDetails[request.car_id].marca} {carDetails[request.car_id].model} ({carDetails[request.car_id].an_fabricatie})
                            </span>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-auto-green hover:bg-auto-green-dark text-white"
                              >
                                Vezi detaliile mașinii
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <CarPreviewDialog carId={request.car_id} />
                            </DialogContent>
                          </Dialog>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Mașină necunoscută</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-auto-green" />
                        <span className="text-sm">{formatDate(request.preferred_date)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Trimisă: {formatDate(request.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
                        <TestDriveDetails 
                          request={request} 
                          carDetails={carDetails[request.car_id] || null} 
                        />
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRequestStatus(request.id, 'confirmed')}
                              className="border-blue-500 text-blue-700 hover:bg-blue-50 min-h-12 min-w-12 lg:min-h-8 lg:min-w-auto"
                            >
                              <CheckCircle className="h-4 w-4 lg:mr-1" />
                              <span className="hidden lg:inline">Confirmă</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRequestStatus(request.id, 'cancelled')}
                              className="border-red-500 text-red-700 hover:bg-red-50 min-h-12 min-w-12 lg:min-h-8 lg:min-w-auto"
                            >
                              <XCircle className="h-4 w-4 lg:mr-1" />
                              <span className="hidden lg:inline">Anulează</span>
                            </Button>
                          </>
                        )}
                        {request.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRequestStatus(request.id, 'completed')}
                            className="border-green-500 text-green-700 hover:bg-green-50 min-h-12 min-w-12 lg:min-h-8 lg:min-w-auto"
                          >
                            <CheckCircle className="h-4 w-4 lg:mr-1" />
                            <span className="hidden lg:inline">Finalizează</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};