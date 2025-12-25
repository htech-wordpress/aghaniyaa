import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollAnimation } from '@/components/ScrollAnimation';
// import { Card3D } from '@/components/Card3D';
import { loanOptions } from '@/data/loanOptions';

const loans = loanOptions.map(opt => ({
  ...opt,
  features: ['Quick Approval', 'Competitive Rates', 'Flexible Tenure', 'Minimal Documentation']
}));

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
              <ScrollAnimation key={loan.id} direction="up" delay={(index % 3) * 0.1} duration={0.4}>
                <Card className="hover:shadow-2xl transition-all duration-300 h-full border-slate-100 bg-white group hover:-translate-y-1 rounded-2xl overflow-hidden shadow-md">
                  <CardHeader className="flex flex-row items-start space-y-0 pb-2 gap-4">
                    <div className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800 leading-tight mb-1">{loan.title}</CardTitle>
                      <p className="text-sm text-slate-600 leading-snug">{loan.description}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 mb-6">
                      {loan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm text-slate-600">
                          <span className="text-orange-500 mr-2 mt-0.5">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to={`/loans/${loan.id}`}>
                      <Button className="w-full bg-rose-900 hover:bg-rose-800 text-white font-semibold shadow-sm rounded-lg">
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

