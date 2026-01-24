import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollAnimation } from '@/components/ScrollAnimation';
// import { Card3D } from '@/components/Card3D';
import { loanOptions } from '@/data/loanOptions';
import { subscribeToStats, type CompanyStats, defaultStats } from '@/lib/stats';
import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Briefcase;
  return <Icon className={className} />;
};

export function Loans() {
  const [stats, setStats] = useState<CompanyStats>(defaultStats);

  useEffect(() => {
    const unsubscribe = subscribeToStats(setStats);
    return () => unsubscribe();
  }, []);

  const getLoans = () => {
    if (stats.loanProducts && stats.loanProducts.length > 0) {
      return stats.loanProducts;
    }
    // Fallback to loanOptions with added features if partial data
    return loanOptions.map(opt => ({
      ...opt,
      features: ['Quick Approval', 'Competitive Rates', 'Flexible Tenure', 'Minimal Documentation']
    }));
  };

  const loans = getLoans();

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
          {loans.map((loan: any, index: number) => {
            return (
              <ScrollAnimation key={loan.id} direction="up" delay={(index % 3) * 0.1} duration={0.4}>
                <Card className="hover:shadow-2xl transition-all duration-300 h-full border-slate-100 bg-white group hover:-translate-y-1 rounded-2xl overflow-hidden shadow-md">
                  <CardHeader className="flex flex-row items-start space-y-0 pb-2 gap-4">
                    <div className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                      {loan.icon && typeof loan.icon !== 'string' ? (
                        <loan.icon className="h-7 w-7 text-white" />
                      ) : (
                        <DynamicIcon name={loan.iconName || 'Briefcase'} className="h-7 w-7 text-white" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800 leading-tight mb-1">{loan.title}</CardTitle>
                      <p className="text-sm text-slate-600 leading-snug">{loan.description}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 mb-6">
                      {(loan.features || ['Quick Approval', 'Competitive Rates']).map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-start text-sm text-slate-600">
                          <span className="text-orange-500 mr-2 mt-0.5">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto">
                      <Link to={loan.route || `/loans/${loan.id}`}>
                        <Button
                          variant="outline"
                          className="w-full border-rose-900 text-rose-900 hover:bg-rose-50 font-semibold shadow-sm rounded-lg"
                        >
                          Check Eligibility
                        </Button>
                      </Link>
                    </div>
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

