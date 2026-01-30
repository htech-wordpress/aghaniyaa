import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Youtube, Building } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { saveLeadAsync } from '@/lib/leads';
import { subscribeToBranches, type Branch } from '@/lib/branches';
import { subscribeToStats, type CompanyStats, defaultStats } from '@/lib/stats';

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
    monthlyIncome: '',
    loanAmount: '',
    loanType: '',
  });

  const [branches, setBranches] = useState<Branch[]>([]);
  const [stats, setStats] = useState<CompanyStats>(defaultStats);

  useEffect(() => {
    const unsubBranches = subscribeToBranches((data) => {
      setBranches(data);
    });
    const unsubStats = subscribeToStats((data) => {
      setStats(data);
    });
    return () => {
      unsubBranches();
      unsubStats();
    };
  }, []);

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
        monthlyIncome: '',
        loanAmount: '',
        loanType: '',
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
      <SEO
        title="Contact Us"
        description="Get in touch with Aghaniya Enterprises LLP for loan inquiries, customer support, or partnership opportunities. Our team is available to assist you across India."
        keywords="contact aghaniya enterprises, loan inquiry, customer support, office address Pune"
      />
      <div className="bg-hero-gradient py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="fade" delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact Aghaniya Enterprises LLP</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get in touch with us for any queries or assistance. We are here to help!
            </p>
          </ScrollAnimation>
        </div>

        {/* Map Section */}

      </div>

      <div className="container mx-auto px-4 -mt-16 pb-20 relative z-10">
        {/* Important Note */}
        <ScrollAnimation direction="down" delay={0.3}>
          <div className="max-w-4xl mx-auto mb-8">
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <ScrollAnimation direction="right" delay={0.4} duration={0.6} className="lg:col-span-2">
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

                    <div className="space-y-3 md:col-span-2">
                      <Label className="text-slate-700 text-base font-semibold">Reason to Connect *</Label>
                      <RadioGroup
                        value={formData.reason}
                        onValueChange={(value) => handleChange('reason', value)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
                        required
                      >
                        <label htmlFor="loan-inquiry" className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="loan-inquiry" id="loan-inquiry" />
                          <span className="font-normal flex-grow text-sm">Loan Inquiry</span>
                        </label>
                        <label htmlFor="existing-customer" className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="existing-customer" id="existing-customer" />
                          <span className="font-normal flex-grow text-sm">Existing Customer Support</span>
                        </label>
                        <label htmlFor="partner" className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="partner" id="partner" />
                          <span className="font-normal flex-grow text-sm">Become a Partner</span>
                        </label>
                        <label htmlFor="other" className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                          <RadioGroupItem value="other" id="other" />
                          <span className="font-normal flex-grow text-sm">Other</span>
                        </label>
                      </RadioGroup>
                    </div>

                    {formData.reason === 'loan-inquiry' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="monthlyIncome" className="text-slate-700">Monthly Income *</Label>
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

                        <div className="space-y-2">
                          <Label htmlFor="loanAmount" className="text-slate-700">Loan Amount *</Label>
                          <Input
                            id="loanAmount"
                            type="number"
                            required
                            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            value={formData.loanAmount}
                            onChange={(e) => handleChange('loanAmount', e.target.value)}
                            placeholder="Enter desired loan amount"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="loanType" className="text-slate-700">Loan Type *</Label>
                          <Select
                            value={formData.loanType}
                            onValueChange={(value) => handleChange('loanType', value)}
                            required
                          >
                            <SelectTrigger id="loanType" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors">
                              <SelectValue placeholder="Select loan type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="home-loan">Home Loan</SelectItem>
                              <SelectItem value="personal-loan">Personal Loan</SelectItem>
                              <SelectItem value="business-loan">Business Loan</SelectItem>
                              <SelectItem value="education-loan">Education Loan</SelectItem>
                              <SelectItem value="car-loan">Car Loan</SelectItem>
                              <SelectItem value="gold-loan">Gold Loan</SelectItem>
                              <SelectItem value="loan-against-property">Loan Against Property</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
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
          </ScrollAnimation>

          {/* Contact Information */}
          <ScrollAnimation direction="left" delay={0.5} duration={0.6} className="h-full">
            <div className="space-y-6 h-full">
              <Card className="border-0 shadow-xl bg-slate-900 text-white overflow-hidden rounded-2xl relative h-full">
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

                  {stats.addresses && stats.addresses.map((address) => (
                    <div key={address.id} className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 text-slate-100">{address.label}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {address.value}
                        </p>
                        {address.mapLink && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 border-slate-700 text-slate-300 hover:bg-white hover:text-slate-900 transition-colors bg-transparent h-8"
                            onClick={() => window.open(address.mapLink, '_blank')}
                          >
                            <MapPin className="h-3.5 w-3.5 mr-2" />
                            Get Directions
                          </Button>
                        )}
                        {address.phone && (
                          <div className="mt-2 text-sm text-slate-300 flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-primary" />
                            {address.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-slate-100">Email</h3>
                      <a href="mailto:support@aghaniyaenterprises.com" className="text-sm text-primary hover:text-primary/80 transition-colors">
                        support@aghaniyaenterprises.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-slate-100">Phone</h3>
                      <a href="tel:+917058519247" className="text-sm text-primary hover:text-primary/80 transition-colors block mb-1">
                        +91 70585 19247
                      </a>
                      <a href="tel:+916203301532" className="text-sm text-primary hover:text-primary/80 transition-colors block">
                        +91 62033 01532
                      </a>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800">
                    <h3 className="font-semibold text-lg mb-4 text-slate-100">Connect With Us</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
                        <Twitter className="h-5 w-5" />
                      </a>
                      <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary hover:text-white transition-colors text-slate-400">
                        <Youtube className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollAnimation>
        </div>

        {/* Our Branches Section */}
        {
          branches.length > 0 && (
            <ScrollAnimation direction="up" delay={0.5} className="mt-16 mb-8">
              <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Our Active Branches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((branch) => (
                  <Card key={branch.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg text-slate-800">{branch.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <p className="text-slate-600 text-sm">
                          {branch.address}, <br />
                          {branch.city}, {branch.state}
                        </p>
                      </div>
                      {branch.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-primary" />
                          <a href={`tel:${branch.phone}`} className="text-sm text-slate-600 hover:text-primary transition-colors">
                            {branch.phone}
                          </a>
                        </div>
                      )}
                      {branch.mapLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => window.open(branch.mapLink, '_blank')}
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          View on Map
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollAnimation>
          )
        }

        {/* Map Section */}
        <ScrollAnimation direction="up" delay={0.6} className="mt-8">
          <Card className="border-0 shadow-xl overflow-hidden rounded-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.141872851493!2d73.87327347602334!3d18.527632982567285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0587747e4eb%3A0xc3bba5b8b6c4eb82!2sSohrab%20Hall!5e0!3m2!1sen!2sin!4v1709548000000!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Card>
        </ScrollAnimation>
      </div >
    </div >
  );
}

