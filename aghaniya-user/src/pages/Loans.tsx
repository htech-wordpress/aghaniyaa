import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollAnimation } from '@/components/ScrollAnimation';
// import { Card3D } from '@/components/Card3D';
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
    <div className="min-h-screen bg-slate-50">
      <div className="bg-hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="fade" delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Loan Products</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Choose from a wide range of loan products tailored to meet your financial aspirations.
            </p>
          </ScrollAnimation>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loans.map((loan, index) => {
            const Icon = loan.icon;
            return (
              <ScrollAnimation key={loan.id} direction="up" delay={index * 0.1} duration={0.6}>
                <Card className="hover:shadow-xl transition-all duration-300 h-full border-slate-100 bg-white group hover:-translate-y-1">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-slate-800">{loan.title}</CardTitle>
                    <CardDescription className="text-slate-500">{loan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {loan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm text-slate-600">
                          <span className="text-primary mr-3 mt-0.5">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to={`/loans/${loan.id}`}>
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all">
                        Apply Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </div>
  );
}

