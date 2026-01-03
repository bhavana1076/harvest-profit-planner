import { History, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SavedCalculation } from '@/types';
import { formatCurrency } from '@/lib/calculations';
import { format } from 'date-fns';

interface CalculationHistoryProps {
  calculations: SavedCalculation[];
  onDelete: (id: string) => void;
}

export function CalculationHistory({ calculations, onDelete }: CalculationHistoryProps) {
  if (calculations.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-5 w-5 text-primary" />
            Calculation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No calculations saved yet. Your calculations will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-5 w-5 text-primary" />
          Calculation History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {calculations.slice(0, 5).map(calc => (
          <div
            key={calc.id}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">
                {calc.crop_name} - {calc.quantity_kg} kg
              </p>
              <p className="text-xs text-muted-foreground">
                {calc.best_option} • {formatCurrency(calc.best_revenue)}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(calc.created_at), 'MMM d, yyyy')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(calc.id)}
              className="flex-shrink-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
