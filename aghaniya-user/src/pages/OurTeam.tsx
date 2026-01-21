import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Card3D } from '@/components/Card3D';
import { Linkedin, Mail, Phone, Award, Briefcase, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { teamMembers } from '@/data/teamMembers';



export function OurTeam() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-hero-gradient py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="scale" delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our CMD Desk</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Meet our experienced financial experts dedicated to helping you achieve your financial goals.
            </p>
          </ScrollAnimation>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 pb-20 relative z-10">
        {/* Team Members */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <ScrollAnimation key={member.id} direction="up" delay={index * 0.2} duration={0.7}>
              <Card3D intensity={15}>
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col border-0 shadow-lg bg-white h-full group">
                  {/* Image at Top */}
                  <div className="relative w-full h-64 md:h-80 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors z-10" />
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/Assets/placeholder-img.svg';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20">
                      <h2 className="text-3xl font-bold text-white mb-1">{member.name}</h2>
                      <p className="text-primary font-semibold text-lg">{member.position}</p>
                    </div>
                  </div>

                  {/* Details Below Image */}
                  <div className="p-8 flex-1 flex flex-col space-y-6">
                    <div className="space-y-4 text-slate-700">
                      {/* Experience */}
                      <div className="flex items-center gap-3 text-slate-800 bg-slate-50 p-3 rounded-lg">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Experience:</span>
                        <span>{member.experience}</span>
                      </div>

                      {/* Education */}
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block text-slate-900">Education: </span>
                          <span className="text-slate-600">{member.education}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 leading-relaxed text-sm border-l-2 border-primary/30 pl-4 italic">
                        "{member.description}"
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-2">
                      {/* Specializations */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" /> Specializations
                        </h4>
                        <ul className="space-y-2">
                          {member.specializations.map((spec, index) => (
                            <li key={index} className="flex items-start text-sm text-slate-600">
                              <span className="text-primary mr-2 mt-0.5">›</span>
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Achievements */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" /> Achievements
                        </h4>
                        <ul className="space-y-2">
                          {member.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start text-sm text-slate-600">
                              <span className="text-primary mr-2 mt-0.5">•</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-100 mt-auto">
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors bg-slate-50 px-3 py-1.5 rounded-full hover:bg-primary/5"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors bg-slate-50 px-3 py-1.5 rounded-full hover:bg-primary/5"
                      >
                        <Phone className="h-4 w-4" />
                        {member.phone}
                      </a>
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors bg-slate-50 px-3 py-1.5 rounded-full hover:bg-primary/5"
                        >
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </Card3D>
            </ScrollAnimation>
          ))}
        </div>

        {/* CTA */}
        <ScrollAnimation direction="fade" delay={0.4}>
          <div className="text-center mt-16 p-8 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Want to talk to our experts?</h3>
            <p className="text-slate-600 mb-6">Our team is ready to guide you through your financial journey.</p>
            <Link to="/contact">
              <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                Get in Touch with Our Team
              </Button>
            </Link>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
}

