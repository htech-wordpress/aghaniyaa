import { Link } from 'react-router-dom';
import { Menu, X, Calculator, FileSearch } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/Aghaniya logo.svg"
              alt="AGHANIYA Logo"
              className="h-10 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {/* <Link to="/" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
              Home
            </Link> */}
            <Link to="/loans" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors">
              Loans
            </Link>
            <Link to="/credit-cards" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors">
              Credit Cards
            </Link>
            <Link to="/about" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors">
              About Us
            </Link>
            <Link to="/our-team" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors">
              Our Team
            </Link>
            <Link to="/contact" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors">
              Contact Us
            </Link>
            <Link to="/careers" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors">
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
              className="block text-sm font-medium text-gray-900 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/loans"
              className="block text-sm font-medium text-gray-900 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Loans
            </Link>
            <Link
              to="/credit-cards"
              className="block text-sm font-medium text-gray-900 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Credit Cards
            </Link>
            <Link
              to="/about"
              className="block text-sm font-medium text-gray-900 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/our-team"
              className="block text-sm font-medium text-gray-900 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Our Team
            </Link>
            <Link
              to="/contact"
              className="block text-sm font-medium text-gray-900 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              to="/careers"
              className="block text-sm font-medium text-gray-900 hover:text-primary"
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

