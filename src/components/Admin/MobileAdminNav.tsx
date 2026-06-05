import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Car, 
  Download, 
  Star, 
  TestTube, 
  BarChart3,
  Plus,
  X,
  FileText,
  RefreshCw
} from 'lucide-react';

interface MobileAdminNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddNew: () => void;
  onGenerateContract: () => void;
  pendingTestDrives?: number;
}

export function MobileAdminNav({ 
  activeTab, 
  onTabChange, 
  onAddNew,
  onGenerateContract,
  pendingTestDrives = 0 
}: MobileAdminNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: 'listings',
      label: 'Anunțuri Auto',
      icon: Car,
      badge: null
    },
    {
      id: 'sync999',
      label: 'Sincronizare 999',
      icon: RefreshCw,
      badge: null
    },
    {
      id: 'import',
      label: 'Import 999.md',
      icon: Download,
      badge: null
    },
    {
      id: 'offers',
      label: 'Oferte Speciale',
      icon: Star,
      badge: null
    },
    {
      id: 'testdrive',
      label: 'Test Drive',
      icon: TestTube,
      badge: pendingTestDrives > 0 ? pendingTestDrives : null
    },
    {
      id: 'stats',
      label: 'Statistici',
      icon: BarChart3,
      badge: null
    }
  ];

  const activeItem = menuItems.find(item => item.id === activeTab);

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Car className="h-6 w-6 text-auto-green" />
                  Direct Auto Admin
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-2">
                 {menuItems.map((item) => {
                   const Icon = item.icon;
                   return (
                     <Button
                       key={item.id}
                       variant={activeTab === item.id ? "default" : "ghost"}
                       className="w-full justify-start h-12"
                       onClick={() => {
                         onTabChange(item.id);
                         setIsOpen(false);
                       }}
                     >
                       <Icon className="h-5 w-5 mr-3" />
                       <span className="flex-1 text-left">{item.label}</span>
                       {item.badge && (
                         <Badge variant="destructive" className="ml-2">
                           {item.badge}
                         </Badge>
                       )}
                     </Button>
                   );
                 })}
                 
                 {/* Separator */}
                 <div className="border-t my-4" />
                 
                 {/* Contract Generator */}
                 <Button
                   variant="outline"
                   className="w-full justify-start h-12 border-blue-500 text-blue-600"
                   onClick={() => {
                     onGenerateContract();
                     setIsOpen(false);
                   }}
                 >
                   <FileText className="h-5 w-5 mr-3" />
                   <span className="flex-1 text-left">Generează Contract</span>
                 </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            {activeItem && (
              <>
                <activeItem.icon className="h-5 w-5 text-auto-green" />
                <span className="font-medium">{activeItem.label}</span>
                {activeItem.badge && (
                  <Badge variant="destructive">
                    {activeItem.badge}
                  </Badge>
                )}
              </>
            )}
          </div>

          <Button 
            size="sm" 
            onClick={onAddNew}
            className="bg-auto-green hover:bg-auto-green/90 h-10 w-10 p-0"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          onClick={onAddNew}
          className="bg-auto-green hover:bg-auto-green/90 rounded-full h-14 w-14 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Spacer for mobile navigation */}
      <div className="lg:hidden h-16" />
    </>
  );
}