import { useParams, Link } from 'react-router-dom';
import { LoanForm } from '@/components/LoanForm';
import { Home as HomeIcon, Building2, Briefcase, GraduationCap, Car, Gem, Landmark } from 'lucide-react';

const loanDetails: Record<string, { title: string; description: string; icon: any }> = {
  'home-loan': {
    title: 'Home Loan',
    description: 'Your Dream Home Awaits - Explore Our Range Of Home Loan Products. Get the best interest rates and flexible repayment options.',
    icon: HomeIcon,
  },
  'loan-against-property': {
    title: 'Loan against Property',
    description: 'Unlock your property\'s value with tailored loan solutions. Get high-value loans at competitive interest rates.',
    icon: Landmark,
  },
  'personal-loan': {
    title: 'Personal Loan',
    description: 'Achieve your dreams with our versatile personal loan options. No collateral required, quick approval.',
    icon: Briefcase,
  },
  'business-loan': {
    title: 'Business Loan',
    description: 'Boost your business growth with our flexible financing options. Working capital and expansion loans available.',
    icon: Building2,
  },
  'education-loan': {
    title: 'Education Loan',
    description: 'Invest in your child\'s future with our specialized education loans. Cover tuition fees and living expenses.',
    icon: GraduationCap,
  },
  'car-loan': {
    title: 'Car Loan',
    description: 'Drive your dream car with our quick and flexible car loans. Available for both new and used cars.',
    icon: Car,
  },
  'bike-loan': {
    title: 'Bike Loan',
    description: 'Get on the road faster with our bike loan options. Competitive rates for two-wheelers.',
    icon: Car,
  },
  'mortgage-loan': {
    title: 'Mortgage Loan',
    description: 'Leverage your property for financial needs with our mortgage loan solutions. Attractive interest rates.',
    icon: Landmark,
  },
  'gold-loan': {
    title: 'Gold Loan',
    description: 'Meet your financial needs with gold loans from trusted banks. Instant disbursal with minimum documentation.',
    icon: Gem,
  },
};

export function LoanDetail() {
  const { loanType } = useParams<{ loanType: string }>();
  const loan = loanType ? loanDetails[loanType] : null;

  if (!loan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Loan Not Found</h1>
          <Link to="/loans">
            <button className="text-primary hover:underline">Back to Loans</button>
          </Link>
        </div>
      </div>
    );
  }

  return <LoanForm loanType={loan.title} description={loan.description} category={loanType as any} />;
}

