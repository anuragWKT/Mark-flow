"use client";

import { Search, Plus } from "lucide-react";

import Link from "next/link";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#1E1E1E] border-b border-[#262626] h-20 px-8 flex items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-[#262626] rounded-lg leading-5 bg-[#121212] text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-[#1a1a1a] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] sm:text-sm transition-colors"
          placeholder="Search anything..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Link
          href="/add-bookmark"
          className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
        >
          <Plus size={18} />
          <span>New Bookmark</span>
        </Link>
      </div>
    </header>
  );
}