import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import Stripe from "stripe";
import { OrderItem } from "@shared/schema";

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_YourStripeTestKeyHere";
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured, new: isNew } = req.query;
      
      let products;
      if (category) {
        const categoryObj = await storage.getCategoryBySlug(category as string);
        if (!categoryObj) {
          return res.status(404).json({ error: "Category not found" });
        }
        products = await storage.getProductsByCategory(categoryObj.id);
      } else if (featured === "true") {
        products = await storage.getFeaturedProducts();
      } else if (isNew === "true") {
        products = await storage.getNewProducts();
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Admin product management
  app.post("/api/products", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    try {
      const product = await storage.updateProduct(parseInt(req.params.id), req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    try {
      const success = await storage.deleteProduct(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Banner routes
  app.get("/api/banners", async (req, res) => {
    try {
      const banners = await storage.getBanners();
      res.json(banners);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch banners" });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    try {
      if (req.user.role === "admin") {
        const orders = await storage.getOrders();
        res.json(orders);
      } else {
        const orders = await storage.getUserOrders(req.user.id);
        res.json(orders);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    try {
      const order = await storage.getOrder(parseInt(req.params.id));
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Check if user is admin or owner of the order
      if (req.user.role !== "admin" && order.userId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      const orderItems = await storage.getOrderItems(order.id);
      
      res.json({ ...order, items: orderItems });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Payment and checkout
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    try {
      const { items } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Items are required" });
      }
      
      // Calculate total amount
      let amount = 0;
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (!product) {
          return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
        }
        amount += product.price * item.quantity;
      }
      
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe requires amount in cents
        currency: "usd",
        metadata: {
          userId: req.user.id.toString(),
        },
      });
      
      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  // Webhook for Stripe events (payment succeeded)
  app.post("/api/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
      if (endpointSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } else {
        // For development without actual webhook secret
        event = req.body;
      }
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      
      // Get the order details from your database and mark as paid
      const userId = parseInt(paymentIntent.metadata.userId);
      
      try {
        // Create order record
        const order = await storage.createOrder({
          userId,
          total: paymentIntent.amount / 100, // Convert from cents
          paymentId: paymentIntent.id,
        });
        
        // Create order items from the cart
        // In a real application, you'd store the cart items in the payment intent metadata
        // or have a temporary cart stored in the database
        
        // Update the order status to paid
        await storage.updateOrderStatus(order.id, "paid");
        
        console.log(`Payment for order ${order.id} succeeded!`);
      } catch (error) {
        console.error("Error processing payment success:", error);
      }
    }
    
    res.status(200).send({ received: true });
  });

  // Order creation endpoint (when payment is confirmed)
  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    try {
      const { paymentIntentId, items } = req.body;
      
      if (!paymentIntentId || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "PaymentIntent ID and items are required" });
      }
      
      // Calculate total amount
      let total = 0;
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (!product) {
          return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
        }
        total += product.price * item.quantity;
      }
      
      // Create the order
      const order = await storage.createOrder({
        userId: req.user.id,
        total,
        paymentId: paymentIntentId,
      });
      
      // Create order items
      const orderItems: OrderItem[] = [];
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        const orderItem = await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
        orderItems.push(orderItem);
      }
      
      res.status(201).json({ ...order, items: orderItems });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Admin order management
  app.put("/api/orders/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const order = await storage.updateOrderStatus(parseInt(req.params.id), status);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
