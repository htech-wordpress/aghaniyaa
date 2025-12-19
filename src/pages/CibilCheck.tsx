import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { FileSearch, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { saveLeadAsync } from '@/lib/leads';

export function CibilCheck() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    pan: '',
    dateOfBirth: '',
  });

  const [score, setScore] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);

    // Simulate API call delay
    setTimeout(async () => {
      // Generate a random CIBIL score for demo (in real app, this would be from API)
      const generatedScore = Math.floor(Math.random() * 300) + 550; // Score between 550-850
      setScore(generatedScore);

      try {
        // Save CIBIL check entry to Firestore
        await saveLeadAsync('cibil-check', {
          ...formData,
          cibilScore: generatedScore,
        });
      } catch (error) {
        console.error('Error saving CIBIL check', error);
      }

      setIsChecking(false);
    }, 2000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-hero-gradient py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="scale" delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Check Your CIBIL Score</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get instant access to your CIBIL score and credit report. A good score unlocks better loan offers.
            </p>
          </ScrollAnimation>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <ScrollAnimation direction="right" delay={0.3} duration={0.6}>
            <Card className="border-0 shadow-xl bg-white overflow-hidden rounded-2xl h-full">
              <div className="h-1 bg-gradient-to-r from-primary/50 to-primary" />
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6 pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileSearch className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-800">Enter Your Details</CardTitle>
                    <CardDescription className="text-slate-500">
                      Fill in your information to check your CIBIL score instantly
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-slate-700">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        value={formData.mobile}
                        onChange={(e) => handleChange('mobile', e.target.value)}
                        placeholder="10-digit number"
                        maxLength={10}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">Email ID *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pan" className="text-slate-700">PAN Number *</Label>
                      <Input
                        id="pan"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors uppercase"
                        value={formData.pan}
                        onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      />
                      <p className="text-xs text-slate-400">Format: ABCDE1234F</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-slate-700">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full text-lg h-12 shadow-lg shadow-primary/20" size="lg" disabled={isChecking}>
                    {isChecking ? 'Checking...' : 'Check CIBIL Score'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </ScrollAnimation>

          {/* Result & Info */}
          <div className="flex flex-col gap-8">
            {/* Result Card */}
            <Card className="border-0 shadow-xl bg-white overflow-hidden rounded-2xl flex-1 flex flex-col items-center justify-center min-h-[400px]">
              <CardContent className="w-full p-8">
                {score === null ? (
                  <div className="text-center py-8">
                    <div className="h-24 w-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-6">
                      <FileSearch className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      {isChecking ? 'Analyzing Profile...' : 'No Score Generated Yet'}
                    </h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                      {isChecking
                        ? 'Please wait while we fetch your credit report details.'
                        : 'Submit the form on the left to check your CIBIL scoreinstantly.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="text-center">
                      <div className="relative inline-block mb-4">
                        <svg className="w-48 h-48 transform -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-slate-100"
                          />
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={552}
                            strokeDashoffset={552 - (552 * (score - 300)) / 600}
                            className={getScoreColor(score)}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800">
                          <span className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</span>
                          <span className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-1">CIBIL Score</span>
                        </div>
                      </div>

                      <div className={`text-2xl font-bold ${getScoreColor(score)} mb-2`}>
                        {getScoreStatus(score)}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full inline-flex">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Report Generated Successfully</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Score Range</span>
                        <span className="font-semibold text-slate-800">300 - 900</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${getScoreColor(score).replace('text-', 'bg-')}`} style={{ width: `${((score - 300) / 600) * 100}%` }} />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">Score Analysis</p>
                          <p>
                            {score >= 750 ? "Excellent! You are eligible for the best interest rates." :
                              score >= 700 ? "Good score. You have high chances of loan approval." :
                                score >= 650 ? "Fair score. You may get loans but at higher interest rates." :
                                  "Your score needs improvement. Avoid applying for too many loans."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                      onClick={() => {
                        setScore(null);
                        setFormData({
                          name: '',
                          mobile: '',
                          email: '',
                          pan: '',
                          dateOfBirth: '',
                        });
                      }}
                    >
                      Check Another Score
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Section */}
            <ScrollAnimation direction="left" delay={0.4} duration={0.6}>
              <Card className="border-0 shadow-lg bg-slate-900 text-white">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Why Check Your CIBIL Score?
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">1</div>
                      <div>
                        <h4 className="font-semibold text-white">Better Loan Terms</h4>
                        <p className="text-sm text-slate-400">Higher scores help you get lower interest rates.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">2</div>
                      <div>
                        <h4 className="font-semibold text-white">Quick Approval</h4>
                        <p className="text-sm text-slate-400">Lenders prefer applicants with good credit history.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </div>
  );
}

