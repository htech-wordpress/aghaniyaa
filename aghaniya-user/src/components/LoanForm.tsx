import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { saveLeadAsync } from '@/lib/leads';
import type { LeadCategory } from '@/lib/storage';
import { CheckCircle2, FileText, UserCheck } from 'lucide-react';

interface LoanFormProps {
  loanType: string;
  description?: string;
  category: LeadCategory;
  initialMobile?: string;
  features?: string[];
  eligibility?: string[];
  documents?: string[];
}

export function LoanForm({ loanType, description, category, initialMobile, features, eligibility, documents }: LoanFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: initialMobile || '',
    city: '',
    state: '',
    loanAmount: '',
    employmentType: '',
    monthlyIncome: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await saveLeadAsync(category, {
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
      setShowForm(false); // Hide form after successful submission
    } catch (error) {
      console.error('Error saving loan lead', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Use initialMobile to open form automatically if it was just passed? 
  // User said: "open the loan page with details on top and then opne the preload number filled and ask to fill other details"
  // But latest request: "It should not oipen the loan form directly ... Button that Apply and then form will open"
  // So I will respect the latest request: Hidden by default.

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
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{loanType}</h1>
          {description && (
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{description}</p>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Features */}
          {features && features.length > 0 && (
            <Card className="border-t-4 border-t-blue-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CheckCircle2 className="h-6 w-6 text-blue-500" /> Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start text-slate-700 text-sm">
                      <span className="mr-2 text-blue-500 text-lg leading-none">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Eligibility */}
          {eligibility && eligibility.length > 0 && (
            <Card className="border-t-4 border-t-green-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <UserCheck className="h-6 w-6 text-green-500" /> Eligibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {eligibility.map((item, i) => (
                    <li key={i} className="flex items-start text-slate-700 text-sm">
                      <span className="mr-2 text-green-500 text-lg leading-none">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {documents && documents.length > 0 && (
            <Card className="border-t-4 border-t-orange-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-6 w-6 text-orange-500" /> Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {documents.map((doc, i) => (
                    <li key={i} className="flex items-start text-slate-700 text-sm">
                      <span className="mr-2 text-orange-500 text-lg leading-none">•</span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Button (Visible when form is hidden) */}
        {!showForm && (
          <div className="text-center mb-16">
            <Button
              size="lg"
              className="px-10 py-8 text-xl font-bold bg-rose-900 hover:bg-rose-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all rounded-full"
              onClick={() => setShowForm(true)}
            >
              Apply for {loanType} Now
            </Button>
            <p className="mt-4 text-slate-500">Quick Approval • Minimal Documentation</p>
          </div>
        )}

        {/* Application Form */}
        {showForm && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-10 fade-in duration-500">
            <Card className="border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-6 text-white text-center relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 text-slate-400 hover:text-white hover:bg-slate-800"
                  onClick={() => setShowForm(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </Button>
                <h2 className="text-2xl font-bold mb-2">Apply for {loanType}</h2>
                <p className="text-slate-300">Fill in your details below and our team will get back to you with the best offers.</p>
              </div>

              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName" className="text-slate-700">Full Name *</Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-slate-700">Email ID *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="Enter your email"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mobile" className="text-slate-700">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        required
                        value={formData.mobile}
                        onChange={(e) => handleChange('mobile', e.target.value)}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className="mt-1.5 bg-slate-50 font-medium"
                      // Make it clearer that it's pre-filled
                      />
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-slate-700">City *</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => handleChange('city', value)}
                        required
                      >
                        <SelectTrigger id="city" className="mt-1.5">
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
                      <Label htmlFor="state" className="text-slate-700">State *</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) => handleChange('state', value)}
                        required
                      >
                        <SelectTrigger id="state" className="mt-1.5">
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
                      <Label htmlFor="loanAmount" className="text-slate-700">Loan Amount (₹) *</Label>
                      <Input
                        id="loanAmount"
                        type="number"
                        required
                        value={formData.loanAmount}
                        onChange={(e) => handleChange('loanAmount', e.target.value)}
                        placeholder="Enter loan amount"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="employmentType" className="text-slate-700">Employment Type *</Label>
                      <Select
                        value={formData.employmentType}
                        onValueChange={(value) => handleChange('employmentType', value)}
                        required
                      >
                        <SelectTrigger id="employmentType" className="mt-1.5">
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
                      <Label htmlFor="monthlyIncome" className="text-slate-700">Monthly Income (₹) *</Label>
                      <Input
                        id="monthlyIncome"
                        type="number"
                        required
                        value={formData.monthlyIncome}
                        onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                        placeholder="Enter monthly income"
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-slate-700">Additional Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Any additional information..."
                      rows={4}
                      className="mt-1.5"
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg font-semibold bg-rose-900 hover:bg-rose-800 shadow-lg" size="lg">
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

