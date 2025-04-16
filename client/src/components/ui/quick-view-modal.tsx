import { useState } from "react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { X, Heart, ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StarRating from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";

interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickViewModal({ 
  product, 
  open, 
  onOpenChange 
}: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const {
    id,
    name,
    description,
    price,
    comparePrice,
    imageUrl,
    rating,
    reviewCount,
    categoryId,
    isNew
  } = product;

  // Calculate discount percentage
  const discount = comparePrice ? Math.round((1 - price / comparePrice) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Image Section */}
          <div className="relative h-[300px] md:h-auto overflow-hidden bg-accent">
            <motion.img
              src={imageUrl || ""}
              alt={name}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discount > 0 && (
                <span className="bg-secondary text-secondary-foreground font-medium px-2 py-1 rounded-md text-xs">
                  {discount}% OFF
                </span>
              )}
              
              {isNew && (
                <span className="bg-primary text-primary-foreground font-medium px-2 py-1 rounded-md text-xs">
                  NEW
                </span>
              )}
            </div>
          </div>
          
          {/* Product Details Section */}
          <div className="p-6 flex flex-col h-full">
            <div className="mb-2">
              <span className="text-sm text-muted-foreground bg-secondary/10 px-2 py-1 rounded-md">
                {getCategoryName(categoryId || 1)}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
            
            <div className="flex items-center mt-2 mb-4">
              <StarRating rating={rating || 0} />
              <span className="text-muted-foreground text-sm ml-2">
                ({reviewCount || 0} reviews)
              </span>
            </div>
            
            <div className="flex items-end gap-2 mb-4">
              <span className="text-2xl font-bold text-gradient">
                ${price.toFixed(2)}
              </span>
              {comparePrice && (
                <span className="text-muted-foreground line-through text-sm">
                  ${comparePrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="mt-2 mb-6 text-muted-foreground">
              <p>{description || "Experience premium quality with this exceptional product. Designed for maximum performance and durability."}</p>
            </div>
            
            <Tabs defaultValue="details" className="mb-6">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="shipping" className="flex-1">Shipping</TabsTrigger>
                <TabsTrigger value="returns" className="flex-1">Returns</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="px-1 text-sm">
                <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                  <li>Premium quality</li>
                  <li>1-year warranty</li>
                  <li>Free technical support</li>
                </ul>
              </TabsContent>
              <TabsContent value="shipping" className="px-1 text-sm">
                <p className="text-muted-foreground">Free standard shipping on all orders. Express delivery available.</p>
              </TabsContent>
              <TabsContent value="returns" className="px-1 text-sm">
                <p className="text-muted-foreground">30-day return policy. Items must be unused and in original packaging.</p>
              </TabsContent>
            </Tabs>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={handleDecrement}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={handleIncrement}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <Button 
                className={cn(
                  "flex-1 transition-all", 
                  addedToCart ? "bg-emerald-600 hover:bg-emerald-700" : ""
                )}
                onClick={handleAddToCart}
                disabled={addedToCart}
              >
                {addedToCart ? (
                  <motion.div 
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Added to cart
                  </motion.div>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to cart
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full transition-colors",
                  isFavorite ? "border-red-500 text-red-500" : ""
                )}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            <div className="mt-auto text-center">
              <DialogClose asChild>
                <Link href={`/products/${id}`} className="text-primary text-sm font-medium hover:underline">
                  View Full Details
                </Link>
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}