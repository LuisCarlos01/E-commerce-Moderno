import { useState } from "react";
import { Star, StarHalf } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const activeRating = isHovering ? hoverRating : rating;
  const fullStars = Math.floor(activeRating);
  const hasHalfStar = activeRating % 1 >= 0.5;

  const handleMouseMove = (index: number) => {
    if (!interactive) return;
    setHoverRating(index + 1);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
    setIsHovering(false);
  };

  const handleClick = (index: number) => {
    if (!interactive || !onRatingChange) return;
    onRatingChange(index + 1);
  };
  
  // Size classes for stars
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  
  const starClass = sizeClasses[size];
  
  // Animation variants
  const starVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
    tap: { scale: 0.95 },
  };

  const getColor = (index: number) => {
    if (index < fullStars) {
      return "text-yellow-400 fill-current";
    } else if (index === fullStars && hasHalfStar) {
      return "text-yellow-400";
    } else {
      return "text-gray-400 dark:text-gray-600";
    }
  };

  return (
    <motion.div 
      className={cn("flex items-center gap-px", className)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
    >
      {[...Array(maxRating)].map((_, i) => (
        <motion.div
          key={`star-container-${i}`}
          className={cn("relative cursor-default", { "cursor-pointer": interactive })}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onMouseMove={() => handleMouseMove(i)}
          onClick={() => handleClick(i)}
          transition={{ duration: 0.2 }}
          variants={starVariants}
        >
          {i === fullStars && hasHalfStar ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <StarHalf className={`${starClass} fill-yellow-400`} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Star className={`${starClass} ${getColor(i)}`} />
            </motion.div>
          )}
        </motion.div>
      ))}
      
      {interactive && (
        <span className="ml-2 text-xs font-medium text-muted-foreground">
          {activeRating.toFixed(1)}
        </span>
      )}
    </motion.div>
  );
}
