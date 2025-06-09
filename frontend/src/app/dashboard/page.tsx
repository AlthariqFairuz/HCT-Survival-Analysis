'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import Navbar from '@/components/ui/navbar';

interface PredictionForm {
  donor_age: string;
  age_at_hct: string;
  prim_disease_hct: string;
  year_hct: string;
  dri_score: string;
  comorbidity_score: string;
  gvhd_proph: string;
  karnofsky_score: string;
  race_group: string;
  cyto_score: string;
}

interface PredictionResult {
  survival_probability: number;
  risk_category: string;
  confidence_interval: [number, number];
  recommendations: string[];
}

export default function PredictionDashboard() {
  const [formData, setFormData] = useState<PredictionForm>({
    donor_age: '',
    age_at_hct: '',
    prim_disease_hct: '',
    year_hct: new Date().getFullYear().toString(),
    dri_score: '',
    comorbidity_score: '',
    gvhd_proph: '',
    karnofsky_score: '',
    race_group: '',
    cyto_score: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof PredictionForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              HCT Survival Prediction
            </h2>
            <p className="text-muted-foreground text-lg">
              Enter patient information to generate survival probability predictions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Prediction Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                  <CardDescription>
                    Please fill in the following key clinical parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Donor Age */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Donor Age (years)</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.donor_age}
                          onChange={(e) => handleInputChange('donor_age', e.target.value)}
                          placeholder="e.g., 35"
                          required
                        />
                      </div>

                      {/* Patient Age at HCT */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Patient Age at HCT (years)</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.age_at_hct}
                          onChange={(e) => handleInputChange('age_at_hct', e.target.value)}
                          placeholder="e.g., 45"
                          required
                        />
                      </div>

                      {/* Primary Disease */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Primary Disease</label>
                        <Select value={formData.prim_disease_hct} onValueChange={(value) => handleInputChange('prim_disease_hct', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select disease" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aml">AML</SelectItem>
                            <SelectItem value="all">ALL</SelectItem>
                            <SelectItem value="mds">MDS</SelectItem>
                            <SelectItem value="cml">CML</SelectItem>
                            <SelectItem value="lymphoma">Lymphoma</SelectItem>
                            <SelectItem value="multiple_myeloma">Multiple Myeloma</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Year of HCT */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Year of HCT</label>
                        <Input
                          type="number"
                          min="2000"
                          max="2025"
                          value={formData.year_hct}
                          onChange={(e) => handleInputChange('year_hct', e.target.value)}
                          placeholder="e.g., 2024"
                          required
                        />
                      </div>

                      {/* DRI Score */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">DRI Score</label>
                        <Select value={formData.dri_score} onValueChange={(value) => handleInputChange('dri_score', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select DRI score" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="very_high">Very High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Comorbidity Score */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Comorbidity Score (HCT-CI)</label>
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          value={formData.comorbidity_score}
                          onChange={(e) => handleInputChange('comorbidity_score', e.target.value)}
                          placeholder="e.g., 3"
                          required
                        />
                      </div>

                      {/* GVHD Prophylaxis */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">GVHD Prophylaxis</label>
                        <Select value={formData.gvhd_proph} onValueChange={(value) => handleInputChange('gvhd_proph', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select GVHD prophylaxis" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tacrolimus_mtx">Tacrolimus + MTX</SelectItem>
                            <SelectItem value="cyclosporine_mtx">Cyclosporine + MTX</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Karnofsky Score */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Karnofsky Performance Score</label>
                        <Select value={formData.karnofsky_score} onValueChange={(value) => handleInputChange('karnofsky_score', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select KPS" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="90-100">90-100 (Normal activity)</SelectItem>
                            <SelectItem value="80">80 (Normal activity with effort)</SelectItem>
                            <SelectItem value="70">70 (Care for self, unable to work)</SelectItem>
                            <SelectItem value="60">60 (Requires occasional assistance)</SelectItem>
                            <SelectItem value="<60">&lt;60 (Requires considerable assistance)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Race Group */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Race/Ethnicity</label>
                        <Select value={formData.race_group} onValueChange={(value) => handleInputChange('race_group', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select race/ethnicity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="caucasian">Caucasian</SelectItem>
                            <SelectItem value="hispanic">Hispanic</SelectItem>
                            <SelectItem value="african_american">African American</SelectItem>
                            <SelectItem value="asian">Asian</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Cytogenetic Score */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cytogenetic Risk Score</label>
                        <Select value={formData.cyto_score} onValueChange={(value) => handleInputChange('cyto_score', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cytogenetic risk" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="favorable">Favorable</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                            <SelectItem value="very_poor">Very Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Prediction...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Generate Prediction
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Prediction Results</CardTitle>
                  <CardDescription>
                    Survival probability and risk assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="flex items-center p-4 text-red-800 bg-red-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 mr-3" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  {result && (
                    <div className="space-y-4">
                      {/* Survival Probability */}
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-3xl font-bold text-primary">
                          {(result.survival_probability * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          5-Year Survival Probability
                        </div>
                      </div>

                      {/* Risk Category */}
                      <div className="flex items-center justify-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(result.risk_category)}`}>
                          {result.risk_category.charAt(0).toUpperCase() + result.risk_category.slice(1)} Risk
                        </span>
                      </div>

                      {/* Confidence Interval */}
                      <div className="text-center text-sm text-muted-foreground">
                        95% CI: {(result.confidence_interval[0] * 100).toFixed(1)}% - {(result.confidence_interval[1] * 100).toFixed(1)}%
                      </div>

                      {/* Recommendations */}
                      {result.recommendations && result.recommendations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Recommendations:</h4>
                          <ul className="space-y-1">
                            {result.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {!result && !error && !isLoading && (
                    <div className="text-center text-muted-foreground py-8">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Fill in the patient information to generate a prediction</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t p-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 HCT Survival Prediction Tool. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}