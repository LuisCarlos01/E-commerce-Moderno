import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useProducts, useCategories, useBanners } from "@/hooks/use-products";
import BannerSlider from "@/components/ui/banner-slider";
import CategoryCard from "@/components/ui/category-card";
import ProductCard from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: featuredProducts, isLoading: isLoadingFeatured } = useProducts({ featured: true });
  const { data: banners, isLoading: isLoadingBanners } = useBanners();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic would go here
    alert(`Subscribed with email: ${email}`);
    setEmail("");
  };

  if (isLoadingBanners || isLoadingCategories || isLoadingFeatured) {
    return (
      <div className="min-h-screen">
        {/* Banner Skeleton */}
        <div className="w-full h-[60vh] bg-gray-800 animate-pulse" />
        
        {/* Categories Skeleton */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-40 md:h-56 rounded-xl" />
            ))}
          </div>
        </div>
        
        {/* Featured Products Skeleton */}
        <div className="container mx-auto px-4 py-12 bg-card">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <div className="w-24 h-6 animate-pulse bg-gray-700 rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      {banners && banners.length > 0 && (
        <BannerSlider banners={banners} />
      )}

      {/* Categories */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link href="/products">
              <a className="text-primary hover:text-primary/90 font-medium flex items-center">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26"
              alt="Special offer for electronics"
              className="w-full h-64 md:h-96 object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 flex flex-col justify-center px-8 md:px-16">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
                  Special offer for new customers
                </h2>
                <p className="text-lg md:text-xl mb-6 text-white">
                  Get 15% off on your first purchase. Use code:{" "}
                  <span className="font-semibold bg-white/20 px-2 py-1 rounded">
                    WELCOME15
                  </span>
                </p>
                <Link href="/products">
                  <Button variant="secondary">Shop Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0 md:max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                Subscribe to our newsletter
              </h2>
              <p className="text-white/90">
                Receive exclusive offers, new arrivals, and tips directly in your inbox.
              </p>
            </div>
            <form 
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 md:w-96"
            >
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 pl-10 text-white placeholder:text-white/70 focus-visible:ring-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="secondary" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
