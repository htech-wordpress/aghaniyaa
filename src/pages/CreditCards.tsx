import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Card3D } from '@/components/Card3D';
import { CreditCard, TrendingUp, Gift, Shield, Zap } from 'lucide-react';
import { saveLeadAsync } from '@/lib/storage';

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

    // Save lead to Firestore (fallback to localStorage)
    const selectedCardData = creditCards.find(card => card.id === selectedCard);
    try {
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
    } catch (err) {
      alert('Failed to submit: ' + (err as Error).message);
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Credit Cards</h1>
          <p className="text-xl text-gray-100">
            Upgrade your lifestyle with feature-packed, rewarding credit cards
          </p>
        </div>

        {/* Credit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {creditCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <ScrollAnimation key={card.id} direction="up" delay={index * 0.15} duration={0.6}>
                <Card3D intensity={12}>
                  <Card
                    className={`hover:shadow-lg transition-shadow cursor-pointer h-full ${
                      selectedCard === card.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedCard(card.id)}
                  >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-12 w-12 text-primary" />
                    <CreditCard className="h-8 w-8 text-gray-400" />
                  </div>
                  <CardTitle className="text-2xl">{card.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold">{card.issuer}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {card.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <span className="text-primary mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={selectedCard === card.id ? 'default' : 'outline'}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCard(card.id);
                    }}
                  >
                    {selectedCard === card.id ? 'Selected' : 'Select Card'}
                  </Button>
                </CardContent>
                  </Card>
                </Card3D>
              </ScrollAnimation>
            );
          })}
        </div>

        {/* Application Form */}
        <ScrollAnimation direction="fade" delay={0.3}>
          <Card>
          <CardHeader>
            <CardTitle>Apply for Credit Card</CardTitle>
            <CardDescription>
              Fill in your details to get the best credit card offers tailored to your needs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
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
                  <Label htmlFor="city">City *</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => handleChange('city', value)}
                    required
                  >
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <Select
                    value={formData.employmentType}
                    onValueChange={(value) => handleChange('employmentType', value)}
                    required
                  >
                    <SelectTrigger id="employmentType">
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

                <div>
                  <Label htmlFor="monthlyIncome">Monthly Income (₹) *</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    required
                    value={formData.monthlyIncome}
                    onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                    placeholder="Enter monthly income"
                  />
                </div>
              </div>

              {selectedCard && (
                <div className="bg-primary/10 p-4 rounded-md">
                  <p className="text-sm text-gray-700">
                    Selected Card: <span className="font-semibold">
                      {creditCards.find(c => c.id === selectedCard)?.name}
                    </span>
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                Submit Application
              </Button>
            </form>
          </CardContent>
          </Card>
        </ScrollAnimation>
      </div>
    </div>
  );
}

