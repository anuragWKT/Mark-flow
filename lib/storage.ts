import { Bookmark, Category } from './types';
import { addProduct, buildCategoriesFromProducts, deleteProduct, fetchProducts, mapProductToBookmark } from './dummyjson';

const STORAGE_KEYS = {
  BOOKMARKS: 'markflow_bookmarks',
  CATEGORIES: 'markflow_categories',
  USER: 'markflow_user', 
  INTERESTS: 'markflow_interests',
};

const FALLBACK_CATEGORIES: Category[] = [];
const DEFAULT_CATEGORY_ICON = "folder";
const DEFAULT_CATEGORY_COLOR = "text-gray-400";

const rebuildCategoryCounts = (
  bookmarks: Bookmark[],
  existing: Category[]
): Category[] => {

  const counts: Record<string, number> = {};
  bookmarks.forEach((b) => {
    counts[b.category] = (counts[b.category] || 0) + 1;
  });

  const existingMap = new Map(existing.map((c) => [c.name, c]));

  return Object.keys(counts).map((name) => {
    const prev = existingMap.get(name);
    return {
      id: name,
      name,
      icon: prev?.icon || DEFAULT_CATEGORY_ICON,
      color: prev?.color || DEFAULT_CATEGORY_COLOR,
      count: counts[name],
    };
  });
};

export const storage = {
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.USER);
  },

  setToken: (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER, token);
  },

  logout: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  
  initializeData: async (): Promise<{ bookmarks: Bookmark[]; categories: Category[] }> => {
    if (typeof window === 'undefined') return { bookmarks: [], categories: [] };

    const storedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);

    if (storedBookmarks && storedCategories) {
      return {
        bookmarks: JSON.parse(storedBookmarks),
        categories: JSON.parse(storedCategories),
      };
    }

    try {
      const products = await fetchProducts(20);
      const mappedBookmarks: Bookmark[] = products.map(mapProductToBookmark);
      const categories = buildCategoriesFromProducts(products);

      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(mappedBookmarks));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));

      return { bookmarks: mappedBookmarks, categories };
    } catch (error) {
      console.error("Failed to fetch seed data", error);
      return { bookmarks: [], categories: FALLBACK_CATEGORIES };
    }
  },

  getBookmarks: (): Bookmark[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  },

  addBookmark: async (bookmark: Bookmark): Promise<Bookmark[]> => {
    if (typeof window === 'undefined') return [];

    const created = await addProduct({
      title: bookmark.title,
      description: bookmark.description,
      category: bookmark.category,
      thumbnail: bookmark.thumbnail || bookmark.url,
      rating: bookmark.rating,
    });

    const savedBookmark: Bookmark = {
      ...bookmark,
      id: created.id.toString(),
      thumbnail: bookmark.thumbnail || bookmark.url,
      category: bookmark.category || created.category,
    };

    const bookmarks = storage.getBookmarks();
    const newBookmarks = [savedBookmark, ...bookmarks];
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(newBookmarks));

    const updatedCategories = rebuildCategoryCounts(newBookmarks, storage.getCategories());
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updatedCategories));

    return newBookmarks;
  },

  deleteBookmark: async (id: string): Promise<Bookmark[]> => {
    if (typeof window === 'undefined') return [];

    try {
      await deleteProduct(id);
    } catch {
      // nothing to delete if locally created product
    }
    const bookmarks = storage.getBookmarks();
    const newBookmarks = bookmarks.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(newBookmarks));

    const updatedCategories = rebuildCategoryCounts(newBookmarks, storage.getCategories());
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updatedCategories));

    return newBookmarks;
  },

  getCategories: (): Category[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : FALLBACK_CATEGORIES;
  },

  addCategory: (category: Category) => {
    const categories = storage.getCategories();
    const newCategories = [...categories, category];
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCategories));
  },

  
  getInterests: (): string[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.INTERESTS);
    return data ? JSON.parse(data) : [];
  },

  saveInterests: (interests: string[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(interests));
  }
};