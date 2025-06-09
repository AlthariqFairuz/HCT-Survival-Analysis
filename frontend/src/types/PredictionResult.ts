export interface PredictionResult {
  survival_probability: number;
  risk_category: string;
  confidence_interval: [number, number];
  recommendations: string[];
}