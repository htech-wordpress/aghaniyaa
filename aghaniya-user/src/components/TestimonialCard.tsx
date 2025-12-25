import { Star, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
    testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <Card className="h-full border-0 shadow-lg bg-white rounded-xl overflow-hidden min-w-[300px] max-w-[350px]">
            <CardContent className="p-6 flex flex-col h-full">
                {/* Rating Section */}
                <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-5 w-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                    ))}
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-4">(Rating: {testimonial.rating})</p>

                {/* Testimonial Text */}
                <div className="flex-grow mb-6">
                    <p className="text-slate-600 leading-relaxed italic relative">
                        <span className="text-4xl text-primary/20 absolute -top-4 -left-2">“</span>
                        {testimonial.text}
                        <span className="text-4xl text-primary/20 absolute -bottom-4 -right-2">”</span>
                    </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 w-full mb-4" />

                {/* User Info */}
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                        {/* Using a generic User icon as fallback or primary if no avatar image actually exists */}
                        <User className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">{testimonial.name}</p>
                        <p className="text-xs text-slate-500">{testimonial.role}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
