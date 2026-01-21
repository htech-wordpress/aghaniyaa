import { TestimonialCard } from './TestimonialCard';
import { testimonials } from '@/data/testimonials';

export function TestimonialMarquee() {
    // Duplicate testimonials to create seamless loop
    const displayTestimonials = [...testimonials, ...testimonials, ...testimonials];

    return (
        <div className="w-full overflow-hidden py-10 bg-slate-50 relative">
            {/* Gradient masks for smooth fade at edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]">
                {displayTestimonials.map((testimonial, index) => (
                    <div key={`${testimonial.id}-${index}`} className="w-[320px] flex-shrink-0">
                        <TestimonialCard testimonial={testimonial} />
                    </div>
                ))}
            </div>
        </div>
    );
}
