import { useState } from "react";
import { useRoute } from "wouter";
import { useProduct, useCategories } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import Breadcrumb from "@/components/ui/breadcrumb";
import StarRating from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  ChevronRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Heart,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingCart 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailPage() {
  const [match, params] = useRoute("/products/:id");
  const { data: product, isLoading } = useProduct(params?.id || "");
  const { data: categories } = useCategories();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);

  // Images for the gallery (using product.imageUrl as the first image)
  // In a real app, these would come from the product data
  const productImages = product ? [
    product.imageUrl,
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&angle=15",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&angle=30",
  ] : [];

  if (!match) {
    return <div>404 - Product not found</div>;
  }

  const incrementQuantity = () => {
    setQuantity(q => q + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const getCategoryName = (id: number | undefined) => {
    if (!id || !categories) return "";
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : "";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="aspect-square rounded-lg" />
            <div className="flex mt-4 gap-2">
              {[1, 2, 3, 4].map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-6" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <a href="/products">Browse Products</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: "Products", href: "/products" },
            { label: getCategoryName(product.categoryId), href: `/products?category=${categories?.find(c => c.id === product.categoryId)?.slug}` },
            { label: product.name }
          ]}
        />
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
            <img 
              src={productImages[mainImage]} 
              alt={product.name} 
              className="w-full h-auto object-cover aspect-square"
            />
          </div>
          <div className="flex mt-4 gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {productImages.map((img, index) => (
              <div
                key={index}
                className={`w-20 h-20 rounded overflow-hidden cursor-pointer border-2 ${
                  index === mainImage 
                    ? "border-primary" 
                    : "border-transparent hover:border-primary/50"
                }`}
                onClick={() => setMainImage(index)}
              >
                <img 
                  src={img} 
                  alt={`${product.name} - view ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={product.rating} size="md" />
            <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>
          
          <div className="flex items-center mb-6">
            {product.comparePrice && (
              <span className="text-muted-foreground line-through text-lg mr-3">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="ml-3 bg-secondary/10 text-secondary px-2 py-1 rounded text-sm font-medium">
                {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
              </span>
            )}
          </div>
          
          <p className="text-muted-foreground mb-6">
            {product.description || "No description available for this product."}
          </p>
          
          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span className="mr-4 font-medium">Quantity:</span>
            <div className="flex items-center border border-border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              <Heart className="mr-2 h-5 w-5" />
              Add to Wishlist
            </Button>
          </div>
          
          {/* Product Metadata */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center text-sm">
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              <span>In Stock</span>
            </div>
            <div className="flex items-center text-sm">
              <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center text-sm">
              <RotateCcw className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>30-day returns</span>
            </div>
            <div className="flex items-center text-sm">
              <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>2-year warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h3>Product Description</h3>
              <p>{product.description || "No detailed description available for this product."}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
              <h4>Features</h4>
              <ul>
                <li>High-quality materials</li>
                <li>Durable construction</li>
                <li>Elegant design</li>
                <li>Perfect for everyday use</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h3>Technical Specifications</h3>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="font-medium">Brand</td>
                    <td>NexaShop</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Model</td>
                    <td>NS-{product.id}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Category</td>
                    <td>{getCategoryName(product.categoryId)}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Warranty</td>
                    <td>2 Years</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Weight</td>
                    <td>0.5 kg</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Dimensions</td>
                    <td>20 x 15 x 5 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <div className="flex items-center mt-1">
                    <StarRating rating={product.rating} size="md" />
                    <span className="ml-2 text-muted-foreground">
                      Based on {product.reviewCount} reviews
                    </span>
                  </div>
                </div>
                <Button>Write a Review</Button>
              </div>
              
              <Separator />
              
              {/* Sample reviews - in a real app, these would come from the API */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">John Doe</h4>
                        <StarRating rating={5} size="sm" />
                      </div>
                      <span className="text-muted-foreground text-sm">2 days ago</span>
                    </div>
                    <p className="text-sm mt-2">
                      Great product! Exactly as described and arrived quickly. Would definitely recommend.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">Jane Smith</h4>
                        <StarRating rating={4} size="sm" />
                      </div>
                      <span className="text-muted-foreground text-sm">1 week ago</span>
                    </div>
                    <p className="text-sm mt-2">
                      Very satisfied with my purchase. Quality is excellent, though shipping took a bit longer than expected.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">Mike Johnson</h4>
                        <StarRating rating={3.5} size="sm" />
                      </div>
                      <span className="text-muted-foreground text-sm">2 weeks ago</span>
                    </div>
                    <p className="text-sm mt-2">
                      Product is good but not quite what I expected based on the photos. Still happy with it overall.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button variant="outline" className="mx-1">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button variant="outline" className="mx-1">
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products (would implement if we had a proper endpoint) */}
    </div>
  );
}
