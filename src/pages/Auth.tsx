import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (user) {
    navigate('/admin');
    return null;
  }

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const adminCode = formData.get('adminCode') as string;

    // Verifică codul de administrator
    if (adminCode !== 'NicolaeVicol1983/Direct') {
      toast({
        title: 'Cod administrator incorect',
        description: 'Codul de administrator introdus nu este valid.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Eroare la autentificare',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Conectare reușită',
        description: 'Vei fi redirecționat către panoul de administrare.',
      });
      navigate('/admin');
    }

    setIsLoading(false);
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const adminCode = formData.get('adminCode') as string;

    // Verifică codul de administrator
    if (adminCode !== 'NicolaeVicol1983/Direct') {
      toast({
        title: 'Cod administrator incorect',
        description: 'Codul de administrator introdus nu este valid.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast({
        title: 'Eroare la înregistrare',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Înregistrare reușită',
        description: 'Verifică-ți emailul pentru a confirma contul.',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Direct Auto Admin</CardTitle>
          <CardDescription>
            Acces securizat la panoul de administrare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Conectare</TabsTrigger>
              <TabsTrigger value="signup">Înregistrare</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="admin@directauto.md"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Parolă</Label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-admin-code">Cod Administrator</Label>
                  <Input
                    id="signin-admin-code"
                    name="adminCode"
                    type="password"
                    placeholder="Introdu codul de administrator"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Conectează-te
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Numele complet</Label>
                  <Input
                    id="signup-name"
                    name="fullName"
                    type="text"
                    placeholder="Ion Popescu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="admin@directauto.md"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Parolă</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-admin-code">Cod Administrator</Label>
                  <Input
                    id="signup-admin-code"
                    name="adminCode"
                    type="password"
                    placeholder="Introdu codul de administrator"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Înregistrează-te
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}