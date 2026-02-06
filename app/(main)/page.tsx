"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown, List, LayoutGrid } from "lucide-react";


import BookmarkCard from "../../components/BookmarkCard";
import { storage } from "../../lib/storage";
import { Bookmark } from "../../lib/types";


export default function HomePage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const data = storage.getBookmarks();
    setBookmarks(data as Bookmark[]);
  }, []);

  const handleDelete = async (id: string) => {
    const updated = await storage.deleteBookmark(id);
    setBookmarks(updated);
  };


  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Home</h1>
            <p className="text-gray-400 mt-1">Effortless Bookmark Management</p>
          </div>

          {/* controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2 px-4 py-2 bg-[#262626] border border-[#333] hover:border-gray-600 rounded-lg text-gray-300 transition-colors text-sm font-medium"
            >
              <ArrowUpDown size={16} />
              <span>Sort: {sortOrder === "asc" ? "A-Z" : "Z-A"}</span>
            </button>

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

      {/* Bookmarks */}
      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[#262626] rounded-xl">
          <p className="text-gray-500 text-lg">No bookmarks found.</p>
          <p className="text-gray-600 text-sm mt-1">Add a new bookmark to get started.</p>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {[...bookmarks]
            .sort((a, b) =>
              sortOrder === "asc"
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title)
            )
            .map((bookmark) => (
            <div key={bookmark.id} className={viewMode === "list" ? "max-w-8xl" : ""}>
              <BookmarkCard bookmark={bookmark} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}