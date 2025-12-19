import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Home, Briefcase, Building2 } from 'lucide-react';
import { ScrollAnimation } from '@/components/ScrollAnimation';

export function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(6);
  const [loanTenure, setLoanTenure] = useState(5);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [loanType, setLoanType] = useState('home');

  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const tenureInMonths = tenureType === 'years' ? loanTenure * 12 : loanTenure;

    if (monthlyRate === 0) {
      return principal / tenureInMonths;
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) /
      (Math.pow(1 + monthlyRate, tenureInMonths) - 1);

    return emi;
  };

  const emi = calculateEMI();
  const totalAmount = emi * (tenureType === 'years' ? loanTenure * 12 : loanTenure);
  const totalInterest = totalAmount - loanAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-hero-gradient py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="fade" delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">EMI Calculator</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Plan your finances smarter. Calculate your Equated Monthly Installment (EMI) for different loan types accurately.
            </p>
          </ScrollAnimation>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white overflow-hidden rounded-2xl">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-0 pt-0 px-0">
              <Tabs value={loanType} onValueChange={setLoanType} className="w-full">
                <TabsList className="w-full h-auto p-0 bg-transparent grid grid-cols-3">
                  <TabsTrigger
                    value="home"
                    className="flex items-center justify-center gap-1 md:gap-2 py-4 md:py-6 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none text-slate-500 font-medium text-xs md:text-base transition-all"
                  >
                    <Home className="h-4 w-4 md:h-5 md:w-5" />
                    Home Loan
                  </TabsTrigger>
                  <TabsTrigger
                    value="personal"
                    className="flex items-center justify-center gap-1 md:gap-2 py-4 md:py-6 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none text-slate-500 font-medium text-xs md:text-base transition-all"
                  >
                    <Briefcase className="h-4 w-4 md:h-5 md:w-5" />
                    Personal Loan
                  </TabsTrigger>
                  <TabsTrigger
                    value="business"
                    className="flex items-center justify-center gap-1 md:gap-2 py-4 md:py-6 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none text-slate-500 font-medium text-xs md:text-base transition-all"
                  >
                    <Building2 className="h-4 w-4 md:h-5 md:w-5" />
                    Business Loan
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  {/* Loan Amount */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-slate-700 font-semibold">Loan Amount</Label>
                      <div className="text-2xl font-bold text-primary bg-primary/5 px-4 py-1 rounded-lg">
                        {formatCurrency(loanAmount)}
                      </div>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="10000000"
                      step="50000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                      <span>₹50K</span>
                      <span>₹1Cr</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-slate-700 font-semibold">Interest Rate</Label>
                      <div className="text-2xl font-bold text-primary bg-primary/5 px-4 py-1 rounded-lg">
                        {interestRate}% <span className="text-sm font-medium text-slate-400">p.a</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="18"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                      <span>6%</span>
                      <span>18%</span>
                    </div>
                  </div>

                  {/* Loan Tenure */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-slate-700 font-semibold">Loan Tenure</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                          <button
                            onClick={() => setTenureType('years')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${tenureType === 'years'
                              ? 'bg-white text-primary shadow-sm'
                              : 'text-slate-500 hover:text-slate-700'
                              }`}
                          >
                            Yr
                          </button>
                          <button
                            onClick={() => setTenureType('months')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${tenureType === 'months'
                              ? 'bg-white text-primary shadow-sm'
                              : 'text-slate-500 hover:text-slate-700'
                              }`}
                          >
                            Mo
                          </button>
                        </div>
                        <div className="text-2xl font-bold text-primary bg-primary/5 px-4 py-1 rounded-lg w-24 text-center">
                          {loanTenure}
                        </div>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={tenureType === 'years' ? '1' : '3'}
                      max={tenureType === 'years' ? '30' : '360'}
                      step={tenureType === 'years' ? '1' : '1'}
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                      <span>{tenureType === 'years' ? '1 Yr' : '3 Mo'}</span>
                      <span>{tenureType === 'years' ? '30 Yr' : '360 Mo'}</span>
                    </div>
                  </div>
                </div>

                {/* Results Visual */}
                <div className="bg-slate-50 rounded-2xl p-8 flex flex-col justify-center border border-slate-100">
                  <div className="text-center mb-6">
                    <p className="text-slate-500 font-medium mb-1">Your Monthly EMI</p>
                    <div className="text-4xl md:text-5xl font-bold text-slate-900">
                      {formatCurrency(emi)}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-slate-300" />
                        <span className="text-sm font-medium text-slate-600">Principal Amount</span>
                      </div>
                      <span className="font-bold text-slate-800">{formatCurrency(loanAmount)}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="text-sm font-medium text-slate-600">Total Interest</span>
                      </div>
                      <span className="font-bold text-primary">{formatCurrency(totalInterest)}</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-4 text-white">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-medium">Total Amount Payable</span>
                      <span className="text-xl font-bold">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

