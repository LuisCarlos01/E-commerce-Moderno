import { 
  User, InsertUser, 
  Category, InsertCategory, 
  Product, InsertProduct,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  Banner, InsertBanner
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getNewProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getUserOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order Item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Banner operations
  getBanners(): Promise<Banner[]>;
  getBanner(id: number): Promise<Banner | undefined>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBanner(id: number, banner: Partial<InsertBanner>): Promise<Banner | undefined>;
  deleteBanner(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private banners: Map<number, Banner>;
  
  private userCurrentId: number;
  private categoryCurrentId: number;
  private productCurrentId: number;
  private orderCurrentId: number;
  private orderItemCurrentId: number;
  private bannerCurrentId: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.banners = new Map();
    
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.productCurrentId = 1;
    this.orderCurrentId = 1;
    this.orderItemCurrentId = 1;
    this.bannerCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired sessions every 24h
    });
    
    // Seed initial data
    this.seedData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: "customer",
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isFeatured
    );
  }
  
  async getNewProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isNew
    );
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productCurrentId++;
    const newProduct: Product = { 
      ...product, 
      id, 
      rating: 0, 
      reviewCount: 0, 
      inStock: true,
      createdAt: new Date()
    };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderCurrentId++;
    const newOrder: Order = { 
      ...order, 
      id, 
      status: "pending",
      createdAt: new Date() 
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order Item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }
  
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemCurrentId++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }
  
  // Banner operations
  async getBanners(): Promise<Banner[]> {
    return Array.from(this.banners.values()).sort((a, b) => a.order - b.order);
  }
  
  async getBanner(id: number): Promise<Banner | undefined> {
    return this.banners.get(id);
  }
  
  async createBanner(banner: InsertBanner): Promise<Banner> {
    const id = this.bannerCurrentId++;
    const newBanner: Banner = { ...banner, id };
    this.banners.set(id, newBanner);
    return newBanner;
  }
  
  async updateBanner(id: number, bannerData: Partial<InsertBanner>): Promise<Banner | undefined> {
    const banner = this.banners.get(id);
    if (!banner) return undefined;
    
    const updatedBanner = { ...banner, ...bannerData };
    this.banners.set(id, updatedBanner);
    return updatedBanner;
  }
  
  async deleteBanner(id: number): Promise<boolean> {
    return this.banners.delete(id);
  }
  
  // Seed initial data for demonstration
  private seedData() {
    // Add categories
    const categories = [
      { id: 1, name: "Electronics", slug: "electronics", imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12" },
      { id: 2, name: "Fashion", slug: "fashion", imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3" },
      { id: 3, name: "Accessories", slug: "accessories", imageUrl: "https://images.unsplash.com/photo-1470309864661-68328b2cd0a5" },
      { id: 4, name: "Sports", slug: "sports", imageUrl: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06" }
    ];
    
    categories.forEach(category => {
      this.categories.set(category.id, category);
      this.categoryCurrentId = Math.max(this.categoryCurrentId, category.id + 1);
    });
    
    // Add products
    const products = [
      {
        id: 1,
        name: "Bluetooth Premium Headphones",
        slug: "bluetooth-premium-headphones",
        description: "High-quality wireless headphones with noise cancellation and premium sound",
        price: 299.90,
        comparePrice: 349.90,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        rating: 4.5,
        reviewCount: 128,
        inStock: true,
        isFeatured: true,
        isNew: false,
        createdAt: new Date()
      },
      {
        id: 2,
        name: "Smartwatch Pro Series",
        slug: "smartwatch-pro-series",
        description: "Advanced smartwatch with health tracking, GPS, and long battery life",
        price: 599.90,
        comparePrice: null,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        rating: 5.0,
        reviewCount: 94,
        inStock: true,
        isFeatured: true,
        isNew: false,
        createdAt: new Date()
      },
      {
        id: 3,
        name: "Ultra Runner Shoes",
        slug: "ultra-runner-shoes",
        description: "Professional running shoes with advanced cushioning and stability",
        price: 349.90,
        comparePrice: null,
        categoryId: 4,
        imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
        rating: 4.0,
        reviewCount: 56,
        inStock: true,
        isFeatured: true,
        isNew: true,
        createdAt: new Date()
      },
      {
        id: 4,
        name: "Premium Leather Jacket",
        slug: "premium-leather-jacket",
        description: "Genuine leather jacket with stylish design and comfortable fit",
        price: 719.90,
        comparePrice: 899.90,
        categoryId: 2,
        imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
        rating: 4.5,
        reviewCount: 112,
        inStock: true,
        isFeatured: true,
        isNew: false,
        createdAt: new Date()
      },
      {
        id: 5,
        name: "Air Max Sports Shoes",
        slug: "air-max-sports-shoes",
        description: "Comfortable and stylish sports shoes for everyday use",
        price: 499.90,
        comparePrice: null,
        categoryId: 4,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        rating: 4.0,
        reviewCount: 89,
        inStock: true,
        isFeatured: false,
        isNew: false,
        createdAt: new Date()
      },
      {
        id: 6,
        name: "Premium Fit T-Shirt",
        slug: "premium-fit-t-shirt",
        description: "High-quality cotton t-shirt with perfect fit",
        price: 89.90,
        comparePrice: null,
        categoryId: 2,
        imageUrl: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc",
        rating: 3.5,
        reviewCount: 42,
        inStock: true,
        isFeatured: false,
        isNew: false,
        createdAt: new Date()
      },
      {
        id: 7,
        name: "RGB Gaming Headset",
        slug: "rgb-gaming-headset",
        description: "Professional gaming headset with RGB lighting and surround sound",
        price: 359.90,
        comparePrice: 399.90,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90",
        rating: 4.0,
        reviewCount: 76,
        inStock: true,
        isFeatured: false,
        isNew: false,
        createdAt: new Date()
      },
      {
        id: 8,
        name: "Vintage Gold Watch",
        slug: "vintage-gold-watch",
        description: "Elegant gold watch with vintage design and premium craftsmanship",
        price: 799.90,
        comparePrice: null,
        categoryId: 3,
        imageUrl: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77",
        rating: 4.5,
        reviewCount: 32,
        inStock: true,
        isFeatured: false,
        isNew: false,
        createdAt: new Date()
      }
    ];
    
    products.forEach(product => {
      this.products.set(product.id, product);
      this.productCurrentId = Math.max(this.productCurrentId, product.id + 1);
    });
    
    // Add banners
    const banners = [
      {
        id: 1,
        title: "Cutting-edge Technology for Your Daily Life",
        subtitle: "Discover the most innovative devices at special prices",
        imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
        buttonText: "See offers",
        buttonLink: "/products",
        order: 0,
        isActive: true
      },
      {
        id: 2,
        title: "New Spring/Summer Collection",
        subtitle: "Renew your wardrobe with the latest trends",
        imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
        buttonText: "Shop now",
        buttonLink: "/products?category=fashion",
        order: 1,
        isActive: true
      }
    ];
    
    banners.forEach(banner => {
      this.banners.set(banner.id, banner);
      this.bannerCurrentId = Math.max(this.bannerCurrentId, banner.id + 1);
    });
    
    // Create admin user
    const adminUser: User = {
      id: 1,
      username: "admin",
      // In a real app, this would be properly hashed
      password: "admin123.salt",
      email: "admin@nexashop.com",
      name: "Admin User",
      role: "admin",
      createdAt: new Date()
    };
    
    this.users.set(adminUser.id, adminUser);
    this.userCurrentId = 2;
  }
}

export const storage = new MemStorage();
