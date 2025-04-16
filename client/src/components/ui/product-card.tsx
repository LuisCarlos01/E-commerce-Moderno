import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import StarRating from "@/components/ui/star-rating";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    id,
    name,
    price,
    comparePrice,
    imageUrl,
    rating,
    reviewCount,
    categoryId,
    isNew
  } = product;

  const getCategoryName = (id: number) => {
    switch (id) {
      case 1:
        return "Electronics";
      case 2:
        return "Fashion";
      case 3:
        return "Accessories";
      case 4:
        return "Sports";
      default:
        return "Other";
    }
  };

  const discount = comparePrice ? Math.round((1 - price / comparePrice) * 100) : 0;

  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Animation variants for the action buttons
  const actionButtonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  // Animation for cart success effect
  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <Card 
      className="overflow-hidden shadow-md hover:shadow-xl dark:shadow-slate-900/5 transition-all duration-300 group rounded-xl dark:bg-slate-900 border border-border"
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${id}`} className="block">
            <motion.img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
            />
        </Link>
        
        {/* Overlay with product actions */}
        <motion.div 
          className="absolute inset-0 bg-black/30 flex justify-center items-end p-4 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center w-full gap-2 pointer-events-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    variants={actionButtonVariants}
                    initial="hidden"
                    animate={isHovered ? "visible" : "hidden"}
                    custom={0}
                  >
                    <Button
                      size="icon"
                      variant="secondary"
                      className="backdrop-blur-md bg-background/80 rounded-full"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to wishlist</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    variants={actionButtonVariants}
                    initial="hidden"
                    animate={isHovered ? "visible" : "hidden"}
                    custom={1}
                  >
                    <Button
                      size="icon"
                      variant="secondary"
                      className="backdrop-blur-md bg-background/80 rounded-full"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to cart</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    variants={actionButtonVariants}
                    initial="hidden"
                    animate={isHovered ? "visible" : "hidden"}
                    custom={2}
                  >
                    <Link href={`/products/${id}`}>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="backdrop-blur-md bg-background/80 rounded-full"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quick view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>
        
        {/* Badges (discount, new) */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <motion.span 
              className="bg-secondary text-secondary-foreground font-medium px-2 py-1 rounded-md text-xs"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {discount}% OFF
            </motion.span>
          )}
          
          {isNew && (
            <motion.span 
              className="bg-primary text-primary-foreground font-medium px-2 py-1 rounded-md text-xs"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: discount > 0 ? 0.2 : 0.1 }}
            >
              NEW
            </motion.span>
          )}
        </div>

        {/* Cart success animation */}
        {addedToCart && (
          <motion.div
            className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-emerald-500 text-white p-3 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ShoppingCart className="h-6 w-6" />
            </motion.div>
          </motion.div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/products/category/${categoryId}`} className="text-muted-foreground text-xs bg-secondary/10 hover:bg-secondary/20 px-2 py-1 rounded-md transition-colors">
              {getCategoryName(categoryId)}
          </Link>
          
          <div className="flex items-center">
            <StarRating rating={rating} size="sm" />
            <span className="text-muted-foreground text-xs ml-1">
              ({reviewCount})
            </span>
          </div>
        </div>
        
        <Link href={`/products/${id}`} className="block">
            <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-2 h-14">
              {name}
            </h3>
        </Link>
        
        <div className="mt-3 flex items-end justify-between">
          <div className="flex flex-col">
            {comparePrice && (
              <span className="text-muted-foreground line-through text-sm">
                ${comparePrice.toFixed(2)}
              </span>
            )}
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ${price.toFixed(2)}
            </span>
          </div>
          
          <Button
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
