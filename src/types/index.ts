export interface MarketPrice {
  id: string;
  crop_name: string;
  market_a_price_today: number;
  market_a_price_7days: number;
  market_b_price_today: number;
  market_b_price_7days: number;
  updated_at: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  region: string | null;
  active: boolean;
  created_at: string;
  expires_at: string | null;
}

export interface CalculationInput {
  cropName: string;
  quantityKg: number;
  harvestDate: Date;
  shelfLifeDays: number;
  storageLossPercent: number;
  distanceMarketA: number;
  distanceMarketB: number;
  transportCostPerKm: number;
}

export interface CalculationOption {
  market: 'A' | 'B';
  timing: 'now' | '7days';
  label: string;
  usableQty: number;
  pricePerKg: number;
  grossRevenue: number;
  transportCost: number;
  storageLoss: number;
  netRevenue: number;
}

export interface CalculationResult {
  options: CalculationOption[];
  bestOption: CalculationOption;
  input: CalculationInput;
}

export interface Profile {
  id: string;
  user_id: string;
  farm_name: string | null;
  location: string | null;
  preferred_crops: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface SavedCalculation {
  id: string;
  user_id: string;
  crop_name: string;
  quantity_kg: number;
  harvest_date: string;
  shelf_life_days: number;
  storage_loss_percent: number;
  distance_market_a: number;
  distance_market_b: number;
  transport_cost_per_km: number;
  best_option: string;
  best_revenue: number;
  calculation_details: CalculationResult;
  created_at: string;
}

export type CropType = 'Wheat' | 'Rice' | 'Corn' | 'Barley' | 'Sorghum' | 'Millet';

export const CROP_OPTIONS: CropType[] = ['Wheat', 'Rice', 'Corn', 'Barley', 'Sorghum', 'Millet'];
