import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Card, CardContent } from '@/components/ui/card';
import { Card3D } from '@/components/Card3D';

const certificates = [
    {
        title: "Best Financial Distributor 2024",
        issuer: "Finance Excellence Awards",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
        description: "Reasonable for outstanding performance in loan distribution across India."
    },
    {
        title: "Excellence in Customer Service",
        issuer: "Banking & Finance Summit",
        image: "https://images.unsplash.com/photo-1628173456073-61fc32658a5c?w=800&q=80",
        description: "Awarded for achieving the highest customer satisfaction scores in the industry."
    },
    {
        title: "Top Channel Partner",
        issuer: "Major National Bank",
        image: "https://images.unsplash.com/photo-1607567849646-3bb8e7dfd1b3?w=800&q=80",
        description: "Recognized as the top-performing DSA partner for the fiscal year 2023-24."
    }
];

export function CertificatesAwards() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-hero-gradient py-20">
                <div className="container mx-auto px-4 text-center">
                    <ScrollAnimation direction="fade" delay={0.2}>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Certificates & Awards</h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Our commitment to excellence and customer satisfaction has been recognized by industry leaders.
                        </p>
                    </ScrollAnimation>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 pb-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert, index) => (
                        <ScrollAnimation key={index} direction="up" delay={index * 0.1}>
                            <Card3D>
                                <Card className="overflow-hidden border-0 shadow-xl h-full">
                                    <div className="h-64 overflow-hidden relative group">
                                        <img
                                            src={cert.image}
                                            alt={cert.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                            <p className="text-white font-medium">{cert.issuer}</p>
                                        </div>
                                    </div>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">{cert.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            {cert.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Card3D>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </div>
    );
}
