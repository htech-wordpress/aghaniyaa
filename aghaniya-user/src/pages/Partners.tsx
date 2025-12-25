import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Card } from '@/components/ui/card';
import { partners } from '@/data/partners';
import { Building2 } from 'lucide-react';

export function Partners() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-hero-gradient py-20">
                <div className="container mx-auto px-4 text-center">
                    <ScrollAnimation direction="fade" delay={0.2}>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Lending Partners</h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            We collaborate with over {partners.length}+ leading financial institutions to bring you the best loan offers.
                        </p>
                    </ScrollAnimation>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 pb-20 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {partners.map((partner, index) => (
                        <ScrollAnimation key={index} direction="up" delay={(index % 4) * 0.05} duration={0.4} className="h-full">
                            <Card className="hover:shadow-xl transition-all duration-300 h-full border-slate-100 bg-white group hover:-translate-y-1 p-6 flex flex-col items-center justify-center text-center">
                                <div className="h-16 w-16 mb-4 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                    {/* In a real app we'd try to load partner.logo, but since they are all placeholders, we use a generic icon */}
                                    <Building2 className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
                                </div>
                                <h3 className="font-semibold text-slate-700 text-sm md:text-base leading-tight group-hover:text-primary transition-colors">
                                    {partner.name}
                                </h3>
                            </Card>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </div>
    );
}
