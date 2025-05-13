"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/ui/navbar';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <section className="text-center py-8 md:py-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">HCT Survival Prediction</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A clinical decision support system to identify high-risk patients after hematopoietic cell transplantation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto px-8 transition-transform duration-300 hover:scale-105">Get Started</Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8 text-center transition-all duration-300 hover:text-primary">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
              <CardHeader>
                <CardTitle>Accurate Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our model leverages 58+ clinical variables to provide highly accurate survival predictions following HCT procedures.</p>
              </CardContent>
            </Card>
            
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
              <CardHeader>
                <CardTitle>Risk Stratification</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Quickly identify patients at highest risk for complications, allowing for prompt intervention and personalized care plans.</p>
              </CardContent>
            </Card>
            
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
              <CardHeader>
                <CardTitle>Helpful Chatbot</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Afraid to consult to a doctor? Don&apos;t worry, we got you, you can chat with our chatbot first if you want. It&apos;s free.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 bg-muted rounded-xl p-6">
          <h2 className="text-3xl font-bold mb-8 text-center transition-all duration-300 hover:text-primary">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Enter Patient Data",
                description: "Input comprehensive clinical parameters including disease characteristics and comorbidities."
              },
              {
                step: 2,
                title: "Generate Prediction",
                description: "Our advanced algorithm analyzes the data to calculate survival probability."
              },
              {
                step: 3,
                title: "Review Results",
                description: "Visualize survival curves and risk levels with confidence intervals."
              },
              {
                step: 4,
                title: "Take Action",
                description: "Implement targeted interventions for high-risk patients to improve outcomes."
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4 transition-all duration-300 hover:scale-110 hover:bg-background hover:rounded-xl hover:shadow-md">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join healthcare professionals worldwide using our tool to improve post-transplantation care.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="px-8 transition-all duration-300 hover:scale-110 hover:shadow-lg">Get Started</Button>
          </Link>
        </section>
      </main>
    </div>
  );
}