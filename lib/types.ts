export type Category = {
  id: string;
  name: string;
  icon: string; 
  color: string; 
  count: number; 
};

export type Bookmark = {
  id: string; 
  title: string;
  url: string; 
  description: string; 
  category: string; 
  rating: number; 
  isFavorite: boolean; 
  thumbnail?: string; 
  createdAt: number; 
};

export type DummyProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  rating: number;
};