import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Calendar } from 'lucide-react';

const mediaArticles = [
    {
        title: "Aghaniya Enterprises Expands Loan Distribution Network to 4000+ Cities",
        publication: "Financial Express",
        date: "Dec 15, 2024",
        image: "https://images.unsplash.com/photo-1579532551605-2b484501a1db?w=800&q=80",
        excerpt: "The leading loan distributor announces major expansion plans to cover tier-2 and tier-3 cities across India.",
        link: "#"
    },
    {
        title: "How DSAs are Changing the Lending Landscape in India",
        publication: "The Economic Times",
        date: "Nov 22, 2024",
        image: "https://images.unsplash.com/photo-1556740926-216503b4d45d?w=800&q=80",
        excerpt: "An in-depth look at how companies like Aghaniya Enterprises are bridging the gap between borrowers and banks.",
        link: "#"
    },
    {
        title: "Top 10 Fintech Startups to Watch in 2025",
        publication: "YourStory",
        date: "Oct 10, 2024",
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
        excerpt: "Aghaniya Enterprises featured among the top innovative financial services companies revolutionizing credit access.",
        link: "#"
    }
];

export function Media() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-hero-gradient py-20">
                <div className="container mx-auto px-4 text-center">
                    <ScrollAnimation direction="fade" delay={0.2}>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">We Are In Media</h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Read about our latest news, features, and contributions to the financial industry.
                        </p>
                    </ScrollAnimation>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 pb-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mediaArticles.map((article, index) => (
                        <ScrollAnimation key={index} direction="up" delay={index * 0.1}>
                            <Card className="overflow-hidden border-0 shadow-xl h-full bg-white hover:shadow-2xl transition-all duration-300 group">
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
                                        {article.publication}
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex items-center text-slate-400 text-xs mb-3">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {article.date}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {article.excerpt}
                                    </p>
                                    <a href={article.link} className="inline-flex items-center text-primary text-sm font-semibold hover:underline">
                                        Read Full Story <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                </CardContent>
                            </Card>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </div>
    );
}
