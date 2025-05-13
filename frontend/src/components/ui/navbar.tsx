'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only run client-side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="border-b p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold transition-all duration-300 hover:text-primary">HCT Survival Prediction Tool</h1>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-foreground hover:text-primary transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors relative group">
            Dashboard
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        {mounted && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu size={24} className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
              <X size={24} className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
            </div>
          </Button>
        )}
      </div>

      {/* Mobile Navigation with CSS-only initial state */}
      {mounted && (
        <div 
          className={`md:hidden fixed left-0 right-0 bg-background border-b z-50 shadow-lg transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ top: '60px' }}
        >
          <nav className="container mx-auto py-4 flex flex-col gap-4">
            <Link 
              href="/" 
              className="px-4 py-2 hover:bg-accent rounded-md transition-all duration-300 hover:pl-6"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className="px-4 py-2 hover:bg-accent rounded-md transition-all duration-300 hover:pl-6"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Button 
              variant="ghost" 
              className="justify-start px-4" 
              onClick={() => {
                window.history.back();
                setIsMenuOpen(false);
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;