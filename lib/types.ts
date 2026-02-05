export type Category = {
  id: string;
  name: string;
  icon: string; // We will use a string identifier for icons (e.g., 'code', 'music')
  color: string; // Hex code or Tailwind class
  count: number; // For the "124 bookmarks" badge
};

export type Bookmark = {
  id: string; // Unique ID
  title: string; // e.g., "Figma"
  url: string; // e.g., "https://figma.com"
  description: string; // e.g., "Cloud-based UI/UX design tool"
  category: string; // The Category Name (e.g., "Design")
  rating: number; // 1-5 stars
  isFavorite: boolean; // For the "Frequent" or "Favorites" list
  thumbnail?: string; // URL to the logo image
  createdAt: number; // Timestamp for sorting
};

// This matches the response we get from DummyJSON products to help us map it
export type DummyProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  rating: number;
};