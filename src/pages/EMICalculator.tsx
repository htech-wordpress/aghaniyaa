import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Home, Briefcase, Building2 } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">EMI Calculator</h1>
            <p className="text-lg text-gray-600">
              Calculate your Equated Monthly Installment (EMI) for different loan types
            </p>
          </div>

          <Card>
            <CardHeader>
              <Tabs value={loanType} onValueChange={setLoanType} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="home" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Home
                  </TabsTrigger>
                  <TabsTrigger value="personal" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="business" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Business
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Loan Amount */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Loan Amount</Label>
                    <div className="text-2xl font-bold text-primary">
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹50K</span>
                    <span>₹1Cr</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Interest Rate</Label>
                    <div className="text-2xl font-bold text-primary">
                      {interestRate}%
                    </div>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="18"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>6%</span>
                    <span>18%</span>
                  </div>
                </div>

                {/* Loan Tenure */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Loan Tenure</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTenureType('years')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            tenureType === 'years'
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          Years
                        </button>
                        <button
                          onClick={() => setTenureType('months')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            tenureType === 'months'
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          Months
                        </button>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {loanTenure} {tenureType === 'years' ? 'Y' : 'M'}
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{tenureType === 'years' ? '1 Year' : '3 Months'}</span>
                    <span>{tenureType === 'years' ? '30 Years' : '360 Months'}</span>
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <Label className="text-gray-600">Monthly EMI</Label>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(emi)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <Label className="text-gray-600">Principal Amount</Label>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(loanAmount)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-700"></div>
                      <Label className="text-gray-600">Interest Payable</Label>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(totalInterest)}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-600 block mb-2">Total Amount Payable</Label>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-gray-900">
                        {formatCurrency(totalAmount)}
                      </div>
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

