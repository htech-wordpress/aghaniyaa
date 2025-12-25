import { useParams, Link } from 'react-router-dom';
import { LoanForm } from '@/components/LoanForm';
import { type LeadCategory } from '@/lib/storage';
import { loanOptions } from '@/data/loanOptions';

export function LoanDetail() {
  const { loanType } = useParams<{ loanType: string }>();
  const loan = loanType ? loanOptions.find(l => l.id === loanType) : null;

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

  return <LoanForm loanType={loan.title} description={loan.description} category={loanType as LeadCategory} />;
}

