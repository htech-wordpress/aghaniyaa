import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileSearch, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { saveLead } from '@/lib/storage';

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
    setTimeout(() => {
      // Generate a random CIBIL score for demo (in real app, this would be from API)
      const generatedScore = Math.floor(Math.random() * 300) + 550; // Score between 550-850
      setScore(generatedScore);

      // Save CIBIL check entry to localStorage
      saveLead('cibil-check', {
        ...formData,
        cibilScore: generatedScore,
      });

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Check Your CIBIL Score</h1>
            <p className="text-lg text-gray-600">
              Get instant access to your CIBIL score and credit report
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <FileSearch className="h-8 w-8 text-primary" />
                  <CardTitle>Enter Your Details</CardTitle>
                </div>
                <CardDescription>
                  Fill in your information to check your CIBIL score instantly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email ID *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pan">PAN Number *</Label>
                    <Input
                      id="pan"
                      required
                      value={formData.pan}
                      onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: ABCDE1234F</p>
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isChecking}>
                    {isChecking ? 'Checking...' : 'Check CIBIL Score'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Result */}
            <Card>
              <CardHeader>
                <CardTitle>Your CIBIL Score</CardTitle>
                <CardDescription>
                  Your credit score will appear here after submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                {score === null ? (
                  <div className="text-center py-12">
                    <FileSearch className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      {isChecking 
                        ? 'Checking your CIBIL score...' 
                        : 'Submit the form to check your CIBIL score'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className={`text-7xl font-bold mb-2 ${getScoreColor(score)}`}>
                        {score}
                      </div>
                      <div className={`text-xl font-semibold ${getScoreColor(score)} mb-4`}>
                        {getScoreStatus(score)}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>Score Retrieved Successfully</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Score Range</span>
                        <span className="font-semibold">300 - 900</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Your Score</span>
                        <span className={`font-bold ${getScoreColor(score)}`}>{score}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">What does this mean?</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>750+: Excellent - Best loan interest rates</li>
                            <li>700-749: Good - Competitive rates available</li>
                            <li>650-699: Fair - May need improvement</li>
                            <li>Below 650: Poor - Focus on credit improvement</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
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
          </div>

          {/* Info Section */}
          <Card className="mt-8">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Why Check Your CIBIL Score?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-2">Better Loan Terms</h4>
                  <p className="text-sm text-gray-600">
                    Higher scores help you get better interest rates and loan terms
                  </p>
                </div>
                <div>
                  <CheckCircle className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-2">Quick Approval</h4>
                  <p className="text-sm text-gray-600">
                    Lenders prefer applicants with good CIBIL scores
                  </p>
                </div>
                <div>
                  <FileSearch className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-2">Monitor Credit Health</h4>
                  <p className="text-sm text-gray-600">
                    Regular checks help you maintain and improve your credit score
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

