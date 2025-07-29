import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopOffersManager } from './TopOffersManager';
import { useNavigate } from 'react-router-dom';
import { LogOut, Car, Star, BarChart3, Settings, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("cars");

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Deconectare reușită',
      description: 'Ai fost deconectat cu succes.',
    });
    navigate('/auth');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-auto-green" />
                <h1 className="text-2xl font-bold text-foreground">
                  Direct Auto Admin
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-auto-green"
              >
                <Home className="h-4 w-4 mr-2" />
                Înapoi la Site
              </Button>
              <span className="text-sm text-muted-foreground">
                Conectat ca: {user.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Deconectare
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="cars" className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Anunțuri Auto</span>
            </TabsTrigger>
            <TabsTrigger value="top-offers" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Top Oferte</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Statistici</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Setări</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cars">
            {children}
          </TabsContent>

          <TabsContent value="top-offers">
            <TopOffersManager />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Statistici și Analize
              </h3>
              <p className="text-muted-foreground">
                Funcționalitatea de statistici va fi implementată în curând.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Setări Generale
              </h3>
              <p className="text-muted-foreground">
                Setările generale vor fi implementate în curând.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}