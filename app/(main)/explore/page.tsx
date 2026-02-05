"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Banknote,
  BookOpen,
  Bot,
  Briefcase,
  CheckCircle2,
  Dumbbell,
  ExternalLink,
  Folder,
  Heart,
  Laptop,
  Lightbulb,
  Palette,
  Plane,
  Smartphone,
  Tv,
  BookmarkPlus,
} from "lucide-react";

import { fetchProducts, mapProductToBookmark } from "../../../lib/dummyjson";
import { storage } from "../../../lib/storage";
import { Category, DummyProduct } from "../../../lib/types";

const IconMap: Record<string, any> = {
  folder: Folder,
  laptop: Laptop,
  palette: Palette,
  lightbulb: Lightbulb,
  smartphone: Smartphone,
  robot: Bot,
  tv: Tv,
  bank: Banknote,
  book: BookOpen,
  plane: Plane,
  dumbbell: Dumbbell,
  briefcase: Briefcase,
};

export default function ExplorePage() {
  const [view, setView] = useState<"selection" | "feed">("selection");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<DummyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    const saved = storage.getInterests();
    setSelectedCategories(saved);

    const localCategories = storage.getCategories();
    setCategories(localCategories);

    const load = async () => {
      try {
        const data = await fetchProducts(30);
        setProducts(data);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleContinue = () => {
    if (selectedCategories.length === 0) return;
    storage.saveInterests(selectedCategories);
    setView("feed");
  };

  const handleSave = async (product: DummyProduct) => {
    try {
      setSavingId(product.id);
      await storage.addBookmark(mapProductToBookmark(product));
    } finally {
      setSavingId(null);
    }
  };

  const categoryColor = useMemo(() => {
    const map = new Map(categories.map((c) => [c.name, c.color]));
    return map;
  }, [categories]);

  const filteredProducts = selectedCategories.length
    ? products.filter((p) => selectedCategories.includes(p.category))
    : products;

  if (view === "selection") {
    return (
      <div className="max-w-5xl mx-auto py-10">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">Explore Your Interests</h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Select categories to unlock top-rated products from DummyJSON
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.name);
            const Icon = IconMap[category.icon] || Folder;
            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.name)}
                className={`
                  relative h-32 flex flex-col items-center justify-center gap-3 rounded-xl border transition-all duration-200 group
                  ${isSelected
                    ? "bg-[#262626] border-[#3B82F6]"
                    : "bg-[#1E1E1E] border-[#333] hover:border-gray-500 hover:bg-[#262626]"
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 text-[#3B82F6]">
                    <CheckCircle2 size={18} fill="#3B82F6" className="text-white" />
                  </div>
                )}

                <Icon
                  size={28}
                  className={isSelected ? "text-white" : "text-gray-400 group-hover:text-gray-200"}
                />
                <span className={`font-medium ${isSelected ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={selectedCategories.length === 0}
            className="flex items-center gap-2 px-8 py-3 bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
          >
            <span>Continue</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Explore Feed</h1>
          <button onClick={() => setView("selection")} className="text-sm text-gray-400 hover:text-white">
            Change Interests
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {selectedCategories.map((name) => {
            const iconId = categories.find((c) => c.name === name)?.icon || "folder";
            const Icon = IconMap[iconId] || Folder;
            return (
              <button
                key={name}
                className="flex items-center gap-2 px-4 py-2 bg-[#262626] border border-[#333] hover:border-gray-500 rounded-lg text-gray-200 whitespace-nowrap transition-colors"
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-400">Loading explore feed...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((item) => (
            <div key={item.id} className="group bg-[#1E1E1E] border border-[#333] hover:border-gray-600 rounded-xl p-5 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#262626] flex items-center justify-center border border-[#333]">
                    <span className={`font-bold text-lg ${categoryColor.get(item.category) || "text-gray-400"}`}>
                      {item.title.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">{item.title}</h3>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-[#262626] text-gray-400 border border-[#333]">
                  {item.category}
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-4 line-clamp-2 h-10">
                {item.description}
              </p>

              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xs ${i < Math.floor(item.rating) ? "text-yellow-500" : "text-gray-700"}`}>
                    ★
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
                <button
                  onClick={() => handleSave(item)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  <BookmarkPlus size={16} />
                  <span>{savingId === item.id ? "Saving..." : "Save"}</span>
                </button>

                <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
                  <Heart size={16} />
                  <span>Like</span>
                </button>

                <a
                  href={item.thumbnail}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-[#3B82F6] transition-colors text-sm font-medium"
                >
                  <ExternalLink size={16} />
                  <span>Visit</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}