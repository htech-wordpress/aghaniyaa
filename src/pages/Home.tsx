import { Link } from 'react-router-dom';
import { BannerSlider } from '@/components/BannerSlider';
import { TeamPreview } from '@/components/TeamPreview';
import { ScrollAnimation, ScrollParallax } from '@/components/ScrollAnimation';
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
    <div className="min-h-screen">
      {/* Hero Section with Banner Slider */}
      <section className="container mx-auto px-4 py-8">
        <BannerSlider />
      </section>

      {/* We Facilitate Section */}
      <section className="container mx-auto px-4 py-12">
        <ScrollAnimation direction="fade" delay={0.2}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">We Facilitate</h2>
            <p className="text-xl text-gray-600">
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
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <Icon className="h-12 w-12 text-primary mb-4" />
                      <CardTitle className="text-xl">{loan.title}</CardTitle>
                      <CardDescription>{loan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to={loan.link}>
                        <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-white">
                          Check Eligibility →
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
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="scale" delay={0.2}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                AGHANIYA – India's Leading Loan Distribution Company
              </h2>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ScrollAnimation key={index} direction="up" delay={index * 0.15} duration={0.6}>
                <ScrollParallax speed={0.3}>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-lg text-gray-600">{stat.label}</div>
                  </div>
                </ScrollParallax>
              </ScrollAnimation>
            ))}
          </div>

          <div className="mt-12 text-center text-gray-700 max-w-4xl mx-auto">
            <p className="text-lg">
              At AGHANIYA, we are committed to helping clients reach their financial objectives with tailored solutions. 
              With a PAN India presence in over 4,000 cities, we stand as one of the nation's leading credit lending establishments. 
              Founded by financial professionals with over 25 years of experience, we've proudly served over 1 million clients, 
              disbursing loans exceeding 1.4 Lakh Crores through our partnerships with 275+ Financial Institution Partners.
            </p>
          </div>
        </div>
      </section>

      {/* Bank Partners Section */}
      <section className="container mx-auto px-4 py-16">
        <ScrollAnimation direction="fade" delay={0.2}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Get Loans from India's Top-Tier Lenders
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by leading financial institutions across India
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <ScrollAnimation key={index} direction="scale" delay={index * 0.1} duration={0.5}>
              <Card3D intensity={8}>
                <Card className="p-4 text-center hover:shadow-md transition-shadow bg-white">
                  <CardContent className="flex items-center justify-center h-24 p-2">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      loading="lazy"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        // Fallback to placeholder if image fails
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('placeholder-img.svg')) {
                          target.src = '/Assets/placeholder-img.svg';
                          return;
                        }
                        // Fallback to text if placeholder also fails
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.fallback-text')) {
                          target.style.display = 'none';
                          const span = document.createElement('span');
                          span.className = 'fallback-text text-xs font-semibold text-gray-700 px-2';
                          span.textContent = partner.name;
                          parent.appendChild(span);
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Card3D>
            </ScrollAnimation>
          ))}
        </div>
      </section>

      {/* Advantages Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="fade" delay={0.2}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Advantages of AGHANIYA</h2>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <ScrollAnimation key={index} direction="rotate3d" delay={index * 0.08} duration={0.6}>
                  <Card3D intensity={12}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow group h-full">
                      <div className="relative h-32 w-full overflow-hidden">
                        <img
                          src={advantage.image}
                          alt={advantage.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback to icon if image fails
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.icon-fallback')) {
                              const iconDiv = document.createElement('div');
                              iconDiv.className = 'icon-fallback flex items-center justify-center h-full bg-primary/10';
                              parent.appendChild(iconDiv);
                            }
                          }}
                        />
                      </div>
                      <CardContent className="p-4 text-center">
                        <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">{advantage.title}</p>
                      </CardContent>
                    </Card>
                  </Card3D>
                </ScrollAnimation>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Team Preview Section */}
      <ScrollAnimation direction="fade" delay={0.3}>
        <TeamPreview />
      </ScrollAnimation>
    </div>
  );
}

