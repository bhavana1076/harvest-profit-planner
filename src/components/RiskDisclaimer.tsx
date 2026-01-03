import { AlertTriangle, TrendingDown, Thermometer, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RiskDisclaimer() {
  const risks = [
    {
      icon: TrendingDown,
      title: 'Price Volatility',
      description: 'Market prices can change rapidly. Predicted prices are estimates based on current trends.'
    },
    {
      icon: Thermometer,
      title: 'Storage Loss',
      description: 'Actual storage loss may vary based on temperature, humidity, and storage conditions.'
    },
    {
      icon: Scale,
      title: 'Quality Factors',
      description: 'Final prices depend on crop quality, moisture content, and market demand.'
    }
  ];

  return (
    <Card className="border-warning/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-warning-foreground">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Risks & Important Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {risks.map((risk, index) => (
            <div key={index} className="flex gap-3">
              <risk.icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">{risk.title}</p>
                <p className="text-sm text-muted-foreground">{risk.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 mt-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> This tool provides estimates based on mock data for educational purposes. 
            Actual market prices, transport costs, and storage losses may differ. Always verify current prices 
            at your local market before making selling decisions. We are not responsible for any financial 
            decisions made based on these calculations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
