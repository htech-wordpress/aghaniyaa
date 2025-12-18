import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const banners = [
  {
    id: 1,
    title: 'Blue Ocean',
    subtitle: 'Professional and calm',
    ctaPrimary: 'Get Started',
    ctaSecondary: 'Learn More',
    bgColor: 'bg-gradient-to-b from-[#c7ced2] via-[#2ea0d8] to-[#174f70] text-white',
    linkPrimary: '/loans',
    linkSecondary: '/about',
  },
  {
    id: 2,
    title: 'Get Instant Loan Approval',
    subtitle: 'Best Interest Rates from Top Lenders',
    ctaPrimary: 'Apply Now',
    ctaSecondary: 'How It Works',
    bgColor: 'bg-gradient-to-r from-red-600 to-pink-600 text-white',
    linkPrimary: '/loans',
    linkSecondary: '/about',
  },
  {
    id: 3,
    title: 'Credit Cards for Every Lifestyle',
    subtitle: 'Exclusive Rewards and Cashback Offers',
    ctaPrimary: 'Explore Cards',
    ctaSecondary: 'Compare',
    bgColor: 'bg-gradient-to-r from-green-600 to-teal-600 text-white',
    linkPrimary: '/credit-cards',
    linkSecondary: '/credit-cards',
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

  const slideVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

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
            <motion.div className="text-center px-4" initial="hidden" animate={index === currentIndex ? 'visible' : 'hidden'} variants={slideVariants}>
              <motion.div variants={childVariants} className="max-w-3xl mx-auto rounded-2xl py-16 md:py-20 px-6 md:px-12 shadow-2xl bg-black/10 backdrop-blur-sm">
                <motion.h2 variants={childVariants} className="text-5xl md:text-7xl font-extrabold mb-4 text-white tracking-tight leading-tight">{banner.title}</motion.h2>
                <motion.p variants={childVariants} className="text-lg md:text-2xl mb-8 text-white/90">{banner.subtitle}</motion.p>
                <motion.div variants={childVariants} className="flex items-center justify-center">
                  <Link to={banner.linkPrimary || '/'}>
                    <Button variant="pill" size="lg">{banner.ctaPrimary}</Button>
                  </Link>
                  <Link to={banner.linkSecondary || '/'}>
                    <Button variant="pill-outline" size="lg" className="ml-4">{banner.ctaSecondary}</Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
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

