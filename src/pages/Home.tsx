import { Link } from 'react-router-dom';
import { BannerSlider } from '@/components/BannerSlider';
import { TeamPreview } from '@/components/TeamPreview';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Card3D } from '@/components/Card3D';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home as HomeIcon, Building2, Briefcase, GraduationCap, Car, CreditCard, Gem, Landmark, MapPin, Trophy, Users, Gift, BookOpen, CheckCircle, Calculator } from 'lucide-react';

const loanTypes = [
  {
    id: 'home-loan',
    title: 'Home Loan',
    description: 'Your Dream Home Awaits - Explore Our Range Of Home Loan Products.',
    icon: HomeIcon,
    link: '/loans/home-loan',
  },
  {
    id: 'loan-against-property',
    title: 'Loan against Property',
    description: 'Unlock your property\'s value with tailored loan solutions.',
    icon: Landmark,
    link: '/loans/loan-against-property',
  },
  {
    id: 'personal-loan',
    title: 'Personal Loan',
    description: 'Achieve your dreams with our versatile personal loan options.',
    icon: Briefcase,
    link: '/loans/personal-loan',
  },
  {
    id: 'business-loan',
    title: 'Business Loan',
    description: 'Boost your business growth with our flexible financing options.',
    icon: Building2,
    link: '/loans/business-loan',
  },
  {
    id: 'education-loan',
    title: 'Education Loan',
    description: 'Invest in your child\'s future with our specialized education loans.',
    icon: GraduationCap,
    link: '/loans/education-loan',
  },
  {
    id: 'car-loan',
    title: 'Car Loan',
    description: 'Drive your dream car with our quick and flexible car loans.',
    icon: Car,
    link: '/loans/car-loan',
  },
  {
    id: 'gold-loan',
    title: 'Gold Loan',
    description: 'Meet your financial needs with gold loans from trusted banks.',
    icon: Gem,
    link: '/loans/gold-loan',
  },
  {
    id: 'credit-cards',
    title: 'Credit Cards',
    description: 'Upgrade your lifestyle with feature-packed, rewarding credit cards.',
    icon: CreditCard,
    link: '/credit-cards',
  },
];

const stats = [
  { value: '25+', label: 'Years of Experience' },
  { value: '275+', label: 'Financial Institution Partners' },
  { value: '4,000+', label: 'Cities Through A Wide Branch Network' },
  { value: '₹1.4 Lakh Cr+', label: 'In Loans Disbursed' },
];

const partners = [
  {
    name: 'Axis Bank',
    logo: '/Assets/Axis Bank_idJBXQBHwi_1.png'
  },
  {
    name: 'Bajaj Finserv',
    logo: '/Assets/bajaj-loan-finance--aghaniyaenterprises.jpeg'
  },
  {
    name: 'HDFC Bank',
    logo: '/Assets/HDFC Bank_id6pGb_xHe_1.png'
  },
  {
    name: 'SBI',
    logo: '/Assets/State Bank of India_id95r1JSPJ_2.png'
  },
  {
    name: 'Piramal Finance',
    logo: '/Assets/Piramal Finance_idrE5R2BaP_0.png'
  },
  {
    name: 'RBL Bank',
    logo: '/Assets/rbl--aghaniyaenterprises.png'
  },
  {
    name: 'ICICI Bank',
    logo: '/Assets/ICICI Bank_id_NFCjbgj_1.png'
  },
  {
    name: 'Kotak Bank',
    logo: '/Assets/Kotak Mahindra Bank_idVNFKKm-u_0.svg'
  },
  {
    name: 'Edelweiss',
    logo: '/Assets/placeholder-img.svg'
  },
  {
    name: 'SMFG India Credit',
    logo: '/Assets/placeholder-img.svg'
  },
];

