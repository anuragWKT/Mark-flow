"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link as LinkIcon, Edit2, Star, ChevronDown, Loader2, Save } from "lucide-react";

import { storage } from "../../../lib/storage";
import { Category, Bookmark } from "../../../lib/types";


export default function AddBookmarkPage() {
  const router = useRouter();
  
  // Form State
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data State
  const [categories, setCategories] = useState<Category[]>([]);

  const getHostname = (value: string) => {
    try {
      return new URL(value).hostname.replace("www.", "");
    } catch {
      return "";
    }
  };

  const getLogoUrl = (value: string) => {
    const host = getHostname(value);
    return host ? `https://logo.clearbit.com/${host}` : "/image.png";
  };

  useEffect(() => {
    
    const cats = storage.getCategories();
    setCategories(cats);
  }, []);

  const handleFetchData = () => {
    if (!url) return;
    setIsFetching(true);

    setTimeout(() => {
      try {
        const host = getHostname(url);
        const domain = host ? host.split(".")[0] : "";
        const formattedTitle = domain.charAt(0).toUpperCase() + domain.slice(1);
        
        setTitle(formattedTitle);
        setDescription(`Official website for ${formattedTitle}. The best place to find resources and tools for your workflow.`);
        setIsFetching(false);
      } catch (e) {
        setTitle("New Website");
        setDescription("Description could not be fetched.");
        setIsFetching(false);
      }
    }, 1500);
  };

  const handleSave = async () => {
    if (!url || !title || !category) {
      alert("Please fill in the required fields (URL, Name, Category)");
      return;
    }

    const newBookmark = {
      id: Date.now().toString(),
      title,
      url,
      description,
      category,
      rating: rating || 0,
      isFavorite: false,
      thumbnail: getLogoUrl(url),
      createdAt: Date.now(),
    };

    try {
      setIsSaving(true);
      await storage.addBookmark(newBookmark);
      router.push("/");
    } catch (error) {
      alert("Failed to save bookmark. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl  space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Add New Bookmark</h1>
        <p className="text-gray-400 mt-1">Save a new bookmark to your collection</p>
      </div>

      <div className="space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">URL *</label>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-[#262626] rounded-lg bg-[#121212] text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors"
                placeholder="http://example.com"
              />
            </div>
            <button
              onClick={handleFetchData}
              disabled={isFetching || !url}
              className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              {isFetching ? (
                <>
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <LinkIcon size={18} />
                  <span>Fetch Website Data</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Name Input */}
        <div className="space-y-2 max-w-2xl">
          <label className="text-sm font-medium text-gray-300">Name</label>
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-4 py-3 border border-[#262626] rounded-lg bg-[#121212] text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#3B82F6] transition-colors pr-10"
              placeholder="e.g. Figma"
            />
            <Edit2 className="absolute right-3 top-3.5 h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* Description Input */}
        <div className="space-y-2 max-w-2xl">
          <label className="text-sm font-medium text-gray-300">Description</label>
          <div className="relative">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-4 py-3 border border-[#262626] rounded-lg bg-[#121212] text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#3B82F6] transition-colors pr-10"
              placeholder="Short description of the website..."
            />
            <Edit2 className="absolute right-3 top-3.5 h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* Logo & Rating Row */}
        <div className="flex gap-12">
          {/* Logo Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Logo</label>
            <div className="w-16 h-16 rounded-xl bg-[#262626] border border-[#333] flex items-center justify-center overflow-hidden">
               {/* Simple logic to show logo preview if URL exists */}
               <img 
                   src={getLogoUrl(url)} 
                   alt="Logo" 
                   className="w-full h-full object-cover"
                 />
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Bookmark Rating</label>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={24}
                    className={`${
                      star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="space-y-2 max-w-2xl">
          <label className="text-sm font-medium text-gray-300">Category *</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full px-4 py-3 border border-[#262626] rounded-lg bg-[#121212] text-gray-300 focus:outline-none focus:border-[#3B82F6] appearance-none cursor-pointer"
            >
              <option value="" disabled>Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-4 mt-8 bg-white hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 max-w-2xl"
        >
          <Save size={20} />
          <span>{isSaving ? "Saving..." : "Save Bookmark"}</span>
        </button>
      </div>
    </div>
  );
}