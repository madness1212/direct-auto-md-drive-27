import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Users, Eye, Car, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalVisitors: number;
  uniqueVisitors: number;
  totalPageViews: number;
  totalCarViews: number;
  mostViewedCar: {
    car_id: string;
    marca: string;
    model: string;
    views: number;
  } | null;
  salesThisMonth: number;
  salesRevenue: number;
  topPages: Array<{
    page_path: string;
    views: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    totalPageViews: 0,
    totalCarViews: 0,
    mostViewedCar: null,
    salesThisMonth: 0,
    salesRevenue: 0,
    topPages: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));
      const startDate = daysAgo.toISOString();

      // Fetch website analytics
      const { data: websiteData } = await supabase
        .from('website_analytics')
        .select('visitor_id, page_path')
        .gte('created_at', startDate);

      // Fetch car views
      const { data: carViewsData } = await supabase
        .from('car_views')
        .select(`
          car_id,
          car_listings!inner(marca, model)
        `)
        .gte('viewed_at', startDate);

      // Fetch sales data for current month
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const { data: salesData } = await supabase
        .from('car_sales')
        .select('sale_price')
        .gte('sale_date', `${currentMonth}-01`);

      // Calculate most viewed car
      const carViewCounts = carViewsData?.reduce((acc, view) => {
        const key = view.car_id;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const mostViewedCarId = Object.keys(carViewCounts).reduce((a, b) => 
        carViewCounts[a] > carViewCounts[b] ? a : b, Object.keys(carViewCounts)[0]
      );

      const mostViewedCarData = carViewsData?.find(view => view.car_id === mostViewedCarId);

      // Calculate top pages
      const pageViewCounts = websiteData?.reduce((acc, visit) => {
        acc[visit.page_path] = (acc[visit.page_path] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topPages = Object.entries(pageViewCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([page_path, views]) => ({ page_path, views }));

      setAnalyticsData({
        totalVisitors: websiteData?.length || 0,
        uniqueVisitors: new Set(websiteData?.map(d => d.visitor_id)).size || 0,
        totalPageViews: websiteData?.length || 0,
        totalCarViews: carViewsData?.length || 0,
        mostViewedCar: mostViewedCarData ? {
          car_id: mostViewedCarId,
          marca: mostViewedCarData.car_listings.marca,
          model: mostViewedCarData.car_listings.model,
          views: carViewCounts[mostViewedCarId]
        } : null,
        salesThisMonth: salesData?.length || 0,
        salesRevenue: salesData?.reduce((sum, sale) => sum + sale.sale_price, 0) || 0,
        topPages
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut încărca statisticile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Statistici & Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Ultimele 7 zile</SelectItem>
            <SelectItem value="30">Ultimele 30 zile</SelectItem>
            <SelectItem value="90">Ultimele 90 zile</SelectItem>
            <SelectItem value="365">Ultimul an</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Prezentare generală</TabsTrigger>
          <TabsTrigger value="traffic">Trafic website</TabsTrigger>
          <TabsTrigger value="cars">Analiză mașini</TabsTrigger>
          <TabsTrigger value="sales">Vânzări</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vizitatori unici</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {timeRange} zile
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vizualizări pagini</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalPageViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Total vizualizări
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vizualizări mașini</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalCarViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Click-uri pe mașini
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vânzări luna aceasta</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.salesThisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(analyticsData.salesRevenue)}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cele mai vizitate pagini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topPages.map((page, index) => (
                    <div key={page.page_path} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <span className="text-sm text-muted-foreground">
                          {page.page_path === '/' ? 'Pagina principală' : page.page_path}
                        </span>
                      </div>
                      <span className="text-sm font-bold">{page.views} vizualizări</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistici trafic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total vizitatori</span>
                    <span className="font-medium">{analyticsData.totalVisitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Vizitatori unici</span>
                    <span className="font-medium">{analyticsData.uniqueVisitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pagini per sesiune</span>
                    <span className="font-medium">
                      {analyticsData.uniqueVisitors > 0 ? 
                        (analyticsData.totalPageViews / analyticsData.uniqueVisitors).toFixed(1) : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cars" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cea mai vizualizată mașină</CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.mostViewedCar ? (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      {analyticsData.mostViewedCar.marca} {analyticsData.mostViewedCar.model}
                    </h3>
                    <p className="text-2xl font-bold text-primary">
                      {analyticsData.mostViewedCar.views} vizualizări
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nu există date despre vizualizări</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistici mașini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total vizualizări mașini</span>
                    <span className="font-medium">{analyticsData.totalCarViews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Medie per mașină</span>
                    <span className="font-medium">
                      {analyticsData.mostViewedCar ? 
                        (analyticsData.totalCarViews / 1).toFixed(1) : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Vânzări această lună</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.salesThisMonth}</div>
                <p className="text-xs text-muted-foreground">mașini vândute</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Venituri această lună</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analyticsData.salesRevenue)}</div>
                <p className="text-xs text-muted-foreground">total venituri</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Preț mediu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.salesThisMonth > 0 ? 
                    formatCurrency(analyticsData.salesRevenue / analyticsData.salesThisMonth) : 
                    formatCurrency(0)
                  }
                </div>
                <p className="text-xs text-muted-foreground">per mașină</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}