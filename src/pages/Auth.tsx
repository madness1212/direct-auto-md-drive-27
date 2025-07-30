import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);
  const [requestEmail, setRequestEmail] = useState('');
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
    const rememberMe = formData.get('rememberMe') === 'on';

    // Store remember preference
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
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

  const handleGenerateCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsGeneratingCode(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    try {
      const response = await supabase.functions.invoke('generate-registration-code', {
        body: { email }
      });

      if (response.error) {
        throw response.error;
      }

      setCodeRequested(true);
      setRequestEmail(email);
      toast({
        title: 'Cod generat cu succes',
        description: 'Verifică-ți emailul pentru codul de înregistrare.',
      });
    } catch (error: any) {
      toast({
        title: 'Eroare la generarea codului',
        description: error.message || 'A apărut o eroare neașteptată.',
        variant: 'destructive',
      });
    }

    setIsGeneratingCode(false);
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const registrationCode = formData.get('registrationCode') as string;

    try {
      // Verifică codul de înregistrare
      const { data: codeData, error: codeError } = await supabase
        .from('registration_codes')
        .select('*')
        .eq('code', registrationCode)
        .eq('email', email)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (codeError || !codeData) {
        toast({
          title: 'Cod de înregistrare invalid',
          description: 'Codul introdus nu este valid sau a expirat.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Înregistrează utilizatorul
      const { error } = await signUp(email, password, fullName);

      if (error) {
        toast({
          title: 'Eroare la înregistrare',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        // Marchează codul ca folosit
        await supabase
          .from('registration_codes')
          .update({ used: true, used_at: new Date().toISOString() })
          .eq('id', codeData.id);

        toast({
          title: 'Înregistrare reușită',
          description: 'Contul a fost creat cu succes.',
        });
        
        // Schimbă la tab-ul de conectare
        const signinTab = document.querySelector('[value="signin"]') as HTMLElement;
        signinTab?.click();
      }
    } catch (error: any) {
      toast({
        title: 'Eroare la înregistrare',
        description: error.message || 'A apărut o eroare neașteptată.',
        variant: 'destructive',
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
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember-me" name="rememberMe" />
                  <Label htmlFor="remember-me" className="text-sm font-normal">
                    Ține-mă minte
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Conectează-te
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              {!codeRequested ? (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Mail className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-semibold mb-1">Solicitare cod de înregistrare</h3>
                    <p className="text-sm text-muted-foreground">
                      Pentru a vă înregistra, aveți nevoie de un cod unic care va fi trimis pe email.
                    </p>
                  </div>
                  
                  <form onSubmit={handleGenerateCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="request-email">Email</Label>
                      <Input
                        id="request-email"
                        name="email"
                        type="email"
                        placeholder="admin@directauto.md"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isGeneratingCode}>
                      {isGeneratingCode && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Generează cod de înregistrare
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Clock className="mx-auto h-8 w-8 text-green-600 mb-2" />
                    <h3 className="font-semibold text-green-800 mb-1">Cod trimis pe email</h3>
                    <p className="text-sm text-green-700">
                      Un cod de înregistrare a fost trimis la <strong>{requestEmail}</strong>.
                      Codul este valabil pentru 1 oră.
                    </p>
                  </div>
                  
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-code">Cod de înregistrare</Label>
                      <Input
                        id="signup-code"
                        name="registrationCode"
                        type="text"
                        placeholder="Introdu codul primit pe email"
                        className="text-center font-mono text-lg tracking-widest"
                        required
                      />
                    </div>
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
                        value={requestEmail}
                        readOnly
                        className="bg-muted"
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
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setCodeRequested(false)}
                      >
                        Înapoi
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Înregistrează-te
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}