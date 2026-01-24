import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const banners = [
  {
    id: 1,
    title: 'Quick & Easy Financial Solutions',
    subtitle: 'Loans tailored to your specific needs.',
    cta: 'Apply Now',
    bgColor: 'bg-gradient-to-r from-blue-700 to-cyan-600',
    link: '/loans',
    image: '/assets/banner_v2_new_1.png'
  },
  {
    id: 2,
    title: 'Achieve Your Dreams Today',
    subtitle: 'Home, Car, and Personal Loans at the best rates.',
    cta: 'Check Eligibility',
    bgColor: 'bg-gradient-to-r from-emerald-600 to-lime-600',
    link: '/loans/personal-loan',
    image: '/assets/banner_v2_new_2.png'
  },
  {
    id: 3,
    title: 'Expand Your Business',
    subtitle: 'Growth capital customized for your business goals.',
    cta: 'Get Business Loan',
    bgColor: 'bg-gradient-to-r from-indigo-800 to-purple-700',
    link: '/loans/business-loan',
    image: '/assets/banner_v2_new_3.png'
  },
  {
    id: 4,
    title: 'We are Aghaniya Enterprises LLP',
    subtitle: 'India’s Safe and Simplest Loan Distributor',
    cta: 'Contact Now',
    bgColor: 'bg-gradient-to-r from-blue-600 to-indigo-700',
    link: '/contact',
    image: '/assets/banner_v2_1.png'
  },
  {
    id: 5,
    title: 'Join Aghaniya Enterprises LLP as a Financial Advisor',
    subtitle: 'Be a part of a large and growing family of 500+ partners.',
    cta: 'Join Now',
    bgColor: 'bg-gradient-to-r from-orange-500 to-red-600',
    link: '/careers',
    image: '/assets/banner_v2_2.png'
  },
  {
    id: 6,
    title: 'Partner with Aghaniya Enterprises LLP',
    subtitle: 'For the best deals and offers. Get closer to financial freedom.',
    cta: 'Partner With Us',
    bgColor: 'bg-gradient-to-r from-green-600 to-teal-600',
    link: '/partners',
    image: '/assets/banner_v2_3.png'
  }
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



  return (
    <div className="relative w-full h-[80vh] md:h-[85vh] min-h-[500px] md:min-h-[600px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className={`${banner.bgColor} h-full flex items-center pt-20 md:pt-24 pb-8 md:pb-12`}>
            <div className="container mx-auto px-4 md:px-12 h-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">

              {/* Left Content */}
              <div className="w-full md:w-5/12 text-left text-white z-10 flex flex-col justify-center items-start">
                <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] md:text-sm font-bold mb-4 md:mb-6 border border-white/30 uppercase tracking-widest shadow-sm">
                  Featured Offer
                </span>
                <h2 className="text-3xl md:text-5xl lg:text-7xl font-extrabold mb-3 md:mb-6 leading-tight drop-shadow-lg tracking-tight">
                  {banner.title}
                </h2>
                <p className="text-base md:text-2xl mb-6 md:mb-8 opacity-90 leading-relaxed font-medium max-w-xl shadow-black/5">
                  {banner.subtitle}
                </p>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  <Link to={banner.link || '/'}>
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-6 md:px-8 h-12 md:h-14 text-base md:text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 rounded-xl">
                      {banner.cta}
                    </Button>
                  </Link>
                  <a
                    href={`https://wa.me/919029059005?text=${encodeURIComponent("Hi, I'm interested in your loan services. Can you help me?")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 md:px-8 h-12 md:h-14 text-base md:text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border-0 rounded-xl">
                      <MessageCircle className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>

              {/* Right Image */}
              <div className="w-full md:w-7/12 h-[40vh] md:h-full flex items-center justify-center relative p-2 md:p-4 mt-4 md:mt-0">
                <div className="relative w-full h-full flex items-center justify-center transform transition-transform hover:scale-[1.01] duration-700">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="relative max-w-full max-h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}



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

