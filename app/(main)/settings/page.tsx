"use client";

import { useState, useRef } from "react";
import { 
  Moon, 
  Globe, 
  Download, 
  Upload, 
  Trash2, 
  ChevronDown, 
  Check, 
  Star 
} from "lucide-react";


import { storage } from "../../../lib/storage";


export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for settings
  const [defaultCategory, setDefaultCategory] = useState("Uncategorized");
  const [autoFetch, setAutoFetch] = useState(true);
  const [defaultRating, setDefaultRating] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("English");

  // Handlers
  const handleExport = () => {
    const bookmarks = storage.getBookmarks();
    const dataStr = JSON.stringify(bookmarks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `markflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        storage.saveBookmarks?.(json);
        alert("Bookmarks imported successfully!");
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your app preferences</p>
      </div>

      {/* Group 1: General Settings */}
      <div className="border border-[#333] rounded-xl bg-[#1E1E1E] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#333] bg-[#262626]">
          <h2 className="text-lg font-semibold text-white">General Settings</h2>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Default Category */}
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Default category</label>
            <div className="relative w-64">
              <select
                value={defaultCategory}
                onChange={(e) => setDefaultCategory(e.target.value)}
                className="w-full appearance-none bg-[#121212] border border-[#333] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#3B82F6]"
              >
                <option>Uncategorized</option>
                <option>Development</option>
                <option>Design</option>
                <option>Inspiration</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Auto-fetch Toggle */}
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

          {/* Default Rating */}
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

      {/* Group 2: Appearance */}
      <div className="border border-[#333] rounded-xl bg-[#1E1E1E] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#333] bg-[#262626]">
          <h2 className="text-lg font-semibold text-white">Appearance</h2>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Dark Mode */}
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

          {/* Language */}
          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-medium">Language</label>
            <div className="relative w-64">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full appearance-none bg-[#121212] border border-[#333] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#3B82F6]"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Group 3: Data Management */}
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
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".json"
              />
              <button
                onClick={handleImportClick}
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