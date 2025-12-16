import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home as HomeIcon, Building2, Briefcase, GraduationCap, Car, Gem, Landmark } from 'lucide-react';

const loans = [
  {
    id: 'home-loan',
    title: 'Home Loan',
    description: 'Your Dream Home Awaits - Explore Our Range Of Home Loan Products.',
    icon: HomeIcon,
    features: ['Low interest rates', 'Flexible repayment options', 'Quick approval', 'Up to 90% financing'],
  },
  {
    id: 'loan-against-property',
    title: 'Loan against Property',
    description: 'Unlock your property\'s value with tailored loan solutions.',
    icon: Landmark,
    features: ['High loan amount', 'Long tenure', 'Competitive rates', 'Easy documentation'],
  },
  {
    id: 'personal-loan',
    title: 'Personal Loan',
    description: 'Achieve your dreams with our versatile personal loan options.',
    icon: Briefcase,
    features: ['No collateral required', 'Instant approval', 'Flexible tenure', 'Quick disbursal'],
  },
  {
    id: 'business-loan',
    title: 'Business Loan',
    description: 'Boost your business growth with our flexible financing options.',
    icon: Building2,
    features: ['Working capital support', 'Business expansion', 'Competitive rates', 'Fast processing'],
  },
  {
    id: 'education-loan',
    title: 'Education Loan',
    description: 'Invest in your child\'s future with our specialized education loans.',
    icon: GraduationCap,
    features: ['Coverage for tuition fees', 'Moratorium period', 'Tax benefits', 'Flexible repayment'],
  },
  {
    id: 'car-loan',
    title: 'Car Loan',
    description: 'Drive your dream car with our quick and flexible car loans.',
    icon: Car,
    features: ['New & used cars', 'Low interest rates', 'Quick approval', 'No prepayment charges'],
  },
  {
    id: 'gold-loan',
    title: 'Gold Loan',
    description: 'Meet your financial needs with gold loans from trusted banks.',
    icon: Gem,
    features: ['Instant disbursal', 'Minimum documentation', 'Competitive rates', 'Flexible repayment'],
  },
];

export function Loans() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Loans</h1>
          <p className="text-xl text-gray-600">
            Choose from a wide range of loan products to suit your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((loan) => {
            const Icon = loan.icon;
            return (
              <Card key={loan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-2xl">{loan.title}</CardTitle>
                  <CardDescription>{loan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {loan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <span className="text-primary mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={`/loans/${loan.id}`}>
                    <Button className="w-full">Apply Now</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

