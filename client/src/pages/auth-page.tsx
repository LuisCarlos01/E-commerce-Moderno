import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ShoppingBag } from "lucide-react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Registration form schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const [match, params] = useRoute("/auth");
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Get the redirect parameter if any
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const redirectTo = searchParams.get("redirect") || "/";

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // Handle registration form submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };

  // If user is already logged in, redirect to home or requested page
  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

  // If there's an error in the URL, show the registration tab
  useEffect(() => {
    if (searchParams.get("tab") === "register") {
      setActiveTab("register");
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 gap-0">
      {/* Form Section */}
      <div className="flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md">
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            {/* Login Form */}
            <TabsContent value="login">
              <CardContent className="pt-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your username" 
                              {...field} 
                              autoComplete="username"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <a 
                              href="#" 
                              className="text-sm text-primary hover:text-primary/90"
                              onClick={(e) => e.preventDefault()}
                            >
                              Forgot password?
                            </a>
                          </div>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              autoComplete="current-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </Form>
                
                <div className="flex items-center my-6">
                  <Separator className="flex-grow" />
                  <span className="px-4 text-sm text-muted-foreground">or continue with</span>
                  <Separator className="flex-grow" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button" className="flex items-center justify-center">
                    <FaGoogle className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" type="button" className="flex items-center justify-center">
                    <FaFacebookF className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                </div>
                
                <p className="text-center mt-6 text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="text-primary hover:text-primary/90 font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("register");
                    }}
                  >
                    Register now
                  </a>
                </p>
              </CardContent>
            </TabsContent>
            
            {/* Register Form */}
            <TabsContent value="register">
              <CardContent className="pt-4">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              {...field} 
                              autoComplete="name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="john.doe@example.com" 
                              {...field} 
                              autoComplete="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="johndoe" 
                              {...field} 
                              autoComplete="username"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  </form>
                </Form>
                
                <p className="text-center mt-6 text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="text-primary hover:text-primary/90 font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("login");
                    }}
                  >
                    Login instead
                  </a>
                </p>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Hero Section */}
      <div className="hidden md:flex flex-col relative bg-gradient-to-br from-primary to-secondary">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-6 py-12 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm">
              <ShoppingBag className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Welcome to NexaShop</h1>
          <p className="text-xl mb-8 max-w-md text-white/80">
            Your modern e-commerce destination for premium products at competitive prices.
          </p>
          <div className="space-y-6 max-w-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Wide Product Selection</h3>
                <p className="text-white/70 text-sm">From electronics to fashion and accessories</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Secure Payments</h3>
                <p className="text-white/70 text-sm">Integrated with Stripe for safe transactions</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Fast Delivery</h3>
                <p className="text-white/70 text-sm">Free shipping on orders over $100</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
