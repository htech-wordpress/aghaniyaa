import { Link } from 'react-router-dom';
import { Menu, X, Calculator, FileSearch } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/Aghaniya logo.svg"
              alt="AGHANIYA Logo"
              className="h-16 w-auto object-contain rounded-full shadow-lg"
            />
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-primary leading-tight tracking-tight">AGHANIYA</span>
              <span className="text-[10px] md:text-xs font-medium text-green-500 tracking-wider italic">Har Deal, Secure & Simple</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
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
          <div className="md:hidden fixed inset-0 top-20 z-50 bg-white border-t animate-in slide-in-from-top-5 duration-200">
            <div className="flex flex-col p-4 space-y-4 h-[calc(100vh-5rem)] overflow-y-auto pb-20">
              <Link
                to="/"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-lg font-medium text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
                <span className="text-slate-400">→</span>
              </Link>
              <Link
                to="/loans"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-lg font-medium text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Loans
                <span className="text-slate-400">→</span>
              </Link>
              <Link
                to="/credit-cards"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-lg font-medium text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Credit Cards
                <span className="text-slate-400">→</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-lg font-medium text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
                <span className="text-slate-400">→</span>
              </Link>
              <Link
                to="/our-team"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-lg font-medium text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Team
                <span className="text-slate-400">→</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-lg font-medium text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
                <span className="text-slate-400">→</span>
              </Link>
              <Link
                to="/careers"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-lg font-medium text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Careers
                <span className="text-slate-400">→</span>
              </Link>

              <div className="pt-4 border-t space-y-3">
                <Link
                  to="/cibil-check"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button variant="outline" size="lg" className="w-full justify-center gap-2 text-base h-12">
                    <FileSearch className="h-5 w-5" />
                    Check CIBIL
                  </Button>
                </Link>
                <Link
                  to="/emi-calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button size="lg" className="w-full justify-center gap-2 text-base h-12">
                    <Calculator className="h-5 w-5" />
                    Calculate EMI
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

