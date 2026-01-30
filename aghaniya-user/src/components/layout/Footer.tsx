import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { subscribeToStats, type CompanyStats, defaultStats } from '@/lib/stats';
import { useState, useEffect } from 'react';

export function Footer() {
  const [stats, setStats] = useState<CompanyStats>(defaultStats);

  useEffect(() => {
    const unsubscribe = subscribeToStats(setStats);
    return () => unsubscribe();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/Aghaniya logo.svg"
                alt="Aghaniya Enterprises LLP Logo"
                className="h-12 w-auto object-contain rounded-full bg-white p-1"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-tight tracking-tight">Aghaniya Enterprises LLP</span>
                <span className="text-[10px] font-medium text-green-500 tracking-wider italic">Har Deal, Secure & Simple</span>
              </div>
            </Link>
            <p className="text-sm mb-6">
              India's Leading Loan Distribution Company. Connecting customers with the best financial products.
            </p>

            <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/aghaniyaenterprises" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://twitter.com/aghaniya" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/aghaniyaenterprises" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/company/aghaniya-enterprises-llp" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://youtube.com/@aghaniya" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/our-team" className="hover:text-white transition-colors">Our Team</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/loans" className="hover:text-white transition-colors">Loans</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Loans</h4>
            <ul className="space-y-2 text-sm">
              {stats.loanProducts?.filter(p => p.featured).map((loan) => (
                <li key={loan.id}>
                  <Link to={loan.route || `/loans/${loan.id}`} className="hover:text-white transition-colors">
                    {loan.title}
                  </Link>
                </li>
              ))}
              {(!stats.loanProducts || stats.loanProducts.filter(p => p.featured).length === 0) && (
                <li>
                  <Link to="/loans" className="hover:text-white transition-colors">View All Loans</Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 70585 19247</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 62033 01532</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>aghaniyaenterprises@gmail.com</span>
              </li>
              {stats.addresses && stats.addresses.map((address) => (
                <li key={address.id} className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span>
                    <p className="text-sm text-slate-400 leading-relaxed font-semibold text-slate-300 mb-0.5">{address.label}</p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {address.value}
                    </p>
                    {address.phone && <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Phone className="h-3 w-3" /> {address.phone}</p>}
                  </span>
                </li>
              ))}
            </ul>


          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Aghaniya Enterprises LLP - All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

