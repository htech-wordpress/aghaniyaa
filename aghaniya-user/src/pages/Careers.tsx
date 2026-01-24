import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Briefcase, Users, Target } from 'lucide-react';
import { saveLeadAsync } from '@/lib/leads';

const experienceLevels = ['0-2 years', '2-5 years', '5-10 years', '10+ years'];
const departments = [
  'Sales (DSA / Channel Partner)',
  'Operations',
  'Customer Support',
  'Credit & Risk',
  'Technology & Product',
  'Marketing',
  'Other',
];
const locations = [
  'Mumbai (Head Office)',
  'Delhi NCR',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Other',
];

export function Careers() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    currentCity: '',
    preferredLocation: '',
    currentRole: '',
    department: '',
    experience: '',
    resumeLink: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await saveLeadAsync('careers', {
        ...formData,
        source: 'careers-page',
      });
      alert(
        'Thank you for your interest in building your career with Aghaniya Enterprises LLP. Our HR team will contact you soon.'
      );
      setFormData({
        fullName: '',
        email: '',
        mobile: '',
        currentCity: '',
        preferredLocation: '',
        currentRole: '',
        department: '',
        experience: '',
        resumeLink: '',
        message: '',
      });
    } catch (error) {
      console.error('Error saving careers lead', error);
      alert('Something went wrong while submitting your details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-hero-gradient py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="fade" delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Careers at Aghaniya Enterprises LLP</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4">
              Join India's leading loan distribution company and build a long-term career in financial services.
            </p>
            <p className="text-slate-400 max-w-3xl mx-auto">
              We are always looking for passionate professionals and partners who want to grow with us. Whether you are an experienced banker, a young graduate, or an ambitious DSA.
            </p>
          </ScrollAnimation>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 pb-20 relative z-10">
        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <ScrollAnimation direction="up" delay={0.1}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow bg-white text-center p-6">
              <CardContent className="pt-6">
                <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Stable & Growing Industry</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Be part of a fast-growing fintech and loan distribution ecosystem with strong demand for
                  trusted advisors and partners.
                </p>
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.2}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow bg-white text-center p-6">
              <CardContent className="pt-6">
                <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">People-First Culture</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Work with experienced leaders from banking and financial services who believe in mentorship,
                  transparency, and growth.
                </p>
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.3}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow bg-white text-center p-6">
              <CardContent className="pt-6">
                <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Opportunity to Grow</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Multiple career tracks for on-roll employees, relationship managers, tele-calling teams, and
                  independent DSA partners.
                </p>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>

        {/* Permanent Careers Content */}
        <ScrollAnimation direction="left" delay={0.2}>
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100 mb-16">
            <div className="flex items-center mb-6">
              <div className="h-10 w-1 bg-primary rounded-full mr-4" />
              <h2 className="text-3xl font-bold text-slate-800">Build Your Career with Aghaniya Enterprises LLP</h2>
            </div>

            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                Aghaniya Enterprises LLP works with leading banks, NBFCs, and financial institutions across India. Our
                distribution network helps customers choose the right loan and credit products with complete
                transparency and guidance.
              </p>
              <p>
                As part of Aghaniya Enterprises LLP, you get exposure to multiple products such as Home Loans, Personal Loans,
                Business Loans, Credit Cards, Loan Against Property, Car Loans, and more. We provide structured
                training, product knowledge, and on-field support.
              </p>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mt-6">
                <ul className="grid md:grid-cols-2 gap-4">
                  {[
                    "Pan-India opportunities for sales, operations, and support roles",
                    "Attractive incentive and payout structures for high performers",
                    "Opportunity to work directly with leading banks and NBFCs",
                    "Strong backend operations, technology, and support team"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start text-base">
                      <span className="text-primary mr-2 font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="font-medium text-slate-800 pt-4">
                If you are ambitious, customer-focused, and want to build a serious career in financial
                distribution, share your details below and our HR / business team will connect with you.
              </p>
            </div>
          </div>
        </ScrollAnimation>

        {/* Careers Form */}
        <ScrollAnimation direction="right" delay={0.2}>
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white overflow-hidden rounded-2xl">
              <div className="h-2 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900" />
              <CardHeader className="text-center pb-2 pt-8">
                <CardTitle className="text-3xl font-bold text-slate-800">Share Your Profile</CardTitle>
                <CardDescription className="text-lg text-slate-500">
                  Fill in your details and our HR team will reach out with suitable opportunities.
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
                      <Label htmlFor="currentCity" className="text-slate-700">Current City *</Label>
                      <Input
                        id="currentCity"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        value={formData.currentCity}
                        onChange={(e) => handleChange('currentCity', e.target.value)}
                        placeholder="Enter your current city"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferredLocation" className="text-slate-700">Preferred Location *</Label>
                      <Select
                        value={formData.preferredLocation}
                        onValueChange={(value) => handleChange('preferredLocation', value)}
                        required
                      >
                        <SelectTrigger id="preferredLocation" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors">
                          <SelectValue placeholder="Select preferred work location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentRole" className="text-slate-700">Current Role / Designation *</Label>
                      <Input
                        id="currentRole"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        value={formData.currentRole}
                        onChange={(e) => handleChange('currentRole', e.target.value)}
                        placeholder="e.g. Relationship Manager, DSA, Telecaller"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-slate-700">Department / Area of Interest *</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => handleChange('department', value)}
                        required
                      >
                        <SelectTrigger id="department" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-slate-700">Total Experience *</Label>
                      <Select
                        value={formData.experience}
                        onValueChange={(value) => handleChange('experience', value)}
                        required
                      >
                        <SelectTrigger id="experience" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors">
                          <SelectValue placeholder="Select experience range" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((exp) => (
                            <SelectItem key={exp} value={exp}>
                              {exp}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="resumeLink" className="text-slate-700">Resume / LinkedIn Profile *</Label>
                      <Input
                        id="resumeLink"
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        value={formData.resumeLink}
                        onChange={(e) => handleChange('resumeLink', e.target.value)}
                        placeholder="Paste drive link / resume link / LinkedIn URL"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-700">Brief About You</Label>
                    <Textarea
                      id="message"
                      className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Share a brief about your experience, targets handled, and achievements."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full text-lg h-12 shadow-lg shadow-primary/20" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Profile'}
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
