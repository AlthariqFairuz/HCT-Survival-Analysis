import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const navbar = () => {
    return (
    <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">HCT Survival Prediction Tool</h1>
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
    </header>
    );
}

export default navbar;