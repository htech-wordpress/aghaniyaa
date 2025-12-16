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
    bgColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
    link: '/cibil-check',
  },
  {
    id: 2,
    title: 'Get Instant Loan Approval',
    subtitle: 'Best Interest Rates from Top Lenders',
    cta: 'Apply Now',
    bgColor: 'bg-gradient-to-r from-red-600 to-pink-600',
    link: '/loans',
  },
  {
    id: 3,
    title: 'Credit Cards for Every Lifestyle',
    subtitle: 'Exclusive Rewards and Cashback Offers',
    cta: 'Explore Cards',
    bgColor: 'bg-gradient-to-r from-green-600 to-teal-600',
    link: '/credit-cards',
  },
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
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`${banner.bgColor} h-full flex items-center justify-center`}>
            <div className="text-center text-white px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{banner.title}</h2>
              <p className="text-xl md:text-2xl mb-8">{banner.subtitle}</p>
              <Link to={banner.link || '/'}>
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  {banner.cta}
                </Button>
              </Link>
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
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

