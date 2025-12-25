import { Card, CardContent } from '@/components/ui/card';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Card3D } from '@/components/Card3D';
import { Building2, Users, MapPin, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Building2, value: '10+', label: 'Years of Experience', color: 'text-blue-600' },
  { icon: Users, value: '10+', label: 'Financial Institution Partners', color: 'text-green-600' },
  { icon: MapPin, value: '10+', label: 'Cities Through A Wide Branch Network', color: 'text-purple-600' },
  { icon: TrendingUp, value: '₹10+ Lakh Cr+', label: 'In Loans Disbursed', color: 'text-red-600' },
];

export function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="fade" delay={0.2}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Us</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Connecting customers with the best financial products from India's top lenders.
            </p>
          </ScrollAnimation>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 pb-20 relative z-10">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScrollAnimation key={index} direction="up" delay={index * 0.15} duration={0.6}>
                <Card3D intensity={10}>
                  <Card className="text-center hover:shadow-xl transition-all duration-300 h-full border-slate-100 bg-white group hover:-translate-y-1">
                    <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center h-full">
                      <div className={`h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${stat.color.replace('text-', 'bg-').replace('600', '100')}`}>
                        <Icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                      <div className="text-4xl font-bold text-slate-800 mb-2">{stat.value}</div>
                      <div className="text-sm font-medium text-slate-500 uppercase tracking-wide px-4">{stat.label}</div>
                    </CardContent>
                  </Card>
                </Card3D>
              </ScrollAnimation>
            );
          })}
        </div>

        {/* About Content Sections */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Company Overview */}
          <ScrollAnimation direction="right" delay={0.2}>
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100">
              <div className="flex items-center mb-6">
                <div className="h-10 w-1 bg-primary rounded-full mr-4" />
                <h2 className="text-3xl font-bold text-slate-800">Who We Are</h2>
              </div>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  At <span className="font-semibold text-slate-800">AGHANIYA ENTERPRISES</span>, we are committed to helping clients reach their financial objectives with tailored solutions.
                  With a PAN India presence in over <span className="font-semibold text-slate-800">4,000 cities</span>, we stand as one of the nation's leading credit lending establishments.
                </p>
                <p>
                  Founded by financial professionals with over <span className="font-semibold text-slate-800">25 years of experience</span>, we've proudly served over 1 million clients,
                  disbursing loans exceeding 1.4 Lakh Crores through our partnerships with 275+ Financial Institution Partners.
                </p>
                <p>
                  Our mission is to make financial products accessible to everyone, providing seamless experiences and connecting
                  customers with the best loan and credit card options available in the market.
                </p>
              </div>
            </div>
          </ScrollAnimation>

          {/* Mission & Vision Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollAnimation direction="left" delay={0.3}>
              <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-lg h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp className="h-32 w-32" />
                </div>
                <h2 className="text-2xl font-bold mb-4 relative z-10">Our Mission</h2>
                <p className="text-slate-300 leading-relaxed relative z-10">
                  To democratize access to financial products and services, ensuring that every individual and business
                  has the opportunity to achieve their financial goals through our comprehensive network of trusted partners.
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="right" delay={0.4}>
              <div className="bg-blue-600 text-white rounded-2xl p-8 shadow-lg h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Building2 className="h-32 w-32" />
                </div>
                <h2 className="text-2xl font-bold mb-4 relative z-10">Our Vision</h2>
                <p className="text-blue-100 leading-relaxed relative z-10">
                  To be India's most trusted and preferred loan distribution platform, recognized for our transparency,
                  customer-centric approach, and commitment to excellence in financial services.
                </p>
              </div>
            </ScrollAnimation>
          </div>

          {/* Why Choose Us */}
          <ScrollAnimation direction="scale" delay={0.5}>
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Why Choose AGHANIYA ENTERPRISES?</h2>
                <p className="text-slate-500">The advantages that set us apart</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "10+ years of industry experience",
                  "Partnerships with 10+ financial institutions",
                  "PAN India presence in 10+ cities",
                  "Competitive interest rates and flexible terms",
                  "Quick loan processing and approval",
                  "Dedicated customer support",
                  "Wide range of financial products",
                  "Transparency in every transaction"
                ].map((item, i) => (
                  <div key={i} className="flex items-start p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-primary text-sm font-bold">✓</span>
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
}

