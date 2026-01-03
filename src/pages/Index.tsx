import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { WeatherAlertBanner } from '@/components/WeatherAlert';
import { HarvestCalculator } from '@/components/HarvestCalculator';
import { CalculationResults } from '@/components/CalculationResults';
import { FarmerChecklist } from '@/components/FarmerChecklist';
import { RiskDisclaimer } from '@/components/RiskDisclaimer';
import { CalculationHistory } from '@/components/CalculationHistory';
import { MarketPrice, WeatherAlert, CalculationResult, SavedCalculation } from '@/types';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoadingData(true);
    
    const [pricesRes, alertsRes, calcsRes] = await Promise.all([
      supabase.from('market_prices').select('*'),
      supabase.from('weather_alerts').select('*').eq('active', true),
      supabase.from('calculations').select('*').order('created_at', { ascending: false }).limit(10)
    ]);

    if (pricesRes.data) {
      setMarketPrices(pricesRes.data as MarketPrice[]);
    }
    if (alertsRes.data) {
      setWeatherAlerts(alertsRes.data as WeatherAlert[]);
    }
    if (calcsRes.data) {
      setSavedCalculations(calcsRes.data as unknown as SavedCalculation[]);
    }

    setLoadingData(false);
  };

  const handleCalculate = (result: CalculationResult) => {
    setCalculationResult(result);
  };

  const handleSaveCalculation = async () => {
    if (!calculationResult || !user) return;

    setSaving(true);
    const { input, bestOption } = calculationResult;

    const { error } = await supabase.from('calculations').insert([{
      user_id: user.id,
      crop_name: input.cropName,
      quantity_kg: input.quantityKg,
      harvest_date: input.harvestDate.toISOString().split('T')[0],
      shelf_life_days: input.shelfLifeDays,
      storage_loss_percent: input.storageLossPercent,
      distance_market_a: input.distanceMarketA,
      distance_market_b: input.distanceMarketB,
      transport_cost_per_km: input.transportCostPerKm,
      best_option: bestOption.label,
      best_revenue: bestOption.netRevenue,
      calculation_details: JSON.parse(JSON.stringify(calculationResult))
    }]);

    setSaving(false);

    if (error) {
      toast({
        title: 'Error saving',
        description: 'Could not save your calculation. Please try again.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Saved!',
        description: 'Your calculation has been saved to history.'
      });
      fetchData();
    }
  };

  const handleDeleteCalculation = async (id: string) => {
    const { error } = await supabase.from('calculations').delete().eq('id', id);
    
    if (!error) {
      setSavedCalculations(prev => prev.filter(c => c.id !== id));
      toast({
        title: 'Deleted',
        description: 'Calculation removed from history.'
      });
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Weather Alerts */}
          <WeatherAlertBanner alerts={weatherAlerts} />

          {/* Calculator */}
          <HarvestCalculator 
            marketPrices={marketPrices} 
            onCalculate={handleCalculate} 
          />

          {/* Results */}
          {calculationResult && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={handleSaveCalculation} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Calculation
                </Button>
              </div>
              <CalculationResults result={calculationResult} />
            </div>
          )}

          {/* Supporting Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FarmerChecklist />
            <CalculationHistory 
              calculations={savedCalculations} 
              onDelete={handleDeleteCalculation} 
            />
          </div>

          {/* Risk & Disclaimer */}
          <RiskDisclaimer />
        </div>
      </main>
    </div>
  );
};

export default Index;
