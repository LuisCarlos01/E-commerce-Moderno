import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

export interface BannerItem {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
}

interface BannerSliderProps {
  banners: BannerItem[];
  autoplay?: boolean;
  interval?: number;
}

export default function BannerSlider({
  banners,
  autoplay = true,
  interval = 5000,
}: BannerSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = banners.length;
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = (index: number) => {
    setCurrentSlide((totalSlides + index) % totalSlides);
  };

  const prevSlide = () => {
    goToSlide(currentSlide - 1);
  };

  const nextSlide = () => {
    goToSlide(currentSlide + 1);
  };

  // Set up autoplay
  useEffect(() => {
    if (autoplay) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoplay, interval, currentSlide]);

  // Pause autoplay on hover
  const pauseAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resumeAutoplay = () => {
    if (autoplay) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, interval);
    }
  };

  const { theme } = useTheme();
  const [direction, setDirection] = useState(0);
  
  // Variants for the slide transitions
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  // Variants for content animations
  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1 + 0.3,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  // Handle slide change with direction
  const handleSlideChange = (newIndex: number) => {
    setDirection(newIndex > currentSlide ? 1 : -1);
    goToSlide(newIndex);
  };

  return (
    <div 
      className="relative overflow-hidden bg-black/5 dark:bg-black/20"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* Carousel slides with AnimatePresence for transitions */}
      <div className="relative h-[70vh] md:h-[60vh]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div className="relative h-full w-full">
              {/* Background image with parallax effect */}
              <motion.img
                src={banners[currentSlide].imageUrl}
                alt={banners[currentSlide].title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6, ease: 'easeOut' }}
                style={{ filter: 'brightness(0.7)' }}
              />
              
              {/* Overlay gradients for light/dark themes */}
              <div className={cn(
                "absolute inset-0 flex flex-col justify-center px-8 md:px-16",
                theme === 'dark' || theme === 'system' 
                  ? "bg-gradient-to-r from-black/60 to-black/10" 
                  : "bg-gradient-to-r from-black/40 to-transparent"
              )}>
                <motion.div 
                  className="max-w-6xl mx-auto"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {/* Title with animation */}
                  <motion.h1 
                    variants={contentVariants} 
                    custom={0}
                    className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-3xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                  >
                    {banners[currentSlide].title}
                  </motion.h1>
                  
                  {/* Subtitle with animation */}
                  {banners[currentSlide].subtitle && (
                    <motion.p 
                      variants={contentVariants} 
                      custom={1}
                      className="text-lg md:text-xl max-w-lg mb-8 text-gray-100"
                    >
                      {banners[currentSlide].subtitle}
                    </motion.p>
                  )}
                  
                  {/* Buttons with animation */}
                  <motion.div variants={contentVariants} custom={2} className="flex flex-wrap gap-4">
                    {banners[currentSlide].buttonText && banners[currentSlide].buttonLink && (
                      <Link href={banners[currentSlide].buttonLink} className="hover:no-underline">
                        <Button 
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                          {banners[currentSlide].buttonText}
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-white text-white hover:bg-white/20 transition-all duration-300 hover:shadow-lg"
                    >
                      Learn more
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows with improved hover effects */}
      <motion.div 
        className="absolute left-4 top-1/2 -translate-y-1/2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/10 hover:bg-white/30 text-white backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:shadow-lg"
          onClick={() => handleSlideChange(currentSlide - 1)}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </motion.div>
      
      <motion.div 
        className="absolute right-4 top-1/2 -translate-y-1/2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/10 hover:bg-white/30 text-white backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:shadow-lg"
          onClick={() => handleSlideChange(currentSlide + 1)}
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Progress indicator bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-1/3 max-w-md h-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-white"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentSlide / (totalSlides - 1)) * 100}%` }}
          transition={{ ease: 'easeInOut' }}
        />
      </div>

      {/* Slide indicators with animations */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {banners.map((_, index) => (
          <motion.div
            key={index}
            className="cursor-pointer relative"
            whileHover={{ scale: 1.2 }}
            onClick={() => handleSlideChange(index)}
          >
            <div className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === currentSlide 
                ? "bg-white shadow-glow" 
                : "bg-white/30 hover:bg-white/70"
            )} />
            {index === currentSlide && (
              <motion.div
                className="absolute inset-0 rounded-full bg-white/30"
                initial={{ scale: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.3 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70 cursor-pointer"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });
        }}
        whileHover={{ scale: 1.1, opacity: 1 }}
        style={{ bottom: '2rem', display: 'none' }} // Hidden by default, can be shown when needed
      >
        <span className="text-white text-sm mb-1 font-medium">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="h-6 w-6 text-white" />
        </motion.div>
      </motion.div>
    </div>
  );
}
