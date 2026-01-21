import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

interface ScrollAnimationProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'rotate3d';
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function ScrollAnimation({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
  once = true
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  const getInitialState = () => {
    switch (direction) {
      case 'up':
        return { y: 50, opacity: 0, rotateX: 0 };
      case 'down':
        return { y: -50, opacity: 0, rotateX: 0 };
      case 'left':
        return { x: 50, opacity: 0, rotateY: 0 };
      case 'right':
        return { x: -50, opacity: 0, rotateY: 0 };
      case 'scale':
        return { scale: 0.8, opacity: 0, rotateZ: 0 };
      case 'rotate3d':
        return { opacity: 0, rotateX: -15, rotateY: -15, scale: 0.9 };
      default:
        return { opacity: 0 };
    }
  };

  const getAnimateState = () => {
    switch (direction) {
      case 'rotate3d':
        return { opacity: 1, rotateX: 0, rotateY: 0, scale: 1 };
      default:
        return { x: 0, y: 0, scale: 1, opacity: 1, rotateX: 0, rotateY: 0, rotateZ: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialState()}
      animate={isInView ? getAnimateState() : getInitialState()}
      transition={{
        duration,
        delay,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
      style={{
        perspective: direction === 'rotate3d' ? '1000px' : 'none',
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ScrollParallax({ children, speed = 0.5, className = '' }: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

interface FadeInOnScrollProps {
  children: ReactNode;
  className?: string;
}

export function FadeInOnScroll({ children, className = '' }: FadeInOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

