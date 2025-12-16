import { Link } from 'react-router-dom';
import { BannerSlider } from '@/components/BannerSlider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home as HomeIcon, Building2, Briefcase, GraduationCap, Car, CreditCard, Gem, Landmark } from 'lucide-react';

const loanTypes = [
  {
    id: 'home-loan',
    title: 'Home Loan',
    description: 'Your Dream Home Awaits - Explore Our Range Of Home Loan Products.',
    icon: HomeIcon,
    link: '/loans/home-loan',
  },
  {
    id: 'loan-against-property',
    title: 'Loan against Property',
    description: 'Unlock your property\'s value with tailored loan solutions.',
    icon: Landmark,
    link: '/loans/loan-against-property',
  },
  {
    id: 'personal-loan',
    title: 'Personal Loan',
    description: 'Achieve your dreams with our versatile personal loan options.',
    icon: Briefcase,
    link: '/loans/personal-loan',
  },
  {
    id: 'business-loan',
    title: 'Business Loan',
    description: 'Boost your business growth with our flexible financing options.',
    icon: Building2,
    link: '/loans/business-loan',
  },
  {
    id: 'education-loan',
    title: 'Education Loan',
    description: 'Invest in your child\'s future with our specialized education loans.',
    icon: GraduationCap,
    link: '/loans/education-loan',
  },
  {
    id: 'car-loan',
    title: 'Car Loan',
    description: 'Drive your dream car with our quick and flexible car loans.',
    icon: Car,
    link: '/loans/car-loan',
  },
  {
    id: 'gold-loan',
    title: 'Gold Loan',
    description: 'Meet your financial needs with gold loans from trusted banks.',
    icon: Gem,
    link: '/loans/gold-loan',
  },
  {
    id: 'credit-cards',
    title: 'Credit Cards',
    description: 'Upgrade your lifestyle with feature-packed, rewarding credit cards.',
    icon: CreditCard,
    link: '/credit-cards',
  },
];

const stats = [
  { value: '25+', label: 'Years of Experience' },
  { value: '275+', label: 'Financial Institution Partners' },
  { value: '4,000+', label: 'Cities Through A Wide Branch Network' },
  { value: '₹1.4 Lakh Cr+', label: 'In Loans Disbursed' },
];

const partners = [
  'Bajaj Finserv',
  'Edelweiss',
  'Piramal Finance',
  'RBL Bank',
  'SMFG India Credit',
  'ICICI Bank',
  'HDFC Bank',
  'Axis Bank',
  'Kotak Bank',
  'SBI',
];

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Banner Slider */}
      <section className="container mx-auto px-4 py-8">
        <BannerSlider />
      </section>

      {/* We Facilitate Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">We Facilitate</h2>
          <p className="text-xl text-gray-600">
            Wide Range of Financial Products That suits your customer's needs!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loanTypes.map((loan) => {
            const Icon = loan.icon;
            return (
              <Card key={loan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{loan.title}</CardTitle>
                  <CardDescription>{loan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={loan.link}>
                    <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-white">
                      Check Eligibility →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AGHANIYA – India's Leading Loan Distribution Company
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-lg text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center text-gray-700 max-w-4xl mx-auto">
            <p className="text-lg">
              At AGHANIYA, we are committed to helping clients reach their financial objectives with tailored solutions. 
              With a PAN India presence in over 4,000 cities, we stand as one of the nation's leading credit lending establishments. 
              Founded by financial professionals with over 25 years of experience, we've proudly served over 1 million clients, 
              disbursing loans exceeding 1.4 Lakh Crores through our partnerships with 275+ Financial Institution Partners.
            </p>
          </div>
        </div>
      </section>

      {/* Bank Partners Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get Loans from India's Top-Tier Lenders
          </h2>
          <p className="text-lg text-gray-600">
            Trusted by leading financial institutions across India
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-center h-20">
                <span className="text-lg font-semibold text-gray-700">{partner}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Advantages Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Advantages of AGHANIYA</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              "India's Leading Loans Distributor",
              "Pan India Presence",
              "25 Years Of Legacy",
              "Be Your Own Boss",
              "Multiple Products",
              "Refer and Earn",
              "Training Programs",
              "Easy Onboarding Process",
              "Check Free CIBIL Score",
              "EMI Calculator",
            ].map((advantage, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow">
                <CardContent>
                  <p className="text-sm font-medium text-gray-700">{advantage}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

