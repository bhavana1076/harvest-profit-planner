import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calculator, Wheat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CROP_OPTIONS, CalculationInput, CalculationResult, MarketPrice } from '@/types';
import { calculateOptions } from '@/lib/calculations';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  cropName: z.string().min(1, 'Please select a crop'),
  quantityKg: z.coerce.number().min(1, 'Quantity must be at least 1 kg'),
  harvestDate: z.string().min(1, 'Please enter harvest date'),
  shelfLifeDays: z.coerce.number().min(1, 'Shelf life must be at least 1 day'),
  storageLossPercent: z.coerce.number().min(0).max(100, 'Must be 0-100%'),
  distanceMarketA: z.coerce.number().min(0, 'Distance must be positive'),
  distanceMarketB: z.coerce.number().min(0, 'Distance must be positive'),
  transportCostPerKm: z.coerce.number().min(0, 'Cost must be positive')
});

type FormValues = z.infer<typeof formSchema>;

interface HarvestCalculatorProps {
  marketPrices: MarketPrice[];
  onCalculate: (result: CalculationResult) => void;
}

export function HarvestCalculator({ marketPrices, onCalculate }: HarvestCalculatorProps) {
  const [selectedCrop, setSelectedCrop] = useState<string>('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropName: '',
      quantityKg: 100,
      harvestDate: new Date().toISOString().split('T')[0],
      shelfLifeDays: 14,
      storageLossPercent: 2,
      distanceMarketA: 25,
      distanceMarketB: 40,
      transportCostPerKm: 5
    }
  });

  const onSubmit = (values: FormValues) => {
    const prices = marketPrices.find(p => p.crop_name === values.cropName);
    if (!prices) return;

    const input: CalculationInput = {
      cropName: values.cropName,
      quantityKg: values.quantityKg,
      harvestDate: new Date(values.harvestDate),
      shelfLifeDays: values.shelfLifeDays,
      storageLossPercent: values.storageLossPercent,
      distanceMarketA: values.distanceMarketA,
      distanceMarketB: values.distanceMarketB,
      transportCostPerKm: values.transportCostPerKm
    };

    const result = calculateOptions(input, prices);
    onCalculate(result);
  };

  const currentPrices = marketPrices.find(p => p.crop_name === selectedCrop);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          Harvest Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cropName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedCrop(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CROP_OPTIONS.map(crop => (
                          <SelectItem key={crop} value={crop}>
                            <span className="flex items-center gap-2">
                              <Wheat className="h-4 w-4" />
                              {crop}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantityKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="harvestDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harvest Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shelfLifeDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shelf Life (days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storageLossPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Loss (%/day)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transportCostPerKm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transport Cost (₹/km)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="distanceMarketA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance to Market A (km)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="distanceMarketB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance to Market B (km)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {currentPrices && (
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-medium mb-2">Current Prices for {selectedCrop}:</p>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <p>Market A Today: ₹{currentPrices.market_a_price_today}/kg</p>
                  <p>Market B Today: ₹{currentPrices.market_b_price_today}/kg</p>
                  <p>Market A +7 days: ₹{currentPrices.market_a_price_7days}/kg</p>
                  <p>Market B +7 days: ₹{currentPrices.market_b_price_7days}/kg</p>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Best Option
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
