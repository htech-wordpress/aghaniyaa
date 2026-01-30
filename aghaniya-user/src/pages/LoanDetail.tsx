import { useParams, Link, useLocation } from 'react-router-dom';
import { LoanForm } from '@/components/LoanForm';
import { type LeadCategory } from '@/lib/storage';
import { loanOptions } from '@/data/loanOptions';
import { subscribeToStats, type CompanyStats, defaultStats } from '@/lib/stats';
import { useState, useEffect } from 'react';
import { SEO } from '@/components/SEO';

export function LoanDetail() {
  const { loanType } = useParams<{ loanType: string }>();
  const location = useLocation();
  const initialMobile = location.state?.mobile;

  const [stats, setStats] = useState<CompanyStats>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToStats((newStats) => {
      setStats(newStats);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Try to find in dynamic stats first, then fallback to static options
  const dynamicLoan = stats.loanProducts?.find(p => p.id === loanType);
  const staticLoan = loanOptions.find(l => l.id === loanType);

  // Merge the two, preferring dynamic data
  const loan = dynamicLoan ? {
    ...staticLoan, // Keep icon and category from static if needed (since dynamic might store iconName string)
    ...dynamicLoan, // Overwrite with dynamic title, desc, features etc
    // Ensure arrays exist
    features: dynamicLoan.features || staticLoan?.features,
    eligibility: dynamicLoan.eligibility || staticLoan?.eligibility,
    documents: dynamicLoan.documents || staticLoan?.documents,
  } : staticLoan;

  if (!loan && !loading) {
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

  // Show loading state if waiting for initial data (optional, but good for UX)
  if (!loan && loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Safe check again
  if (!loan) return null;

  return (
    <>
      <SEO
        title={loan.title}
        description={loan.description}
        keywords={`${loan.title}, loan eligibility, loan documents, Aghaniya Enterprises LLP`}
      />
      <LoanForm
        loanType={loan.title}
        description={loan.description}
        category={loanType as LeadCategory}
        initialMobile={initialMobile}
        features={loan.features}
        eligibility={loan.eligibility}
        documents={loan.documents}
      />
    </>
  );
}

