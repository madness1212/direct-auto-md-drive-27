import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Car, Mail, Phone, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TestDriveFormProps {
  carId: string;
  carTitle: string;
}

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  preferredDate: string;
  message: string;
}

export const TestDriveForm = ({ carId, carTitle }: TestDriveFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    preferredDate: "",
    message: ""
  });
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validare câmpuri obligatorii
      if (!formData.fullName || !formData.phone || !formData.email || !formData.preferredDate) {
        toast({
          title: "Eroare",
          description: "Toate câmpurile obligatorii trebuie completate.",
          variant: "destructive"
        });
        return;
      }

      // Validare dată în viitor
      const selectedDate = new Date(formData.preferredDate);
      const now = new Date();
      if (selectedDate <= now) {
        toast({
          title: "Eroare",
          description: "Data și ora trebuie să fie în viitor.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('submit-test-drive-request', {
        body: {
          carId,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          preferredDate: formData.preferredDate,
          message: formData.message
        }
      });

      if (error) {
        console.error('Error submitting test drive request:', error);
        toast({
          title: "Eroare",
          description: "Nu am putut trimite cererea. Te rugăm să încerci din nou.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Cerere trimisă cu succes!",
        description: "Cererea ta a fost înregistrată. Te vom contacta în curând.",
      });

      // Reset form și închide modal
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        preferredDate: "",
        message: ""
      });
      setOpen(false);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare neașteptată. Te rugăm să încerci din nou.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Formatare dată pentru input datetime-local (minimum azi + 1 oră)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="w-full bg-gradient-to-r from-auto-green to-auto-green-dark hover:from-auto-green-dark hover:to-auto-green text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Car className="h-5 w-5 mr-2" />
          Programează Test Drive
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center">
            <Car className="h-6 w-6 mr-2 text-auto-green" />
            Programează Test Drive
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {carTitle}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-1 text-auto-green" />
              Nume complet *
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Ex: Ion Popescu"
              required
              className="border-border focus:border-auto-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium flex items-center">
              <Phone className="h-4 w-4 mr-1 text-auto-green" />
              Număr de telefon *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Ex: +373 69 123 456"
              required
              className="border-border focus:border-auto-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center">
              <Mail className="h-4 w-4 mr-1 text-auto-green" />
              Adresa de e-mail *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Ex: ion.popescu@email.com"
              required
              className="border-border focus:border-auto-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredDate" className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-1 text-auto-green" />
              Data și ora dorită *
            </Label>
            <Input
              id="preferredDate"
              type="datetime-local"
              value={formData.preferredDate}
              onChange={(e) => handleInputChange("preferredDate", e.target.value)}
              min={getMinDateTime()}
              required
              className="border-border focus:border-auto-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-auto-green" />
              Mesaj opțional
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Adaugă orice detalii suplimentare..."
              rows={3}
              className="border-border focus:border-auto-green resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Anulează
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-auto-green hover:bg-auto-green-dark"
            >
              {loading ? "Se trimite..." : "Trimite cererea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};