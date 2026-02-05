"use client";

import { ExternalLink, Edit2, Share2, Trash2, Star } from "lucide-react";

// --- INSTRUCTIONS: Uncomment this in your real app ---
// import { Bookmark } from "../lib/types";

// --- MOCK TYPE (DELETE IN PROD) ---
type Bookmark = {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  rating: number;
  isFavorite: boolean;
  thumbnail?: string;
};
// ----------------------------------

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function BookmarkCard({ bookmark, onDelete, onEdit }: BookmarkCardProps) {
  
  // Helper to render stars
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={12}
        className={`${
          i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div className="group bg-[#262626] border border-[#333] hover:border-[#3B82F6] rounded-xl p-5 transition-all duration-200 flex flex-col h-full">
      {/* Header: Icon & Category */}
      <div className="flex justify-between items-start mb-4">
        {/* Logo/Icon Placeholder */}
        <div className="w-12 h-12 rounded-lg bg-[#1E1E1E] flex items-center justify-center overflow-hidden border border-[#333]">
           {/* If real image exists use it, else generic letter */}
           {bookmark.thumbnail ? (
             <img src={bookmark.thumbnail} alt={bookmark.title} className="w-full h-full object-cover" />
           ) : (
             <span className="text-xl font-bold text-gray-400">{bookmark.title.charAt(0)}</span>
           )}
        </div>

        {/* Category Badge */}
        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-[#1E1E1E] text-gray-400 border border-[#333]">
          {bookmark.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 mb-4">
        <h3 className="text-lg font-bold text-white mb-1 truncate">{bookmark.title}</h3>
        <p className="text-sm text-gray-400 line-clamp-2 h-10 leading-relaxed">
          {bookmark.description}
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-6">
        {renderStars(bookmark.rating)}
      </div>

      {/* Footer Actions */}
      <div className="grid grid-cols-4 gap-2 mt-auto">
        {/* Main Action: Visit */}
        <a 
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-1 flex items-center justify-center p-2 rounded-lg bg-white hover:bg-gray-100 text-black transition-colors"
          title="Visit Website"
        >
          <ExternalLink size={16} />
        </a>

        {/* Secondary Actions */}
       

        <button 
          className="col-span-1 flex items-center justify-center p-2 rounded-lg bg-[#1E1E1E] hover:bg-[#333] text-gray-400 hover:text-white transition-colors border border-[#333]"
          title="Share"
        >
          <Share2 size={16} />
        </button>

        <button 
          onClick={() => onDelete?.(bookmark.id)}
          className="col-span-1 flex items-center justify-center p-2 rounded-lg bg-[#1E1E1E] hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors border border-[#333]"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}