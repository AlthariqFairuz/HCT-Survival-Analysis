"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <main className="max-w-6xl w-full flex flex-col gap-8 items-center">
        {/* Hero Section */}
        <section className="w-full text-center py-12 md:py-24">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">HCT Survival Prediction Tool</h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            A clinical decision support system to identify high-risk patients after hematopoietic cell transplantation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg">Register</Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Accurate Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our model leverages 58+ clinical variables to provide highly accurate survival predictions following HCT procedures.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Risk Stratification</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Quickly identify patients at highest risk for complications, allowing for prompt intervention and personalized care plans.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Clinical Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Seamlessly integrates with clinical workflows, providing actionable insights at the point of care.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Enter Patient Data</h3>
              <p>Input comprehensive clinical parameters including disease characteristics and comorbidities.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Generate Prediction</h3>
              <p>Our advanced algorithm analyzes the data to calculate survival probability.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Review Results</h3>
              <p>Visualize survival curves and risk levels with confidence intervals.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4">4</div>
              <h3 className="text-xl font-semibold mb-2">Take Action</h3>
              <p>Implement targeted interventions for high-risk patients to improve outcomes.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join healthcare professionals worldwide using our tool to improve post-transplantation care.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="px-8">Create Account</Button>
          </Link>
        </section>
      </main>
    </div>
  );
}