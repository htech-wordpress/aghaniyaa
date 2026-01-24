import { ScrollAnimation } from '@/components/ScrollAnimation';
import { TestimonialCard } from '@/components/TestimonialCard';
import { testimonials } from '@/data/testimonials';

export function Testimonials() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-hero-gradient py-12 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <ScrollAnimation direction="fade" delay={0.2}>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Client Testimonials</h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Don't just take our word for it. Hear what our satisfied customers have to say about their experience with Aghaniya Enterprises LLP.
                        </p>
                    </ScrollAnimation>
                </div>
            </div>

            {/* Testimonials Grid */}
            <div className="container mx-auto px-4 -mt-16 pb-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <ScrollAnimation key={testimonial.id} direction="up" delay={index * 0.1} duration={0.5}>
                            <TestimonialCard testimonial={testimonial} />
                        </ScrollAnimation>
                    ))}
                </div>

                {/* Call to Action */}
                <ScrollAnimation direction="fade" delay={0.6}>
                    <div className="mt-20 text-center bg-white rounded-2xl p-10 shadow-lg border border-slate-100 max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to Write Your Own Success Story?</h2>
                        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                            Join thousands of happy customers who have trusted Aghaniya Enterprises LLP for their financial needs.
                        </p>
                        <a href="/contact" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-2">
                            Get Started Today
                        </a>
                    </div>
                </ScrollAnimation>
            </div>
        </div>
    );
}
