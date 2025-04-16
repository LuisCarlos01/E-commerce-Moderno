import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X,
  LogOut
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function Header() {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { openCart, totalItems } = useCart();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchBar(false);
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    if (showSearchBar) setShowSearchBar(false);
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    if (showMobileMenu) setShowMobileMenu(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <ShoppingBag className="text-secondary mr-2 h-6 w-6" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                NexaShop
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <a className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
                Home
              </a>
            </Link>
            <Link href="/products">
              <a className={`text-sm font-medium transition-colors hover:text-primary ${location.startsWith('/products') ? 'text-primary' : 'text-muted-foreground'}`}>
                Products
              </a>
            </Link>
            <Link href="/products?featured=true">
              <a className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
                Featured
              </a>
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin">
                <a className={`text-sm font-medium transition-colors hover:text-primary ${location.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'}`}>
                  Admin
                </a>
              </Link>
            )}
          </nav>

          {/* Search, Cart, User */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={toggleSearchBar} aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={openCart} className="relative" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
            
            {/* Theme Toggle */}
            {/* <ThemeToggle /> */}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="User menu">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/products">Manage Products</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/orders">Manage Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => navigate('/auth')} aria-label="Login">
                <User className="h-5 w-5" />
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu} aria-label="Menu">
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearchBar && (
        <div className="px-4 py-3 border-t border-border animate-in fade-in">
          <form onSubmit={handleSearch} className="relative">
            <Input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden px-4 py-3 border-t border-border animate-in fade-in">
          <nav className="flex flex-col space-y-3">
            <Link href="/">
              <a className={`py-2 font-medium ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
                Home
              </a>
            </Link>
            <Link href="/products">
              <a className={`py-2 font-medium ${location.startsWith('/products') ? 'text-primary' : 'text-muted-foreground'}`}>
                Products
              </a>
            </Link>
            <Link href="/products?featured=true">
              <a className="py-2 font-medium text-muted-foreground">
                Featured
              </a>
            </Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <>
                    <Link href="/admin">
                      <a className="py-2 font-medium text-muted-foreground">
                        Admin Dashboard
                      </a>
                    </Link>
                    <Link href="/admin/products">
                      <a className="py-2 font-medium text-muted-foreground">
                        Manage Products
                      </a>
                    </Link>
                    <Link href="/admin/orders">
                      <a className="py-2 font-medium text-muted-foreground">
                        Manage Orders
                      </a>
                    </Link>
                  </>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center py-2 font-medium text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth">
                <a className="py-2 font-medium text-muted-foreground">
                  Login / Register
                </a>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
