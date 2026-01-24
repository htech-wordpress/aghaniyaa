import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Briefcase;
  return <Icon className={className} />;
};
import { BannerSlider } from '@/components/BannerSlider';
import { TeamPreview } from '@/components/TeamPreview';
import { ScrollAnimation } from '@/components/ScrollAnimation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Trophy, Users, Gift, BookOpen, CheckCircle, Calculator } from 'lucide-react';



const getDisplayLoans = (stats: CompanyStats) => {
  if (stats.loanProducts && stats.loanProducts.length > 0) {
    // Return only featured products
    return stats.loanProducts.filter(p => p.featured);
  }
  return [];
};


import { partners as allPartners } from '@/data/partners';
import { Building2 } from 'lucide-react';

import { subscribeToStats, type CompanyStats, defaultStats } from '@/lib/stats';
import { useState, useEffect } from 'react';

const homePartners = allPartners.slice(0, 10);


const advantages = [
  { title: "India's Leading Loans Distributor", icon: Trophy, image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=300&h=300&fit=crop' },
  { title: "Pan India Presence", icon: MapPin, image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&h=300&fit=crop' },
  { title: "10 Years Of Legacy", icon: Trophy, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=300&fit=crop' },
  { title: "Be Your Own Boss", icon: Users, image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=300&fit=crop' },
  { title: "Multiple Products", icon: Gift, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop' },
  { title: "Refer and Earn", icon: Gift, image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=300&fit=crop' },
  { title: "Training Programs", icon: BookOpen, image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=300&fit=crop' },
  { title: "Easy Onboarding Process", icon: CheckCircle, image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=300&h=300&fit=crop' },
  // { title: "Check Free CIBIL Score", icon: CheckCircle, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=300&fit=crop' },
  { title: "EMI Calculator", icon: Calculator, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=300&fit=crop' },
];

export function Home() {
  const [stats, setStats] = useState<CompanyStats>(defaultStats);

  useEffect(() => {
    const unsubscribe = subscribeToStats(setStats);
    return () => unsubscribe();
  }, []);

  const statsDisplay = [
    { value: stats.experience, label: 'Years of Experience' },
    { value: stats.partners, label: 'Financial Institution Partners' },
    { value: stats.cities, label: 'Cities Through A Wide Branch Network' },
    { value: stats.loansDisbursed, label: 'In Loans Disbursed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Banner Slider */}
      <section className="pb-0 pt-0">
        <BannerSlider />
      </section>

      {/* We Facilitate Section - Only show if there are featured loans */}
      {(() => {
        const displayLoans = getDisplayLoans(stats).slice(0, 10);

        if (displayLoans.length === 0) return null;

        return (
          <section className="container mx-auto px-4 py-12 md:py-20 relative z-10">
            <ScrollAnimation direction="fade" delay={0.2}>
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-2xl md:text-5xl font-extrabold text-slate-900 mb-6 drop-shadow-sm tracking-tight leading-tight">
                  We Facilitate
                </h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full mb-6"></div>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                  Wide Range of Financial Products That suits your customer's needs!
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {displayLoans.map((loan: any, index) => {
                return (
                  <ScrollAnimation key={loan.id} direction="up" delay={(index % 3) * 0.1} duration={0.4} className="h-full">
                    <Card className="hover:shadow-2xl transition-all duration-300 h-full border-slate-100 bg-white group hover:-translate-y-1 rounded-2xl overflow-hidden shadow-md flex flex-col">
                      <CardHeader className="flex flex-row items-start space-y-0 pb-2 gap-4">
                        <div className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                          {loan.icon && typeof loan.icon !== 'string' ? (
                            <loan.icon className="h-7 w-7 text-white" />
                          ) : (
                            <DynamicIcon name={loan.iconName || 'Briefcase'} className="h-7 w-7 text-white" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-slate-800 leading-tight mb-1">{loan.title}</CardTitle>
                          <p className="text-sm text-slate-600 leading-snug line-clamp-2">{loan.description}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 flex-1 flex flex-col justify-between">
                        {loan.interestRate && (
                          <div className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            {loan.interestRate}
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                          <a href="tel:+919876543210">
                            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-sm rounded-lg">
                              <span className="mr-2">📞</span> Call Now
                            </Button>
                          </a>
                          <Link to={loan.route || `/loans/${loan.id}`}>
                            <Button className="w-full bg-rose-900 hover:bg-rose-800 text-white font-semibold shadow-sm rounded-lg">
                              <span className="mr-2">🚀</span> Check Eligibility
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollAnimation>
                );
              })}

              {/* View All Card */}
              <ScrollAnimation direction="up" delay={0.1} duration={0.4} className="h-full">
                <Link to="/loans" className="block h-full">
                  <Card className="hover:shadow-2xl transition-all duration-300 h-full border-dashed border-2 border-slate-300 bg-slate-50 group hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 p-6">
                    <div className="h-20 w-20 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center mb-6 shadow-sm group-hover:border-primary group-hover:scale-110 transition-all">
                      <Briefcase className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-700 group-hover:text-primary mb-2 transition-colors">View All Loans</h3>
                    <p className="text-slate-500 text-center max-w-[200px]">Explore 50+ loan products tailored for you</p>
                    <Button variant="link" className="mt-4 text-primary font-semibold group-hover:underline">
                      Browse All Products &rarr;
                    </Button>
                  </Card>
                </Link>
              </ScrollAnimation>
            </div>
          </section>
        );
      })()}

      {/* Statistics Section */}
      <section className="bg-blue-50/50 py-12 md:py-20 border-y border-blue-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <ScrollAnimation direction="left" delay={0.2}>
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
                  <span className="text-primary">Aghaniya Enterprises LLP</span> – India's Leading Loan Distribution Company
                </h2>
                <div className="text-base md:text-lg text-slate-600 space-y-4 md:space-y-6 leading-relaxed">
                  <p>
                    At Aghaniya Enterprises LLP, we are committed to helping clients reach their financial objectives with tailored solutions.
                    With a PAN India presence in over {stats.cities} cities, we stand as one of the nation's leading credit lending establishments.
                  </p>
                  <p>
                    Founded by financial professionals with over {stats.experience} of experience, we've proudly served over 1 million clients,
                    disbursing loans exceeding {stats.loansDisbursed} through our partnerships with {stats.partners} Financial Institution Partners.
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-2 gap-8">
              {statsDisplay.map((stat, index) => (
                <ScrollAnimation key={index} direction="up" delay={index * 0.15} duration={0.6}>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:shadow-md transition-shadow">
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bank Partners Section */}
      <section className="py-12 md:py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10 opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl -z-10 opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollAnimation direction="fade" delay={0.2}>
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                Trusted by Top-Tier Lenders
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                We partner with India's leading financial institutions to bring you the best offers.
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8 mb-12">
            {homePartners.map((partner, index) => (
              <ScrollAnimation key={index} direction="up" delay={index * 0.05} duration={0.5}>
                <div
                  className={`
                    p-4 rounded-2xl border transition-all duration-300 
                    flex flex-col items-center justify-center h-28 group text-center 
                    hover:-translate-y-2 hover:shadow-xl
                    bg-white
                    ${partner.borderColor || 'border-slate-100'}
                  `}
                >
                  <div className={`
                    flex items-center justify-center transition-all
                    ${partner.logo ? 'h-full w-full' : 'h-12 w-12 mb-3 rounded-full bg-white shadow-sm group-hover:shadow-md'}
                  `}>
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="h-full w-full object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const icon = e.currentTarget.parentElement?.querySelector('svg');
                          if (icon) icon.style.display = 'block';
                        }}
                      />
                    ) : (
                      <Building2 className={`h-6 w-6 ${partner.color || 'text-slate-400'}`} />
                    )}
                    {/* Fallback icon if image fails (hidden by default if logo exists) */}
                    {partner.logo && (
                      <Building2
                        className={`h-8 w-8 hidden text-slate-300`}
                        style={{ display: 'none' }}
                      />
                    )}
                  </div>
                  {!partner.logo && (
                    <span className={`text-xs font-bold leading-tight line-clamp-2 ${partner.color ? partner.color.replace('text-', 'text-slate-800 ') : 'text-slate-700'}`}>
                      {partner.name}
                    </span>
                  )}
                </div>
              </ScrollAnimation>
            ))}
          </div>

          <ScrollAnimation direction="up" delay={0.6}>
            <div className="text-center">
              <Link to="/partners">
                <Button variant="outline" size="lg" className="border-2 border-slate-200 text-slate-700 hover:border-primary hover:text-primary hover:bg-white transition-all px-10 h-12 text-base font-semibold shadow-sm hover:shadow-md">
                  View All {allPartners.length}+ Partners
                </Button>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="bg-slate-900 py-12 md:py-20 text-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="fade" delay={0.2}>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">Why Choose Aghaniya Enterprises LLP?</h2>
              <p className="text-slate-400 text-sm md:text-base">Experience the difference with our premium services</p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <ScrollAnimation key={index} direction="rotate3d" delay={index * 0.08} duration={0.6}>
                  <div className="bg-slate-800 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 group h-full border border-slate-700 hover:border-primary/50">
                    <div className="relative h-32 w-full overflow-hidden">
                      <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors z-10" />
                      <img
                        src={advantage.image}
                        alt={advantage.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                      />
                    </div>
                    <div className="p-5 text-center relative z-20 -mt-8">
                      <div className="h-12 w-12 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:border-primary transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{advantage.title}</p>
                    </div>
                  </div>
                </ScrollAnimation>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-12 md:py-20 bg-slate-50 overflow-hidden">
        <ScrollAnimation direction="fade" delay={0.2}>
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto px-4">
              Real stories from people who have achieved their financial goals with Aghaniya Enterprises LLP
            </p>
          </div>
        </ScrollAnimation>

        <TestimonialMarquee />
      </section> */}

      {/* Our Team Preview Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <ScrollAnimation direction="fade" delay={0.3}>
          <TeamPreview />
        </ScrollAnimation>
      </section>
    </div>
  );
}

