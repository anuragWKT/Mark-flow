import { Bookmark, Category, DummyProduct } from "./types";

const API_BASE = "https://dummyjson.com";

export async function fetchProducts(limit = 100): Promise<DummyProduct[]> {
  const res = await fetch(`${API_BASE}/products?limit=${limit}`);
  const data = await res.json();
  return data.products as DummyProduct[];
}

type ProductPayload = {
  title: string;
  description?: string;
  category?: string;
  thumbnail?: string;
  rating?: number;
};

export async function addProduct(payload: ProductPayload): Promise<DummyProduct> {
  const res = await fetch(`${API_BASE}/products/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as DummyProduct;
}

export async function deleteProduct(id: string): Promise<{ id: number; isDeleted: boolean }>{
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
  });
 
  return (await res.json()) as { id: number; isDeleted: boolean };
}

export function mapProductToBookmark(product: DummyProduct): Bookmark {
  return {
    id: product.id.toString(),
    title: product.title,
    description: product.description,
    url: product.thumbnail,
    thumbnail: product.thumbnail,
    category: product.category,
    rating: product.rating,
    isFavorite: product.rating >= 4.5,
    createdAt: Date.now(),
  };
}

const DEFAULT_ICONS = [
  "laptop",
  "palette",
  "lightbulb",
  "smartphone",
  "robot",
  "tv",
  "bank",
  "headphones",
  "book",
  "plane",
  "dumbbell",
  "briefcase",
];

const DEFAULT_COLORS = [
  "text-blue-500",
  "text-purple-500",
  "text-yellow-500",
  "text-pink-500",
  "text-green-500",
  "text-red-500",
  "text-emerald-500",
  "text-cyan-500",
];

export function buildCategoriesFromProducts(products: DummyProduct[]): Category[] {
  const counts: Record<string, number> = {};
  products.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  return Object.keys(counts).map((name, index) => ({
    id: name,
    name,
    icon: DEFAULT_ICONS[index % DEFAULT_ICONS.length],
    color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    count: counts[name],
  }));
}
