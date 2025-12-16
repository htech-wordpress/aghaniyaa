import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, MapPin, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Building2, value: '25+', label: 'Years of Experience', color: 'text-blue-600' },
  { icon: Users, value: '275+', label: 'Financial Institution Partners', color: 'text-green-600' },
  { icon: MapPin, value: '4,000+', label: 'Cities Through A Wide Branch Network', color: 'text-purple-600' },
  { icon: TrendingUp, value: '₹1.4 Lakh Cr+', label: 'In Loans Disbursed', color: 'text-red-600' },
];

export function About() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AGHANIYA – India's Leading Loan Distribution Company
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Connecting customers with the best financial products from India's top lenders
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Icon className={`h-16 w-16 mx-auto mb-4 ${stat.color}`} />
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-lg text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* About Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  At AGHANIYA, we are committed to helping clients reach their financial objectives with tailored solutions. 
                  With a PAN India presence in over 4,000 cities, we stand as one of the nation's leading credit lending establishments.
                </p>
                <p className="text-lg leading-relaxed">
                  Founded by financial professionals with over 25 years of experience, we've proudly served over 1 million clients, 
                  disbursing loans exceeding 1.4 Lakh Crores through our partnerships with 275+ Financial Institution Partners.
                </p>
                <p className="text-lg leading-relaxed">
                  Our mission is to make financial products accessible to everyone, providing seamless experiences and connecting 
                  customers with the best loan and credit card options available in the market.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To democratize access to financial products and services, ensuring that every individual and business 
                has the opportunity to achieve their financial goals through our comprehensive network of trusted partners.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To be India's most trusted and preferred loan distribution platform, recognized for our transparency, 
                customer-centric approach, and commitment to excellence in financial services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AGHANIYA?</h2>
              <ul className="space-y-3 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>25+ years of industry experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Partnerships with 275+ financial institutions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>PAN India presence in 4,000+ cities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Competitive interest rates and flexible terms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Quick loan processing and approval</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Dedicated customer support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Wide range of financial products</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

