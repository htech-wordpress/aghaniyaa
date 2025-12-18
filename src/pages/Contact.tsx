import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Phone, Mail, MapPin, Clock, AlertCircle } from 'lucide-react';
import { saveLeadAsync } from '@/lib/storage';

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
      // Save contact form lead to Firestore (fallbacks to localStorage if not configured)
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
    } catch (err) {
      alert('Failed to submit form: ' + (err as Error).message);
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <ScrollAnimation direction="fade" delay={0.2}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact AGHANIYA</h1>
            <p className="text-lg text-gray-600">Get in touch with us for any queries or assistance</p>
          </div>
        </ScrollAnimation>

        {/* Important Note */}
        <ScrollAnimation direction="down" delay={0.3}>
          <Card className="mb-8 border-yellow-400 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Note:</p>
                <p className="text-sm text-yellow-800">
                  We do not charge for our services to customers. If any AGHANIYA personnel take any charges other than bank fees, 
                  please immediately contact our toll-free number or write to us.
                </p>
              </div>
            </div>
          </CardContent>
          </Card>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <ScrollAnimation direction="right" delay={0.4} duration={0.6}>
            <div className="lg:col-span-2">
              <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill in your details and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter your name"
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
                      <Label htmlFor="reason">Reason to Connect *</Label>
                      <Select
                        value={formData.reason}
                        onValueChange={(value) => handleChange('reason', value)}
                        required
                      >
                        <SelectTrigger id="reason">
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

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      placeholder="Enter subject"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Enter your message"
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
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
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Working Hours</h3>
                    <p className="text-sm text-gray-600">MON-SAT</p>
                    <p className="text-sm text-gray-600">10:00 AM - 07:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Head Office</h3>
                    <p className="text-sm text-gray-600">
                      7/8, 3rd Floor, 215 - Magan Mahal,<br />
                      Sir M.V. Road, Andheri (E),<br />
                      Mumbai - 400 069
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:support@aghaniya.com" className="text-sm text-primary hover:underline">
                      support@aghaniya.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:18002667576" className="text-sm text-primary hover:underline block">
                      1800-266-7576
                    </a>
                    <a href="tel:+919029059005" className="text-sm text-primary hover:underline block">
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