const advantages = [
  { title: "India's Leading Loans Distributor", icon: Trophy, image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=300&h=300&fit=crop' },
  { title: "Pan India Presence", icon: MapPin, image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&h=300&fit=crop' },
  { title: "25 Years Of Legacy", icon: Trophy, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=300&fit=crop' },
  { title: "Be Your Own Boss", icon: Users, image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=300&fit=crop' },
  { title: "Multiple Products", icon: Gift, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop' },
  { title: "Refer and Earn", icon: Gift, image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=300&fit=crop' },
  { title: "Training Programs", icon: BookOpen, image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=300&fit=crop' },
  { title: "Easy Onboarding Process", icon: CheckCircle, image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=300&h=300&fit=crop' },
  { title: "Check Free CIBIL Score", icon: CheckCircle, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=300&fit=crop' },
  { title: "EMI Calculator", icon: Calculator, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=300&fit=crop' },
];

export function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Banner Slider */}
      <section className="bg-hero-gradient pb-12 md:pb-20 pt-8 md:pt-10">
        <div className="container mx-auto px-4">
          <BannerSlider />
        </div>
      </section>

      {/* We Facilitate Section - Overlapping Cards */}
      <section className="container mx-auto px-4 -mt-16 relative z-10 mb-20">
        <ScrollAnimation direction="fade" delay={0.2}>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 drop-shadow-sm bg-white/80 inline-block px-4 py-1.5 md:px-6 md:py-2 rounded-full backdrop-blur-sm shadow-sm">
              We Facilitate
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Wide Range of Financial Products That suits your customer's needs!
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loanTypes.map((loan, index) => {
            const Icon = loan.icon;
            return (
              <ScrollAnimation key={loan.id} direction="up" delay={index * 0.1} duration={0.5}>
                <Card3D intensity={10}>
                  <Card className="hover:shadow-xl transition-all duration-300 h-full border-slate-100 bg-white group hover:-translate-y-1">
                    <CardHeader className="space-y-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <CardTitle className="text-xl text-slate-800">{loan.title}</CardTitle>
                      <CardDescription className="text-slate-500 text-sm leading-relaxed">{loan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to={loan.link}>
                        <Button variant="ghost" className="w-full justify-between hover:bg-slate-50 text-primary font-medium group-hover:text-primary/80">
                          Check Eligibility <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </Card3D>
              </ScrollAnimation>
            );
          })}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white py-12 md:py-20 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <ScrollAnimation direction="left" delay={0.2}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
                  <span className="text-primary">AGHANIYA</span> – India's Leading Loan Distribution Company
                </h2>
                <div className="text-base md:text-lg text-slate-600 space-y-4 md:space-y-6 leading-relaxed">
                  <p>
                    At AGHANIYA, we are committed to helping clients reach their financial objectives with tailored solutions.
                    With a PAN India presence in over 4,000 cities, we stand as one of the nation's leading credit lending establishments.
                  </p>
                  <p>
                    Founded by financial professionals with over 25 years of experience, we've proudly served over 1 million clients,
                    disbursing loans exceeding 1.4 Lakh Crores through our partnerships with 275+ Financial Institution Partners.
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
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
      <section className="container mx-auto px-4 py-12 md:py-20">
        <ScrollAnimation direction="fade" delay={0.2}>
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-4">
              Trusted by Top-Tier Lenders
            </h2>
            <p className="text-base md:text-lg text-slate-600">
              We partner with India's leading financial institutions
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
          {partners.map((partner, index) => (
            <ScrollAnimation key={index} direction="scale" delay={index * 0.05} duration={0.5}>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-center h-32 group">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-12 max-w-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"
                  loading="lazy"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('placeholder-img.svg')) {
                      target.src = '/Assets/placeholder-img.svg';
                      return;
                    }
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.fallback-text')) {
                      const span = document.createElement('span');
                      span.className = 'fallback-text text-sm font-semibold text-slate-700 text-center';
                      span.textContent = partner.name;
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </section>

      {/* Advantages Section */}
      <section className="bg-slate-900 py-12 md:py-20 text-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="fade" delay={0.2}>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Why Choose AGHANIYA?</h2>
              <p className="text-slate-400 text-sm md:text-base">Experience the difference with our premium services</p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
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

      {/* Our Team Preview Section */}
      <section className="py-20 bg-slate-50">
        <ScrollAnimation direction="fade" delay={0.3}>
          <TeamPreview />
        </ScrollAnimation>
      </section>
    </div>
  );
}

