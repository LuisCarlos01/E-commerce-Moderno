import { useEffect } from "react";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CartSidebar() {
  const { 
    isOpen, 
    closeCart, 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    totalItems, 
    subtotal 
  } = useCart();
  const { user } = useAuth();

  // Close cart when pressing Escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, closeCart]);

  // Prevent body scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close cart when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="fixed inset-y-0 right-0 w-full md:w-96 bg-card shadow-xl transform transition-transform duration-300 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold">
            Cart <span className="text-secondary">({totalItems})</span>
          </h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-grow">
              <div className="p-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex py-4 border-b border-border">
                    <div className="w-20 h-20 rounded overflow-hidden bg-accent/10">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-muted-foreground text-sm">{item.product.categoryId === 1 ? 'Electronics' : item.product.categoryId === 2 ? 'Fashion' : 'Accessories'}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="self-start ml-2 text-muted-foreground hover:text-destructive" 
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-border bg-background">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between mb-6 text-lg">
                <span className="font-medium">Total:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {user ? (
                <Link href="/checkout">
                  <Button className="w-full" onClick={closeCart}>
                    Checkout
                  </Button>
                </Link>
              ) : (
                <Link href="/auth?redirect=checkout">
                  <Button className="w-full" onClick={closeCart}>
                    Login to Checkout
                  </Button>
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow p-4">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M5 10h14l-2.5 5.5a2 2 0 0 1-1.82 1.2h-5.36a2 2 0 0 1-1.82-1.2L5 10Z" />
                <path d="M5 10 3.5 2.5h-2" />
                <path d="M14.5 15.5c-.44 2-1.67 3-3.5 3-1.6 0-2.94-.83-3.5-3" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-center mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button onClick={closeCart}>
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
