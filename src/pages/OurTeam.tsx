import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Card3D } from '@/components/Card3D';
import { Linkedin, Mail, Phone, Award, Briefcase, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  experience: string;
  description: string;
  education: string;
  specializations: string[];
  achievements: string[];
  email: string;
  phone: string;
  linkedin?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    position: 'Senior Financial Advisor & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    experience: '15+ Years',
    description: 'Rajesh Kumar is a seasoned financial professional with over 15 years of experience in the banking and finance industry. He specializes in helping individuals and businesses secure the best loan options tailored to their needs.',
    education: 'MBA in Finance, Chartered Financial Analyst (CFA)',
    specializations: [
      'Home Loans & Property Financing',
      'Business Loans & Working Capital',
      'Investment Advisory',
      'Credit Risk Assessment'
    ],
    achievements: [
      'Successfully processed loans worth ₹500+ Crores',
      'Awarded "Best Loan Advisor" by Financial Services Association',
      'Helped 5000+ customers achieve their financial goals',
      'Expert in CIBIL score improvement strategies'
    ],
    email: 'rajesh.kumar@aghaniya.com',
    phone: '+91 98765 43210',
    linkedin: 'https://linkedin.com/in/rajeshkumar'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    position: 'Loan Distribution Specialist & COO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    experience: '12+ Years',
    description: 'Priya Sharma brings extensive expertise in loan distribution and customer relations. With a proven track record of facilitating smooth loan processes, she ensures clients receive the best financial solutions with minimal hassle.',
    education: 'M.Com, Certified Credit Professional (CCP)',
    specializations: [
      'Personal Loans & Quick Disbursal',
      'Credit Cards & Rewards Programs',
      'Education Loans',
      'Gold Loans & Asset-backed Financing'
    ],
    achievements: [
      'Processed 3000+ loan applications successfully',
      'Maintained 98% customer satisfaction rate',
      'Recognized for "Excellence in Customer Service"',
      'Expert in multi-product financial solutions'
    ],
    email: 'priya.sharma@aghaniya.com',
    phone: '+91 98765 43211',
    linkedin: 'https://linkedin.com/in/priyasharma'
  },
];

export function OurTeam() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <ScrollAnimation direction="scale" delay={0.2}>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Team</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet our experienced financial experts dedicated to helping you achieve your financial goals
            </p>
          </div>
        </ScrollAnimation>

        {/* Team Members */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <ScrollAnimation key={member.id} direction="up" delay={index * 0.2} duration={0.7}>
              <Card3D intensity={15}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
              {/* Image at Top */}
              <div className="relative w-full h-80 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        (e.target as HTMLImageElement).src = '/Assets/placeholder-img.svg';
                      }}
                />
              </div>

              {/* Details Below Image */}
              <div className="p-6 flex-1 flex flex-col">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-2xl mb-2">{member.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-primary">
                    {member.position}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 space-y-4">
                    {/* Experience */}
                    <div className="flex items-center gap-2 text-gray-700">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Experience:</span>
                      <span>{member.experience}</span>
                    </div>

                    {/* Education */}
                    <div className="flex items-start gap-2 text-gray-700">
                      <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold">Education: </span>
                        <span>{member.education}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600">{member.description}</p>

                    {/* Specializations */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Specializations:</h4>
                      <ul className="space-y-1">
                        {member.specializations.map((spec, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <span className="text-primary mr-2">✓</span>
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Key Achievements:
                      </h4>
                      <ul className="space-y-1">
                        {member.achievements.map((achievement, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            • {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Phone className="h-4 w-4" />
                        {member.phone}
                      </a>
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </CardContent>
              </div>
                </Card>
              </Card3D>
            </ScrollAnimation>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/contact">
            <Button size="lg">
              Get in Touch with Our Team
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

