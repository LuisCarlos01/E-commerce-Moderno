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

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      <div 
        ref={sliderRef}
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-full relative">
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-[70vh] md:h-[60vh] object-cover brightness-75"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 bg-gradient-to-r from-black/50 to-transparent">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-2xl text-white">
                {banner.title}
              </h1>
              {banner.subtitle && (
                <p className="text-xl max-w-lg mb-6 text-gray-100">
                  {banner.subtitle}
                </p>
              )}
              <div>
                {banner.buttonText && banner.buttonLink && (
                  <Link href={banner.buttonLink}>
                    <Button className="mr-4 hover:bg-primary/90 transition-colors">
                      {banner.buttonText}
                    </Button>
                  </Link>
                )}
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition-colors"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition-colors"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className={`w-3 h-3 p-0 rounded-full ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
