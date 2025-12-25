import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const banners = [
  {
    id: 1,
    title: 'FREE CIBIL SCORE CHECK IS NOW LIVE',
    subtitle: 'Check Your Cibil Score & Report Instantly!',
    cta: 'Check Now',
    bgColor: 'bg-gradient-to-r from-blue-600 to-indigo-700',
    link: '/cibil-check',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: 'Get Instant Loan Approval',
    subtitle: 'Best Interest Rates from Top Lenders',
    cta: 'Apply Now',
    bgColor: 'bg-gradient-to-r from-orange-500 to-red-600',
    link: '/loans',
    image: 'https://images.unsplash.com/photo-1565514020176-dbf2277e492f?auto=format&fit=crop&q=80&w=800'
  },
  /* {
    id: 3,
    title: 'Credit Cards for Every Lifestyle',
    subtitle: 'Exclusive Rewards and Cashback Offers',
    cta: 'Explore Cards',
    bgColor: 'bg-gradient-to-r from-green-600 to-teal-600',
    link: '/credit-cards',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800'
  } */
];

export function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl shadow-2xl">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className={`${banner.bgColor} h-full flex items-center`}>
            <div className="container mx-auto px-6 md:px-12 h-full flex flex-col md:flex-row items-center justify-between">

              {/* Left Content */}
              <div className="w-full md:w-1/2 text-left text-white z-10 pt-10 md:pt-0">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs md:text-sm font-semibold mb-4 border border-white/30 uppercase tracking-wider">
                  Featured Offer
                </span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight drop-shadow-md">
                  {banner.title}
                </h2>
                <p className="text-lg md:text-2xl mb-8 opacity-90 leading-relaxed max-w-lg">
                  {banner.subtitle}
                </p>
                <Link to={banner.link || '/'}>
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 h-12 text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-0">
                    {banner.cta}
                  </Button>
                </Link>
              </div>

              {/* Right Image */}
              <div className="w-full md:w-1/2 h-full flex items-center justify-center md:justify-end relative mt-6 md:mt-0">
                <div className="relative w-[300px] h-[200px] md:w-[500px] md:h-[350px] lg:w-[600px] lg:h-[400px]">
                  {/* Decorative abstract elements behind image */}
                  <div className="absolute -top-4 -right-4 w-full h-full bg-white/10 rounded-xl transform rotate-3 scale-105" />
                  <div className="absolute -bottom-4 -left-4 w-full h-full bg-black/10 rounded-xl transform -rotate-2 scale-105" />

                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="relative w-full h-full object-cover rounded-xl shadow-2xl transform transition-transform hover:scale-[1.02] duration-500 border-4 border-white/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

