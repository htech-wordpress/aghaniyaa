import { Link } from 'react-router-dom';
import { Menu, X, Calculator, FileSearch } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-200 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" aria-label="AGHANIYA Home" title="AGHANIYA - Home" className="flex items-center space-x-3">
            <img
              src="/Aghaniya logo.svg"
              alt="AGHANIYA Logo"
              className="h-14 w-auto transition-transform transform hover:scale-105 drop-shadow"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/loans" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              Loans
            </Link>
            <Link to="/credit-cards" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              Credit Cards
            </Link>
            <Link to="/about" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              About Us
            </Link>
            <Link to="/our-team" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              Our Team
            </Link>
            <Link to="/contact" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              Contact Us
            </Link>
            <Link to="/careers" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              Careers
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/cibil-check">
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                <FileSearch className="h-4 w-4" />
                Check CIBIL
              </Button>
            </Link>
            <Link to="/emi-calculator">
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Calculate EMI
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle menu"
              title="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <Link
              to="/"
              className="block text-sm font-medium text-gray-900 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/loans"
              className="block text-sm font-medium text-gray-900 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Loans
            </Link>
            <Link
              to="/credit-cards"
              className="block text-sm font-medium text-gray-900 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Credit Cards
            </Link>
            <Link
              to="/about"
              className="block text-sm font-medium text-gray-900 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/our-team"
              className="block text-sm font-medium text-gray-900 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Our Team
            </Link>
            <Link
              to="/contact"
              className="block text-sm font-medium text-gray-900 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              to="/careers"
              className="block text-sm font-medium text-gray-900 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Careers
            </Link>
            <Link
              to="/cibil-check"
              className="block text-sm font-medium text-gray-700 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Check CIBIL
            </Link>
            <Link
              to="/cibil-check"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button variant="outline" size="sm" className="w-full items-center gap-2">
                <FileSearch className="h-4 w-4" />
                Check CIBIL
              </Button>
            </Link>
            <Link
              to="/emi-calculator"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button variant="outline" size="sm" className="w-full items-center gap-2">
                <Calculator className="h-4 w-4" />
                Calculate EMI
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

