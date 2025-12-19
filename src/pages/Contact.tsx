import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Phone, Mail, MapPin, Clock, AlertCircle } from 'lucide-react';
import { saveLeadAsync } from '@/lib/leads';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    state: '',
    subject: '',
    reason: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await saveLeadAsync('contact', formData);
      alert('Thank you for contacting us! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        city: '',
        state: '',
        subject: '',
        reason: '',
        message: '',
      });
    } catch (error) {
      console.error('Error saving contact form', error);
      alert('Something went wrong. Please try again.');
    }
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
    <div className="min-h-screen bg-slate-50">
      <div className="bg-hero-gradient py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="fade" delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact AGHANIYA</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get in touch with us for any queries or assistance. We are here to help!
            </p>
          </ScrollAnimation>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 pb-20 relative z-10">
        {/* Important Note */}
        <ScrollAnimation direction="down" delay={0.3}>
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg shadow-sm flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-amber-900 mb-1">Important Note:</p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  We do not charge for our services to customers. If any AGHANIYA personnel take any charges other than bank fees,
                  please immediately contact our toll-free number or write to us.
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <ScrollAnimation direction="right" delay={0.4} duration={0.6}>
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl bg-white overflow-hidden rounded-2xl h-full">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-800">Send us a Message</CardTitle>
                      <CardDescription className="text-slate-500">
                        Fill in your details and we'll get back to you as soon as possible.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-700">Name *</Label>
                        <Input
                          id="name"
                          required
                          className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          placeholder="Enter your name"
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
                          <SelectContent>
                            {indianCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-slate-700">State *</Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => handleChange('state', value)}
                          required
                        >
                          <SelectTrigger id="state" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors">
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

                      <div className="space-y-2">
                        <Label htmlFor="reason" className="text-slate-700">Reason to Connect *</Label>
                        <Select
                          value={formData.reason}
                          onValueChange={(value) => handleChange('reason', value)}
                          required
                        >
                          <SelectTrigger id="reason" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors">
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="loan-inquiry">Loan Inquiry</SelectItem>
                            <SelectItem value="credit-card">Credit Card</SelectItem>
                            <SelectItem value="existing-customer">Existing Customer Support</SelectItem>
                            <SelectItem value="partner">Become a Partner</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-slate-700">Subject *</Label>
                      <Input
                        id="subject"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        placeholder="Enter subject"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-slate-700">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder="Enter your message"
                        rows={5}
                      />
                    </div>

                    <Button type="submit" className="w-full text-lg h-12 shadow-lg shadow-primary/20" size="lg">
                      SEND MESSAGE
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </ScrollAnimation>

          {/* Contact Information */}
          <ScrollAnimation direction="left" delay={0.5} duration={0.6}>
            <div className="space-y-6">
              <Card className="border-0 shadow-xl bg-slate-900 text-white overflow-hidden rounded-2xl relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Phone className="h-32 w-32 text-white" />
                </div>
                <CardHeader className="border-b border-slate-800 pb-6">
                  <CardTitle className="text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-slate-100">Working Hours</h3>
                      <p className="text-sm text-slate-400">MON-SAT</p>
                      <p className="text-sm text-slate-400">10:00 AM - 07:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-slate-100">Head Office</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        7/8, 3rd Floor, 215 - Magan Mahal,<br />
                        Sir M.V. Road, Andheri (E),<br />
                        Mumbai - 400 069
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-slate-100">Email</h3>
                      <a href="mailto:support@aghaniya.com" className="text-sm text-primary hover:text-primary/80 transition-colors">
                        support@aghaniya.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-slate-100">Phone</h3>
                      <a href="tel:18002667576" className="text-sm text-primary hover:text-primary/80 transition-colors block mb-1">
                        1800-266-7576
                      </a>
                      <a href="tel:+919029059005" className="text-sm text-primary hover:text-primary/80 transition-colors block">
                        +91 90290 59005
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
}

