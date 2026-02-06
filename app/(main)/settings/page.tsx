"use client";

import { useState } from "react";
import { 
  Download, 
  Upload, 
  Trash2, 
  Star 
} from "lucide-react";


import { storage } from "../../../lib/storage";


export default function SettingsPage() {
  
  const [autoFetch, setAutoFetch] = useState(true);
  const [defaultRating, setDefaultRating] = useState(0);
  const [darkMode, setDarkMode] = useState(true);

  const handleExport = () => {
    const bookmarks = storage.getBookmarks();
    const dataStr = JSON.stringify(bookmarks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "markflow-backup.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete ALL bookmarks? This cannot be undone.")) {
      if (typeof window !== 'undefined') localStorage.removeItem('markflow_bookmarks');
      alert("All data cleared.");
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/*headerr */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your app preferences</p>
      </div>

      {/*general settings */}
      <div className="border border-[#333] rounded-xl bg-[#1E1E1E] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#333] bg-[#262626]">
          <h2 className="text-lg font-semibold text-white">General Settings</h2>
        </div>
        
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Default category</label>
            <span className="text-gray-300">Uncategorized</span>
          </div>

          {/* toggle button */}
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Auto-fetch website data</label>
            <button
              onClick={() => setAutoFetch(!autoFetch)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                autoFetch ? 'bg-[#3B82F6]' : 'bg-[#333]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoFetch ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* rating*/}
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Default rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setDefaultRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={20}
                    className={`${
                      star <= defaultRating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/*second box */}
      <div className="border border-[#333] rounded-xl bg-[#1E1E1E] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#333] bg-[#262626]">
          <h2 className="text-lg font-semibold text-white">Appearance</h2>
        </div>
        
        <div className="p-6 space-y-8">
          {/*dark mode light mode*/}
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Dark Mode</label>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                darkMode ? 'bg-[#3B82F6]' : 'bg-[#333]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/*language*/}
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Language</label>
            <span className="text-gray-300">English</span>
          </div>
        </div>
      </div>

      {/*export,import,delete*/}
      <div className="border border-[#333] rounded-xl bg-[#1E1E1E] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#333] bg-[#262626]">
          <h2 className="text-lg font-semibold text-white">Bookmark Management</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Export bookmarks</label>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg font-medium transition-colors text-sm"
            >
              <Upload size={16} />
              <span>Export data</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Import bookmarks</label>
            <div>
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 bg-[#262626] border border-[#333] hover:bg-[#333] text-white rounded-lg font-medium transition-colors text-sm"
              >
                <Download size={16} />
                <span>Import</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#333] flex items-center justify-between">
            <label className="text-gray-300 font-medium">Clear all bookmarks</label>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-900/50 hover:bg-red-900/40 text-red-500 rounded-lg font-medium transition-colors text-sm"
            >
              <Trash2 size={16} />
              <span>Clear all</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}