import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function EMICalculatorButton() {
    return (
        <Link
            to="/emi-calculator"
            className="fixed bottom-6 left-6 z-[100]"
            aria-label="Calculate EMI"
        >
            <Button
                size="lg"
                className="h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none flex items-center justify-center"
            >
                <Calculator className="h-6 w-6" strokeWidth={2.5} />
            </Button>
        </Link>
    );
}
