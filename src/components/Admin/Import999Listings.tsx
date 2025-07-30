import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Download, AlertTriangle, CheckCircle, Globe, Car } from "lucide-react";

interface ImportResult {
  success: boolean;
  imported: number;
  errors: number;
  listings?: any[];
  errorDetails?: any[];
  error?: string;
}

export const Import999Listings = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "Eroare",
        description: "Te rog să introduci URL-ul de pe 999.md",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setImportResult(null);
    
    try {
      console.log('Starting import from URL:', url);
      
      const { data, error } = await supabase.functions.invoke('import-999-listings', {
        body: { url }
      });

      if (error) {
        throw error;
      }

      console.log('Import result:', data);
      setImportResult(data);
      
      if (data.success) {
        toast({
          title: "Import reușit!",
          description: `Au fost importate ${data.imported} anunțuri auto`,
        });
      } else {
        toast({
          title: "Import eșuat",
          description: data.error || "Eroare necunoscută",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut importa datele. Verifică URL-ul și încearcă din nou.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Large "În curând" text */}
      <div className="text-center py-16">
        <h1 className="text-8xl font-bold text-muted-foreground/30 mb-4">
          În curând
        </h1>
        <p className="text-lg text-muted-foreground">
          Funcționalitatea de import va fi disponibilă în scurt timp
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-auto-green" />
            <span>Import Anunțuri de pe 999.md</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleImport} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                URL-ul paginii de pe 999.md
              </label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://999.md/ro/list/transport/cars"
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground">
                Introdu URL-ul unei pagini cu anunțuri auto de pe 999.md
              </p>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <Progress value={50} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  Se importă anunțurile... Aceasta poate dura câteva minute.
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-auto-green hover:bg-auto-green-dark"
            >
              {isLoading ? (
                <>
                  <Download className="h-4 w-4 mr-2 animate-pulse" />
                  Se importă...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Importă Anunțuri
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {importResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <span>Rezultatul Importului</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              {importResult.success && (
                <>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {importResult.imported} importate
                  </Badge>
                  {importResult.errors > 0 && (
                    <Badge variant="destructive">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {importResult.errors} erori
                    </Badge>
                  )}
                </>
              )}
            </div>

            {!importResult.success && importResult.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{importResult.error}</p>
              </div>
            )}

            {importResult.listings && importResult.listings.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Anunțuri importate recent:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {importResult.listings.slice(0, 5).map((listing, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded">
                      <Car className="h-4 w-4 text-auto-green" />
                      <span className="text-sm">
                        {listing.marca} {listing.model} ({listing.an_fabricatie}) - €{listing.pret.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {importResult.listings.length > 5 && (
                    <p className="text-xs text-muted-foreground">
                      ... și încă {importResult.listings.length - 5} anunțuri
                    </p>
                  )}
                </div>
              </div>
            )}

            {importResult.errorDetails && importResult.errorDetails.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Detalii erori:</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {importResult.errorDetails.slice(0, 3).map((error, index) => (
                    <div key={index} className="text-xs text-red-600 p-2 bg-red-50 rounded">
                      {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h4 className="font-medium text-blue-900">💡 Sfaturi pentru import:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Folosește URL-uri de pe pagini cu mai multe anunțuri auto</li>
              <li>• Sistemul va extrage automat: marca, model, anul, prețul, kilometrajul, etc.</li>
              <li>• Anunțurile duplicate nu vor fi importate</li>
              <li>• Imaginile vor fi importate dacă sunt disponibile</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};