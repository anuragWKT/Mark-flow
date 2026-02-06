"use client";

import { useState } from "react";
import { 
  Laptop, 
  Palette, 
  Briefcase, 
  Smartphone, 
  DollarSign, 
  Globe, 
  Music, 
  Film, 
  MessageSquare, 
  Book, 
  Brain, 
  Camera, 
  Mail, 
  Gamepad, 
  Lightbulb, 
  Mic, 
  Compass, 
  Tv 
} from "lucide-react";

import { Category } from "../lib/types";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
}

const ICONS = [
  { id: 'laptop', icon: Laptop },
  { id: 'palette', icon: Palette },
  { id: 'briefcase', icon: Briefcase },
  { id: 'smartphone', icon: Smartphone },
  { id: 'dollar', icon: DollarSign },
  { id: 'globe', icon: Globe },
  { id: 'music', icon: Music },
  { id: 'film', icon: Film },
  { id: 'message', icon: MessageSquare },
  { id: 'book', icon: Book },
  { id: 'brain', icon: Brain },
  { id: 'camera', icon: Camera },
  { id: 'mail', icon: Mail },
  { id: 'gamepad', icon: Gamepad },
  { id: 'lightbulb', icon: Lightbulb },
  { id: 'mic', icon: Mic },
  { id: 'compass', icon: Compass },
  { id: 'tv', icon: Tv },
];

const COLORS = [
  { id: 'red', class: 'bg-red-500', text: 'text-red-500' },
  { id: 'orange', class: 'bg-orange-500', text: 'text-orange-500' },
  { id: 'yellow', class: 'bg-yellow-500', text: 'text-yellow-500' },
  { id: 'green', class: 'bg-green-500', text: 'text-green-500' },
  { id: 'teal', class: 'bg-teal-500', text: 'text-teal-500' },
  { id: 'blue', class: 'bg-blue-500', text: 'text-blue-500' },
  { id: 'purple', class: 'bg-purple-500', text: 'text-purple-500' },
  { id: 'gray', class: 'bg-gray-400', text: 'text-gray-400' },
  { id: 'slate', class: 'bg-slate-600', text: 'text-slate-600' },
];

export default function AddCategoryModal({ isOpen, onClose, onSave }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("laptop");
  const [selectedColor, setSelectedColor] = useState("blue");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;

    const colorObj = COLORS.find(c => c.id === selectedColor) || COLORS[0];
    
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      icon: selectedIcon,
      color: colorObj.text,
      count: 0
    };

    onSave(newCategory);
    onClose();
    setName("");
    setSelectedIcon("laptop");
    setSelectedColor("blue");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-[38%] bg-[#1E1E1E] border border-[#333] rounded-2xl p-20 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/*header*/}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white">Add New Category</h2>
          <p className="text-sm text-gray-400 mt-1">Create a new category to organize your bookmarks</p>
        </div>

        <div className="space-y-6">
          {/*input for category name*/}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Category Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-3 border border-[#333] rounded-lg bg-[#121212] text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#3B82F6] transition-colors"
              placeholder="Enter category name..."
            />
          </div>

          {/*selection for category icon*/}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Choose Icon</label>
            <div className="grid grid-cols-6 gap-2 p-2 border border-[#333] rounded-lg bg-[#121212]">
              {ICONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedIcon(item.id)}
                  className={`p-2 rounded-md flex items-center justify-center transition-all ${
                    selectedIcon === item.id 
                      ? "bg-[#3B82F6] text-white" 
                      : "text-gray-400 hover:text-white hover:bg-[#262626]"
                  }`}
                  title={item.id}
                >
                  <item.icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/*color picker*/}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Choose color</label>
            <div className="flex flex-wrap gap-3 p-3 border border-[#333] rounded-lg bg-[#121212] justify-center">
              {COLORS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedColor(item.id)}
                  className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${item.class} ${
                    selectedColor === item.id ? "ring-2 ring-white ring-offset-2 ring-offset-[#121212]" : ""
                  }`}
                  title={item.id}
                />
              ))}
            </div>
          </div>


          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="w-full py-3 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-colors"
            >
              Create Category
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#262626] hover:bg-[#333] text-gray-300 font-medium rounded-lg transition-colors border border-[#333]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}