import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">AGHANIYA</h3>
            <p className="text-sm">
              India's Leading Loan Distribution Company. Connecting customers with the best financial products.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/loans" className="hover:text-white transition-colors">Loans</Link>
              </li>
              <li>
                <Link to="/credit-cards" className="hover:text-white transition-colors">Credit Cards</Link>
              </li>
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
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 AGHANIYA - All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

