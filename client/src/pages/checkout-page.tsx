import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useStripe, useElements, Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/ui/breadcrumb";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Make sure to call loadStripe outside of a component's render to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be at least 2 characters" }),
  zipCode: z.string().min(5, { message: "Zip code must be at least 5 characters" }),
  country: z.string().min(2, { message: "Country must be at least 2 characters" }),
  saveInfo: z.boolean().default(false),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

function CheckoutForm() {
  const [location, navigate] = useLocation();
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  
  const stripe = useStripe();
  const elements = useElements();

  // Define the form with default values
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.name.split(' ')[0] || "",
      lastName: user?.name.split(' ').slice(1).join(' ') || "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      saveInfo: false,
      notes: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: CheckoutFormValues) => {
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setPaymentError("");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/checkout?success=true",
        },
        redirect: "if_required",
      });

      if (error) {
        setPaymentError(error.message || "An unknown error occurred");
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Create order in the database
        const orderItems = cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));

        const orderResponse = await apiRequest("POST", "/api/orders", {
          paymentIntentId: paymentIntent.id,
          items: orderItems,
        });

        if (orderResponse.ok) {
          setIsSuccess(true);
          clearCart();
          toast({
            title: "Order Placed!",
            description: "Thank you for your purchase!",
          });

          // Redirect to success page after a short delay
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          throw new Error("Failed to create order");
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast({
        title: "Error",
        description: "There was a problem processing your payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Create PaymentIntent as soon as the page loads
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
      return;
    }

    const fetchPaymentIntent = async () => {
      try {
        const items = cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));

        const response = await apiRequest("POST", "/api/create-payment-intent", { items });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        toast({
          title: "Error",
          description: "Could not initialize payment. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchPaymentIntent();
  }, [cartItems, navigate, toast]);

  // Check for URL success parameter for redirect cases
  useEffect(() => {
    const url = new URL(window.location.href);
    const success = url.searchParams.get("success");
    
    if (success === "true") {
      setIsSuccess(true);
      toast({
        title: "Payment Successful",
        description: "Your order has been placed!",
      });
      
      setTimeout(() => {
        clearCart();
        navigate("/");
      }, 3000);
    }
  }, [clearCart, navigate, toast]);

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Thank You for Your Order!</h1>
          <p className="text-muted-foreground mb-6">
            Your payment has been processed successfully. You will receive an order confirmation shortly.
          </p>
          <Button asChild>
            <a href="/">Continue Shopping</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: "Home", href: "/" },
            { label: "Checkout" }
          ]}
        />
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1 order-2 lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded overflow-hidden mr-4 bg-accent/10">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium">${(subtotal * 0.08).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold">${(subtotal + (subtotal * 0.08)).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2 order-1 lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>
                Enter your information to complete your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USA">United States</SelectItem>
                              <SelectItem value="CAN">Canada</SelectItem>
                              <SelectItem value="MEX">Mexico</SelectItem>
                              <SelectItem value="GBR">United Kingdom</SelectItem>
                              <SelectItem value="AUS">Australia</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Special instructions for delivery, etc." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="saveInfo"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 mb-6">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Save this information for faster checkout next time
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
                  {clientSecret ? (
                    <div className="mb-6">
                      <PaymentElement />
                      {paymentError && (
                        <p className="text-destructive text-sm mt-2">{paymentError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="mb-6">
                      <Skeleton className="h-12 w-full mb-2" />
                      <Skeleton className="h-12 w-full mb-2" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isProcessing || !stripe || !elements || !clientSecret}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${(subtotal + (subtotal * 0.08)).toFixed(2)}`
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const { cartItems } = useCart();
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if cart is empty
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Add some products to your cart before checkout",
      });
      navigate("/");
      return;
    }

    // Create PaymentIntent as soon as the page loads
    const fetchPaymentIntent = async () => {
      try {
        const items = cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));

        const response = await apiRequest("POST", "/api/create-payment-intent", { items });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        toast({
          title: "Error",
          description: "Could not initialize payment. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchPaymentIntent();
  }, [cartItems, navigate, toast]);

  const options = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#6366F1',
      },
    },
  };

  return clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  );
}
