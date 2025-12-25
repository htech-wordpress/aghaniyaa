import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase } from 'lucide-react';
import type { TeamMember } from '@/pages/OurTeam';

const previewMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    position: 'Senior Financial Advisor & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    experience: '15+ Years',
    description: 'Rajesh Kumar is a seasoned financial professional with over 15 years of experience in the banking and finance industry.',
    education: 'MBA in Finance, Chartered Financial Analyst (CFA)',
    specializations: [],
    achievements: [],
    email: '',
    phone: ''
  },
  {
    id: '2',
    name: 'Priya Sharma',
    position: 'Loan Distribution Specialist & COO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    experience: '12+ Years',
    description: 'Priya Sharma brings extensive expertise in loan distribution and customer relations with a proven track record.',
    education: 'M.Com, Certified Credit Professional (CCP)',
    specializations: [],
    achievements: [],
    email: '',
    phone: ''
  },
];

export function TeamPreview() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p className="text-xl text-gray-600">
            Experienced financial experts dedicated to your success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
          {previewMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              {/* Image at Top */}
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/Assets/placeholder-img.svg';
                    }}
                />
              </div>
              {/* Content Below Image */}
              <CardContent className="p-6 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary font-semibold mb-3">{member.position}</p>
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm">{member.experience} Experience</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/our-team">
            <Button size="lg" variant="outline" className="group">
              Read More About Our Team
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

