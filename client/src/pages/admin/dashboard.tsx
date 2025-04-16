import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Banknote,
  TrendingUp,
  BarChart2,
} from "lucide-react";

// Sample data for charts
const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
  { name: "Jul", revenue: 7000 },
];

const categoryData = [
  { name: "Electronics", value: 45 },
  { name: "Fashion", value: 30 },
  { name: "Accessories", value: 15 },
  { name: "Sports", value: 10 },
];

export default function AdminDashboard() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
  
  // Fetch orders for statistics
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
  });

  // Fetch products for statistics
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  // Calculate summary statistics
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;
  const totalProducts = products?.length || 0;
  
  // Calculate average order value
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Get pending orders
  const pendingOrders = orders?.filter(order => order.status === "pending").length || 0;

  if (ordersLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/admin/products">Manage Products</Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">${totalRevenue.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{totalOrders}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-yellow-500">{pendingOrders} pending</span> orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{totalProducts}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Across {products?.filter(p => p.inStock).length || 0} in stock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Banknote className="mr-2 h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Per customer transaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              <Tabs 
                defaultValue="monthly" 
                value={period} 
                onValueChange={(value) => setPeriod(value as any)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366F1"
                    activeDot={{ r: 8 }}
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Distribution of sales across product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }}
                    formatter={(value) => [`${value}%`, 'Percentage']}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#EC4899" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/admin/orders">View All</Link>
            </Button>
          </div>
          <CardDescription>
            Latest customer orders and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Order ID</th>
                    <th className="text-left p-3 font-medium">Customer</th>
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-right p-3 font-medium">Amount</th>
                    <th className="text-center p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="p-3">{order.id}</td>
                      <td className="p-3">Customer ID: {order.userId}</td>
                      <td className="p-3">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">${order.total.toFixed(2)}</td>
                      <td className="p-3">
                        <div className="flex justify-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed' 
                              ? 'bg-green-500/20 text-green-500' 
                              : order.status === 'pending' 
                              ? 'bg-yellow-500/20 text-yellow-500' 
                              : 'bg-blue-500/20 text-blue-500'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
