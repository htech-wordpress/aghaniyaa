import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/Aghaniya logo.svg"
                alt="AGHANIYA ENTERPRISES Logo"
                className="h-12 w-auto object-contain rounded-full bg-white p-1"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-tight tracking-tight">AGHANIYA ENTERPRISES</span>
                <span className="text-[10px] font-medium text-green-500 tracking-wider italic">Har Deal, Secure & Simple</span>
              </div>
            </Link>
            <p className="text-sm mb-6">
              India's Leading Loan Distribution Company. Connecting customers with the best financial products.
            </p>

            <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
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
              {/* <li>
                <Link to="/credit-cards" className="hover:text-white transition-colors">Credit Cards</Link>
              </li> */}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Loans</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/loans/home-loan" className="hover:text-white transition-colors">Home Loan</Link>
              </li>
              <li>
                <Link to="/loans/personal-loan" className="hover:text-white transition-colors">Personal Loan</Link>
              </li>
              <li>
                <Link to="/loans/business-loan" className="hover:text-white transition-colors">Business Loan</Link>
              </li>
              <li>
                <Link to="/loans/car-loan" className="hover:text-white transition-colors">Car Loan</Link>
              </li>
              <li>
                <Link to="/loans/education-loan" className="hover:text-white transition-colors">Education Loan</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>1800-266-7576</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@aghaniya.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Aghaniya Enterprises LLP, Sohrab Hall<br />
                    2nd Floor, Near Pune Station<br />
                    Pune - 411001, India</p></span>
              </li>
            </ul>


          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 AGHANIYA ENTERPRISES - All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

