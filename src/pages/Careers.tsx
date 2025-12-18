import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Briefcase, Users, Target } from 'lucide-react';
import { saveLeadAsync } from '@/lib/storage';

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
        'Thank you for your interest in building your career with AGHANIYA. Our HR team will contact you soon.'
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <ScrollAnimation direction="fade" delay={0.2}>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Careers at AGHANIYA</h1>
            <p className="text-lg text-gray-600 mb-4">
              Join India&apos;s leading loan distribution company and build a long-term career in financial
              services.
            </p>
            <p className="text-md text-gray-500">
              We are always looking for passionate professionals and partners who want to grow with us. Whether
              you are an experienced banker, a young graduate, or an ambitious DSA / channel partner, AGHANIYA
              offers multiple career paths across India.
            </p>
          </div>
        </ScrollAnimation>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <ScrollAnimation direction="up" delay={0.1}>
            <Card className="h-full">
              <CardHeader>
                <Briefcase className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Stable &amp; Growing Industry</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Be part of a fast-growing fintech and loan distribution ecosystem with strong demand for
                  trusted advisors and partners.
                </p>
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.2}>
            <Card className="h-full">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>People-First Culture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Work with experienced leaders from banking and financial services who believe in mentorship,
                  transparency, and growth.
                </p>
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.3}>
            <Card className="h-full">
              <CardHeader>
                <Target className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Opportunity to Grow</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Multiple career tracks for on-roll employees, relationship managers, tele-calling teams, and
                  independent DSA partners.
                </p>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>

        {/* Permanent Careers Content */}
        <ScrollAnimation direction="left" delay={0.2}>
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Build Your Career with AGHANIYA</CardTitle>
              <CardDescription>
                Long-term, performance-driven opportunities in financial services and loan distribution.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 text-sm md:text-base">
              <p>
                AGHANIYA works with leading banks, NBFCs, and financial institutions across India. Our
                distribution network helps customers choose the right loan and credit products with complete
                transparency and guidance.
              </p>
              <p>
                As part of AGHANIYA, you get exposure to multiple products such as Home Loans, Personal Loans,
                Business Loans, Credit Cards, Loan Against Property, Car Loans, and more. We provide structured
                training, product knowledge, and on-field support.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Pan-India opportunities for sales, operations, and support roles</li>
                <li>Attractive incentive and payout structures for high performers</li>
                <li>Opportunity to work directly with leading banks and NBFCs</li>
                <li>Strong backend operations, technology, and support team</li>
              </ul>
              <p>
                If you are ambitious, customer-focused, and want to build a serious career in financial
                distribution, share your details below and our HR / business team will connect with you.
              </p>
            </CardContent>
          </Card>
        </ScrollAnimation>

        {/* Careers Form */}
        <ScrollAnimation direction="right" delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle>Share Your Profile</CardTitle>
              <CardDescription>
                Fill in your details and our HR team will reach out with suitable opportunities.
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
                    <Label htmlFor="currentCity">Current City *</Label>
                    <Input
                      id="currentCity"
                      required
                      value={formData.currentCity}
                      onChange={(e) => handleChange('currentCity', e.target.value)}
                      placeholder="Enter your current city"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferredLocation">Preferred Location *</Label>
                    <Select
                      value={formData.preferredLocation}
                      onValueChange={(value) => handleChange('preferredLocation', value)}
                      required
                    >
                      <SelectTrigger id="preferredLocation">
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

                  <div>
                    <Label htmlFor="currentRole">Current Role / Designation *</Label>
                    <Input
                      id="currentRole"
                      required
                      value={formData.currentRole}
                      onChange={(e) => handleChange('currentRole', e.target.value)}
                      placeholder="e.g. Relationship Manager, DSA, Telecaller"
                    />
                  </div>

                  <div>
                    <Label htmlFor="department">Department / Area of Interest *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleChange('department', value)}
                      required
                    >
                      <SelectTrigger id="department">
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

                  <div>
                    <Label htmlFor="experience">Total Experience *</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => handleChange('experience', value)}
                      required
                    >
                      <SelectTrigger id="experience">
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

                  <div>
                    <Label htmlFor="resumeLink">Resume / LinkedIn Profile *</Label>
                    <Input
                      id="resumeLink"
                      required
                      value={formData.resumeLink}
                      onChange={(e) => handleChange('resumeLink', e.target.value)}
                      placeholder="Paste drive link / resume link / LinkedIn URL"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Brief About You</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Share a brief about your experience, targets handled, and achievements."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </ScrollAnimation>
      </div>
    </div>
  );
}
