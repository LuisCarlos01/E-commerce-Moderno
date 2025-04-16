import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = "sm",
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  
  const starClass = sizeClasses[size];

  return (
    <div className="flex text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`star-${i}`} className={`${starClass} fill-current`} />
      ))}
      
      {hasHalfStar && <StarHalf className={`${starClass} fill-yellow-400`} />}
      
      {[...Array(maxRating - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={`empty-star-${i}`} className={`${starClass} text-gray-400`} />
      ))}
    </div>
  );
}
