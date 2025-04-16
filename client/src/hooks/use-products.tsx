import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";

export function useProducts(params?: {
  category?: string;
  featured?: boolean;
  new?: boolean;
}) {
  let queryUrl = "/api/products";
  const queryParams: string[] = [];

  if (params?.category) {
    queryParams.push(`category=${params.category}`);
  }

  if (params?.featured) {
    queryParams.push("featured=true");
  }

  if (params?.new) {
    queryParams.push("new=true");
  }

  if (queryParams.length > 0) {
    queryUrl += `?${queryParams.join("&")}`;
  }

  return useQuery<Product[]>({
    queryKey: [queryUrl],
  });
}

export function useProduct(id: number | string) {
  return useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
}

export function useCategory(slug: string) {
  return useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
    enabled: !!slug,
  });
}

export function useBanners() {
  return useQuery<any[]>({
    queryKey: ["/api/banners"],
  });
}
