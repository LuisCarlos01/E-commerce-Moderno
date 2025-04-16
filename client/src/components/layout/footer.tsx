import { Link } from "wouter";
import { ShoppingBag, MapPin, Phone, Mail, Clock } from "lucide-react";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube 
} from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <ShoppingBag className="text-secondary mr-2 h-6 w-6" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                NexaShop
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Your online store with the best products in technology, fashion, and accessories.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=electronics">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Electronics
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=fashion">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Fashion
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Accessories
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=sports">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Sports
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    All Products
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    About us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Terms & conditions
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/shipping">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Shipping & returns
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">123 Example St, San Francisco, CA</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">(123) 456-7890</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">contact@nexashop.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Mon-Fri: 9am to 6pm</span>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} NexaShop. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="38" height="24" aria-labelledby="pi-visa">
              <title id="pi-visa">Visa</title>
              <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
              <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
              <path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"></path>
            </svg>
            <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="38" height="24" aria-labelledby="pi-master">
              <title id="pi-master">Mastercard</title>
              <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
              <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
              <circle fill="#EB001B" cx="15" cy="12" r="7"></circle>
              <circle fill="#F79E1B" cx="23" cy="12" r="7"></circle>
              <path fill="#FF5F00" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 38 24" width="38" height="24" aria-labelledby="pi-paypal">
              <title id="pi-paypal">PayPal</title>
              <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
              <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
              <path fill="#003087" d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"></path>
              <path fill="#3086C8" d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"></path>
              <path fill="#012169" d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"></path>
            </svg>
            <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" width="38" height="24" role="img" aria-labelledby="pi-stripe">
              <title id="pi-stripe">Stripe</title>
              <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
              <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
              <path d="M15 7.4c1.3 0 2.3.3 3.2.9.7.5 1.3 1.2 1.6 2h-1.6c-.3-.4-.7-.7-1.1-.9-.5-.2-1.1-.3-1.8-.3-1.1 0-2 .3-2.7.9-.7.6-1.1 1.4-1.1 2.5 0 1.1.4 1.9 1.1 2.5.7.6 1.6.9 2.7.9.9 0 1.7-.2 2.2-.5.6-.3 1-.8 1.3-1.4h-3.6v-1.2h5.1v6.4h-1.3l-.2-1.5c-.4.5-.9 1-1.5 1.2-.6.3-1.3.4-2.1.4-1.6 0-2.9-.5-3.9-1.5-1-1-1.5-2.3-1.5-3.9s.5-2.9 1.5-3.9c1-1 2.3-1.5 3.9-1.5zm12.3 9.2c-.8.4-1.7.6-2.6.6-1.6 0-2.9-.5-3.9-1.5s-1.5-2.3-1.5-3.9.5-2.9 1.5-3.9c1-1 2.3-1.5 3.9-1.5.9 0 1.8.2 2.6.6.8.4 1.5 1 1.9 1.7l-1.2.7c-.3-.5-.7-.9-1.3-1.2-.5-.3-1.1-.4-1.8-.4-1.1 0-2 .4-2.7 1.1-.6.7-1 1.6-1 2.7 0 1.1.3 2 1 2.7.6.7 1.5 1.1 2.7 1.1.7 0 1.3-.1 1.8-.4.5-.3.9-.7 1.3-1.2l1.2.7c-.5.7-1.1 1.3-1.9 1.7z" fill="#6772E5"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
