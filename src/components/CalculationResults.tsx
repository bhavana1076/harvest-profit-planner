import { Check, TrendingUp, Truck, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalculationResult } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/calculations';
import { cn } from '@/lib/utils';

interface CalculationResultsProps {
  result: CalculationResult;
}

export function CalculationResults({ result }: CalculationResultsProps) {
  const { options, bestOption, input } = result;

  return (
    <div className="space-y-4">
      {/* Best Option Highlight */}
      <Card className="border-2 border-success bg-success/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-success">
            <Check className="h-5 w-5" />
            Recommended: {bestOption.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-background rounded-lg">
              <p className="text-2xl font-bold text-success">{formatCurrency(bestOption.netRevenue)}</p>
              <p className="text-xs text-muted-foreground">Net Revenue</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <p className="text-lg font-semibold">{formatNumber(bestOption.usableQty)} kg</p>
              <p className="text-xs text-muted-foreground">Usable Quantity</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <p className="text-lg font-semibold">₹{bestOption.pricePerKg}/kg</p>
              <p className="text-xs text-muted-foreground">Price</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <p className="text-lg font-semibold">{formatCurrency(bestOption.transportCost)}</p>
              <p className="text-xs text-muted-foreground">Transport</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-primary" />
            All Options Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Option</TableHead>
                  <TableHead className="text-right">Usable Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Transport</TableHead>
                  <TableHead className="text-right">Net Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {options.map((option, index) => (
                  <TableRow
                    key={index}
                    className={cn(
                      option === bestOption && 'bg-success/10 font-medium'
                    )}
                  >
                    <TableCell className="flex items-center gap-2">
                      {option === bestOption && <Check className="h-4 w-4 text-success" />}
                      {option.label}
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(option.usableQty)} kg</TableCell>
                    <TableCell className="text-right">₹{option.pricePerKg}</TableCell>
                    <TableCell className="text-right">{formatCurrency(option.transportCost)}</TableCell>
                    <TableCell className={cn(
                      "text-right font-semibold",
                      option === bestOption && "text-success"
                    )}>
                      {formatCurrency(option.netRevenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Route Plan */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Truck className="h-5 w-5 text-primary" />
            Route Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={cn(
              "p-4 rounded-lg border",
              bestOption.market === 'A' ? "border-success bg-success/5" : "border-border"
            )}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Market A</h4>
                {bestOption.market === 'A' && (
                  <span className="text-xs bg-success text-success-foreground px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold">{input.distanceMarketA} km</p>
              <p className="text-sm text-muted-foreground">
                ~{Math.round(input.distanceMarketA / 40 * 60)} min travel time
              </p>
            </div>
            <div className={cn(
              "p-4 rounded-lg border",
              bestOption.market === 'B' ? "border-success bg-success/5" : "border-border"
            )}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Market B</h4>
                {bestOption.market === 'B' && (
                  <span className="text-xs bg-success text-success-foreground px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold">{input.distanceMarketB} km</p>
              <p className="text-sm text-muted-foreground">
                ~{Math.round(input.distanceMarketB / 40 * 60)} min travel time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
