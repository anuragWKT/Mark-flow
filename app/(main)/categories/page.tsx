"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
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
  Briefcase
} from "lucide-react";

import Link from "next/link";
import AddCategoryModal from "../../../components/AddCategoryModal";
import { storage } from "../../../lib/storage";
import { Category } from "../../../lib/types";

// Helper to map string names to components
const IconMap: Record<string, any> = {
  'folder': Folder,
  'laptop': Laptop,
  'palette': Palette,
  'lightbulb': Lightbulb,
  'smartphone': Smartphone,
  'robot': Bot,
  'tv': Tv,
  'bank': Banknote,
  'headphones': Headphones,
  'book': BookOpen,
  'plane': Plane,
  'dumbbell': Dumbbell,
  'briefcase': Briefcase,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const data = storage.getCategories();
    //all category
    const allCategory = { id: 'all', name: 'All', icon: 'folder', count: data.reduce((acc: number, c: any) => acc + c.count, 0), color: 'text-white' };
    
    // We filter out 'All' if it was already saved to avoid duplicates, then prepend it
    const filtered = data.filter((c: any) => c.name !== 'All');
    setCategories([allCategory, ...filtered]);
  };

  const handleSaveCategory = (newCategory: Category) => {
    storage.addCategory(newCategory);
    loadCategories(); 
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Categories</h1>
          <p className="text-gray-400 mt-1">Organize your bookmarks by category</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Add Button */}
          <button 
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-100 text-black rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} />
            <span>Add new</span>
          </button>

          {/* Search Bar */}
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2.5 border border-[#333] rounded-lg bg-[#121212] text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#3B82F6] text-sm transition-colors"
              placeholder="Search categories"
            />
          </div>

          {/* List View Toggle (Visual only for now) */}
          <button className="p-2.5 border border-[#333] rounded-lg bg-[#121212] text-gray-400 hover:text-white hover:bg-[#262626] transition-colors">
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const IconComponent = IconMap[cat.icon] || Folder;
          
          return (
            <Link 
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="group relative p-5 bg-[#262626] border border-[#333] hover:border-gray-600 rounded-xl transition-all cursor-pointer flex flex-col justify-between h-32"
            >
              {/* Top Row: Name & Icon */}
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-white text-xl tracking-wide group-hover:text-[#3B82F6] transition-colors">
                  {cat.name}
                </h3>
                <IconComponent 
                  size={24} 
                  className={`${cat.color === 'text-white' ? 'text-gray-400' : cat.color} transition-opacity opacity-80 group-hover:opacity-100`} 
                />
              </div>

              {/* Bottom Row: Count */}
              <div>
                <span className=" items-center justify-center px-2 py-1 bg-[#1E1E1E] rounded text-xs text-gray-400 font-medium border border-[#333]">
                  {cat.count} bookmarks
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
      />
    </div>
  );
}