"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  LayoutGrid,
  List,
  Folder,
  Laptop,
  Palette,
  Lightbulb,
  Smartphone,
  Bot,
  Tv,
  Banknote,
  Headphones,
  BookOpen,
  Plane,
  Dumbbell,
  Briefcase,
} from "lucide-react";

import BookmarkCard from "../../../../components/BookmarkCard";
import { storage } from "../../../../lib/storage";
import { Bookmark, Category } from "../../../../lib/types";

const IconMap: Record<string, any> = {
  folder: Folder,
  laptop: Laptop,
  palette: Palette,
  lightbulb: Lightbulb,
  smartphone: Smartphone,
  robot: Bot,
  tv: Tv,
  bank: Banknote,
  headphones: Headphones,
  book: BookOpen,
  plane: Plane,
  dumbbell: Dumbbell,
  briefcase: Briefcase,
};

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // 1. Find the category info first
    const allCategories = storage.getCategories();
    const foundCategory = allCategories.find((c: any) => c.id === categoryId);

    if (foundCategory) {
      setCategory(foundCategory);

      // 2. Filter bookmarks that match this category name
      const allBookmarks = storage.getBookmarks();
      const filtered = allBookmarks.filter(
        (b: any) => b.category === foundCategory.name,
      );
      setBookmarks(filtered as Bookmark[]);
    }
  }, [categoryId]);

  const filteredBookmarks = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    const updated = await storage.deleteBookmark(id);
    const filtered = updated.filter((b: any) => b.category === category?.name);
    setBookmarks(filtered as Bookmark[]);
  };

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Folder size={48} className="mb-4 opacity-50" />
        <p>Category not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-[#3B82F6] hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const IconComponent = IconMap[category.icon] || Folder;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-6">
        {/* Back & Title Row */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-[#262626] text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="flex items-center w-full justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {category.name}
              </h1>
            </div>

            {/* Controls Row (Search & View Toggle) */}
            <div className="flex items-center justify-between">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-[#333] rounded-lg bg-[#121212] text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#3B82F6] text-sm transition-colors"
                  placeholder={`Search in ${category.name}`}
                />
              </div>

              <div className="flex bg-[#262626] p-1 rounded-lg border border-[#333] ml-4">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-[#333] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-[#333] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookmarks Grid */}
      {filteredBookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[#262626] rounded-xl bg-[#1E1E1E]">
          <p className="text-gray-500 text-lg">
            No bookmarks in this category.
          </p>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-4" : "grid-cols-1"}`}
        >
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
