import { Link } from 'react-router-dom';
import { Menu, X, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Imports added at the top
import { subscribeToStats, type CompanyStats, defaultStats } from '@/lib/stats';
import { useEffect } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const [stats, setStats] = useState<CompanyStats>(defaultStats);

  useEffect(() => {
    const unsubscribe = subscribeToStats(setStats);
    return () => unsubscribe();
  }, []);

  const featuredLoans = stats.loanProducts?.filter(p => p.featured) || [];

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <img
              src="/Aghaniya logo.svg"
              alt="Aghaniya Enterprises LLP Logo"
              className="h-10 md:h-16 w-auto object-contain rounded-full shadow-lg"
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl lg:text-2xl font-bold text-primary leading-tight tracking-tight">Aghaniya Enterprises LLP</span>
              <span className="text-[9px] md:text-xs font-medium text-green-500 tracking-wider italic">Har Deal, Secure & Simple</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium text-gray-900 hover:text-primary transition-colors focus:outline-none flex items-center gap-1">
                Loans <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuItem asChild>
                  <Link to="/loans" className="w-full cursor-pointer font-semibold">View All Loans</Link>
                </DropdownMenuItem>
                {featuredLoans.length > 0 && <div className="h-px bg-slate-100 my-1" />}
                {featuredLoans.map((loan) => (
                  <DropdownMenuItem key={loan.id} asChild>
                    <Link to={loan.route || `/loans/${loan.id}`} className="w-full cursor-pointer">
                      {loan.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <Link to="/cibil-check" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors">
              Check CIBIL
            </Link> */}
            {/* <Link to="/credit-cards" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors">
              Credit Cards
            </Link> */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium text-gray-900 hover:text-primary transition-colors focus:outline-none flex items-center gap-1">
                Company <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuItem asChild>
                  <Link to="/about" className="w-full cursor-pointer">About Us</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/our-team" className="w-full cursor-pointer">Our Team</Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild>
                  <Link to="/certificates-awards" className="w-full cursor-pointer">Certificates & Awards</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/media" className="w-full cursor-pointer">We Are In Media</Link>
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/careers" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors">
              Careers
            </Link>
            <Link to="/contact" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors">
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* <Link to="/becomedsa">
              <Button variant="default" size="sm" className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Become a DSA
              </Button>
            </Link> */}

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
          <div className="md:hidden fixed inset-0 top-16 md:top-20 z-40 bg-white border-t animate-in slide-in-from-top-5 duration-200 overflow-x-hidden">
            <div className="w-full px-6 py-6 h-[calc(100vh-4rem)] overflow-y-auto pb-20 flex flex-col space-y-2">
              <Link
                to="/"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-lg font-medium text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
                <span className="text-slate-400">→</span>
              </Link>
              {/* Loans Accordion */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setMobileExpanded(prev => ({ ...prev, loans: !prev.loans }))}
                  className="flex items-center justify-between w-full p-3 text-lg font-medium text-slate-900"
                >
                  Loans
                  {mobileExpanded.loans ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>
                {mobileExpanded.loans && (
                  <div className="bg-slate-50 px-4 py-2 space-y-2">
                    <Link
                      to="/loans"
                      className="block p-2 text-base font-medium text-slate-700 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      View All Loans
                    </Link>
                    {featuredLoans.length > 0 && <div className="h-px bg-slate-200 my-1" />}
                    {featuredLoans.map((loan) => (
                      <Link
                        key={loan.id}
                        to={loan.route || `/loans/${loan.id}`}
                        className="block p-2 text-sm text-slate-600 hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {loan.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Company Accordion */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setMobileExpanded(prev => ({ ...prev, company: !prev.company }))}
                  className="flex items-center justify-between w-full p-3 text-lg font-medium text-slate-900"
                >
                  Company
                  {mobileExpanded.company ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>
                {mobileExpanded.company && (
                  <div className="bg-slate-50 px-4 py-2 space-y-2">
                    <Link
                      to="/about"
                      className="block p-2 text-base font-medium text-slate-700 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link
                      to="/our-team"
                      className="block p-2 text-base font-medium text-slate-700 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Our Team
                    </Link>
                  </div>
                )}
              </div>
              {/* <Link
                to="/testimonials"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-lg font-medium text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
                <span className="text-slate-400">→</span>
              </Link> */}
              <Link
                to="/careers"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-lg font-medium text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Careers
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
              {/* <Link
                to="/become-dsa"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-lg font-medium text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Become a DSA
                <span className="text-blue-400">→</span>
              </Link> */}

              <div className="pt-4 border-t space-y-3">

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

