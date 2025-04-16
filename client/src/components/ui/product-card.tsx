import { useState } from "react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Heart, ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div className="relative">
        <Link href={`/products/${id}`}>
          <a className="block h-56 overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </a>
        </Link>
        
        <div className="absolute top-2 right-2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-background/70 hover:bg-primary/90 transition-colors backdrop-blur-sm"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-secondary' : ''}`} />
          </Button>
        </div>
        
        {(discount > 0 || isNew) && (
          <div className="absolute top-2 left-2">
            {discount > 0 ? (
              <span className="bg-secondary text-white text-xs font-semibold px-2 py-1 rounded">
                -{discount}%
              </span>
            ) : isNew ? (
              <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                New
              </span>
            ) : null}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="text-muted-foreground text-sm mb-1">
          {getCategoryName(categoryId)}
        </div>
        
        <Link href={`/products/${id}`}>
          <a className="block">
            <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
              {name}
            </h3>
          </a>
        </Link>
        
        <div className="flex items-center mb-3">
          <StarRating rating={rating} />
          <span className="text-muted-foreground text-sm ml-2">
            ({reviewCount})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {comparePrice && (
              <span className="text-muted-foreground line-through text-sm mr-2">
                ${comparePrice.toFixed(2)}
              </span>
            )}
            <span className="text-xl font-bold">${price.toFixed(2)}</span>
          </div>
          
          <Button
            size="icon"
            onClick={() => addToCart(product)}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
