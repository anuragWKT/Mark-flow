"use client";

import { useState, useEffect } from "react";
import { Clock, ArrowUpDown, List, LayoutGrid } from "lucide-react";
import BookmarkCard from "../../../components/BookmarkCard";
import { storage } from "../../../lib/storage";
import { Bookmark } from "../../../lib/types";


export default function FrequentPage() {
  const [frequentBookmarks, setFrequentBookmarks] = useState<Bookmark[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list"); 

  useEffect(() => {
    const allBookmarks = storage.getBookmarks();
    const filtered = allBookmarks.filter((b: any) => b.isFavorite || b.rating >= 4);
    setFrequentBookmarks(filtered as Bookmark[]);
  }, []);

  const handleDelete = async (id: string) => {
    const updated = await storage.deleteBookmark(id);
    const filtered = updated.filter((b: any) => b.isFavorite || b.rating >= 4);
    setFrequentBookmarks(filtered as Bookmark[]);
  };


  return (
    <div className="space-y-8 pb-10">
      {/*header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Frequent
            </h1>
            <p className="text-gray-400 mt-1">Your most visited bookmarks, always at hand.</p>
          </div>

          {/*control buttons */}
          <div className="flex items-center gap-3">

            <div className="flex bg-[#262626] p-1 rounded-lg border border-[#333]">
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

      {/* main contents */}
      {frequentBookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[#262626] rounded-xl bg-[#1E1E1E]">
          <Clock className="w-12 h-12 text-gray-600 mb-4" />
          <p className="text-gray-500 text-lg">No frequent bookmarks yet.</p>
          <p className="text-gray-600 text-sm mt-1">Star some bookmarks or use them often to see them here.</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-4' : 'grid-cols-1'}`}>
          {frequentBookmarks.map((bookmark) => (
            <div key={bookmark.id} className={viewMode === 'list' ? 'max-w-full' : ''}>
              <BookmarkCard 
                bookmark={bookmark} 
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}