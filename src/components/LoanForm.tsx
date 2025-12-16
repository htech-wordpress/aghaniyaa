import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { saveLead } from '@/lib/storage';
import type { LeadCategory } from '@/lib/storage';

interface LoanFormProps {
  loanType: string;
  description?: string;
  category: LeadCategory;
}

export function LoanForm({ loanType, description, category }: LoanFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    city: '',
    state: '',
    loanAmount: '',
    employmentType: '',
    monthlyIncome: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save lead to localStorage
    saveLead(category, {
      ...formData,
      loanType,
    });
    
    alert(`Thank you for your interest in ${loanType}. Our team will contact you soon!`);
    
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      city: '',
      state: '',
      loanAmount: '',
      employmentType: '',
      monthlyIncome: '',
      message: '',
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir'
  ];

  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad'
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{loanType}</h1>
          {description && (
            <p className="text-lg text-gray-600">{description}</p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Apply for {loanType}</CardTitle>
            <CardDescription>
              Fill in your details below and our team will get back to you with the best offers.
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
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleChange('state', value)}
                    required
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="loanAmount">Loan Amount (₹) *</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    required
                    value={formData.loanAmount}
                    onChange={(e) => handleChange('loanAmount', e.target.value)}
                    placeholder="Enter loan amount"
                  />
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

              <div>
                <Label htmlFor="message">Additional Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Any additional information..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

