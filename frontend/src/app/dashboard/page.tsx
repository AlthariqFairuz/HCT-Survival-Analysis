'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Bell, Clock, ChevronRight } from 'lucide-react';
import Navbar from '@/components/ui/navbar';

export default function DashboardComingSoon() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Set launch date to 30 days from now
  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(timer);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to save email
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 container mx-auto py-12 px-4 flex flex-col items-center justify-center">
        <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Advanced Dashboard
            <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Coming Soon
            </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
            We&apos;re building a comprehensive analytics dashboard to help clinicians visualize patient outcomes 
            and track treatment efficacy. Stay tuned for powerful insights and data visualization tools.
            </p>
            
            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
                <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Risk Alerts</h3>
                <p className="text-muted-foreground">Automated notifications for high-risk patients requiring immediate attention.</p>
                </CardContent>
            </Card>
            
            <Card>
                <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Survival Tracking</h3>
                <p className="text-muted-foreground">Monitor patient outcomes over time with interactive survival curves.</p>
                </CardContent>
            </Card>
            
            <Card>
                <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <ChevronRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Treatment Insights</h3>
                <p className="text-muted-foreground">Evidence-based recommendations tailored to each patient&apos;s risk profile.</p>
                </CardContent>
            </Card>
            </div>
        
            {/* Countdown */}
            <Card className="mb-12">
            <CardHeader>
                <CardTitle>Dashboard Launch Countdown</CardTitle>
                <CardDescription>Our team is working hard to deliver this feature soon</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-muted rounded-lg p-4">
                    <div className="text-3xl font-bold">{countdown.days}</div>
                    <div className="text-xs uppercase text-muted-foreground">Days</div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                    <div className="text-3xl font-bold">{countdown.hours}</div>
                    <div className="text-xs uppercase text-muted-foreground">Hours</div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                    <div className="text-3xl font-bold">{countdown.minutes}</div>
                    <div className="text-xs uppercase text-muted-foreground">Minutes</div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                    <div className="text-3xl font-bold">{countdown.seconds}</div>
                    <div className="text-xs uppercase text-muted-foreground">Seconds</div>
                </div>
                </div>
            </CardContent>
            </Card>
            
            {/* Notification Signup */}
            <Card>
            <CardHeader>
                <CardTitle>Get Notified When We Launch</CardTitle>
                <CardDescription>
                Be the first to know when our advanced dashboard is ready
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                    <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-grow"
                    disabled={isSubmitting}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                        </>
                    ) : (
                        "Notify Me"
                    )}
                    </Button>
                </form>
                ) : (
                <div className="bg-primary/10 text-primary p-4 rounded-md text-center">
                    Thank you! We&apos;ll notify you when the dashboard launches.
                </div>
                )}
            </CardContent>
            </Card>
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