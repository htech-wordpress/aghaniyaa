/*
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollAnimation } from '@/components/ScrollAnimation';
// import { Card3D } from '@/components/Card3D';
import { CreditCard, TrendingUp, Gift, Shield, Zap } from 'lucide-react';
import { saveLeadAsync } from '@/lib/leads';

// ... (existing constants)
const creditCards = [
  {
    id: 1,
    name: 'Premium Rewards Card',
    issuer: 'HDFC Bank',
    benefits: ['5% cashback on all purchases', 'Airport lounge access', 'Travel insurance', 'Zero annual fee first year'],
    icon: Gift,
  },
  {
    id: 2,
    name: 'Cashback Plus Card',
    issuer: 'ICICI Bank',
    benefits: ['Unlimited cashback', 'Fuel surcharge waiver', 'Shopping discounts', 'EMI conversion'],
    icon: TrendingUp,
  },
  {
    id: 3,
    name: 'Travel Elite Card',
    issuer: 'Axis Bank',
    benefits: ['Miles on every spend', 'Hotel discounts', 'Travel vouchers', 'Concierge service'],
    icon: Zap,
  },
  {
    id: 4,
    name: 'Secure Credit Card',
    issuer: 'SBI',
    benefits: ['Zero fraud liability', 'Secure transactions', 'Reward points', 'Low interest rates'],
    icon: Shield,
  },
];
export function CreditCards() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    city: '',
    monthlyIncome: '',
    employmentType: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const selectedCardData = creditCards.find(card => card.id === selectedCard);
      await saveLeadAsync('credit-card', {
        ...formData,
        selectedCard: selectedCardData ? selectedCardData.name : null,
        selectedCardIssuer: selectedCardData ? selectedCardData.issuer : null,
      });

      alert('Thank you for your interest! Our team will contact you soon with the best credit card offers.');
      setFormData({
        fullName: '',
        email: '',
        mobile: '',
        city: '',
        monthlyIncome: '',
        employmentType: '',
      });
      setSelectedCard(null);
    } catch (error) {
      console.error('Error saving credit card lead', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="fade" delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Credit Cards</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Upgrade your lifestyle with feature-packed, rewarding credit cards tailored for you.
            </p>
          </ScrollAnimation>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 pb-20 relative z-10">
        // Credit Cards Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {creditCards.map((card, index) => {
            const Icon = card.icon;
            const isSelected = selectedCard === card.id;
            return (
              <ScrollAnimation key={card.id} direction="up" delay={index * 0.15} duration={0.6}>
                <Card
                  className={`hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border-slate-100 bg-white group hover:-translate-y-2 relative overflow-hidden ${isSelected ? 'ring-2 ring-primary border-primary shadow-lg shadow-primary/10' : ''}`}
                  onClick={() => setSelectedCard(card.id)}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg font-bold z-20">
                      SELECTED
                    </div>
                  )}
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3 rounded-xl ${isSelected ? 'bg-primary/20 text-primary' : 'bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary'} transition-colors`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <CreditCard className="h-6 w-6 text-slate-300" />
                    </div>
                    <CardTitle className="text-xl text-slate-800 mb-1">{card.name}</CardTitle>
                    <CardDescription className="text-sm font-medium text-slate-500 uppercase tracking-wider">{card.issuer}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-3 mb-6">
                      {card.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start text-xs text-slate-600">
                          <span className="text-primary mr-2">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      className={`w-full ${isSelected ? 'shadow-lg shadow-primary/25' : 'border-slate-200 hover:border-primary hover:text-primary'} transition-all`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCard(card.id);
                      }}
                    >
                      {isSelected ? 'Card Selected' : 'Select Card'}
                    </Button>
                  </CardContent>
                  // Decorative faint background gradient
                  <div className={`absolute inset-0 bg-gradient-to-br ${isSelected ? 'from-primary/5 to-transparent' : 'from-slate-50 to-transparent'} opacity-50 pointer-events-none`} />
                </Card>
              </ScrollAnimation>
            );
          })}
        </div>

        // Application Form
        <ScrollAnimation direction="fade" delay={0.3}>
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white overflow-hidden rounded-2xl">
              <div className="h-2 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900" />
              <CardHeader className="text-center pb-2 pt-8">
                <CardTitle className="text-3xl font-bold text-slate-800">Apply Now</CardTitle>
                <CardDescription className="text-lg text-slate-500">
                  Fill in your details to get the best credit card offers tailored to your needs.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-slate-700">Full Name *</Label>
                      <Input
                        id="fullName"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
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

                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-slate-700">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        value={formData.mobile}
                        onChange={(e) => handleChange('mobile', e.target.value)}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-slate-700">City *</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => handleChange('city', value)}
                        required
                      >
                        <SelectTrigger id="city" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors">
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {indianCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employmentType" className="text-slate-700">Employment Type *</Label>
                      <Select
                        value={formData.employmentType}
                        onValueChange={(value) => handleChange('employmentType', value)}
                        required
                      >
                        <SelectTrigger id="employmentType" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors">
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salaried">Salaried</SelectItem>
                          <SelectItem value="self-employed">Self Employed</SelectItem>
                          <SelectItem value="business">Business Owner</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyIncome" className="text-slate-700">Monthly Income (₹) *</Label>
                      <Input
                        id="monthlyIncome"
                        type="number"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        value={formData.monthlyIncome}
                        onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                        placeholder="Enter monthly income"
                      />
                    </div>
                  </div>

                  {selectedCard && (
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Applying for</p>
                        <p className="text-lg font-bold text-slate-800">
                          {creditCards.find(c => c.id === selectedCard)?.name}
                        </p>
                      </div>
                      <Shield className="text-primary h-8 w-8 opacity-50" />
                    </div>
                  )}

                  <Button type="submit" className="w-full text-lg h-12 shadow-lg shadow-primary/20" size="lg">
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
}
*/

