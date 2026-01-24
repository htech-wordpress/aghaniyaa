import { ScrollAnimation } from '@/components/ScrollAnimation';
import { partners } from '@/data/partners';
import { Building2 } from 'lucide-react';

export function Partners() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-hero-gradient py-12 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <ScrollAnimation direction="fade" delay={0.2}>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Lending Partners</h1>
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
                            <div
                                className={`
                                    p-4 rounded-2xl border transition-all duration-300 h-28
                                    flex flex-col items-center justify-center text-center 
                                    hover:-translate-y-2 hover:shadow-xl
                                    ${partner.bgColor || 'bg-white'} 
                                    ${partner.borderColor || 'border-slate-100'} 
                                    bg-white
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
                                    {/* Fallback icon if image fails */}
                                    {partner.logo && (
                                        <Building2
                                            className="h-8 w-8 hidden text-slate-300"
                                            style={{ display: 'none' }}
                                        />
                                    )}
                                </div>
                                {!partner.logo && (
                                    <h3 className={`font-bold text-xs md:text-sm leading-tight ${partner.color ? partner.color.replace('text-', 'text-slate-800 ') : 'text-slate-700'}`}>
                                        {partner.name}
                                    </h3>
                                )}
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </div>
    );
}
