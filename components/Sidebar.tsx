"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Folder, 
  Clock, 
  Compass, 
  PlusCircle, 
  Settings
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Categories", href: "/categories", icon: Folder },
    { name: "Frequent", href: "/frequent", icon: Clock },
    { name: "Explore", href: "/explore", icon: Compass },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-[#1E1E1E] border-r border-[#262626] flex flex-col z-50">
      {/*main logo*/}
      <div className="p-8 pb-4">
        <div className="flex flex-col items-center justify-center gap-2 mb-8">
          <img src="Logo.png" alt="" />
        </div>
      </div>

      {/* navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? "text-white bg-[#262626]" 
                  : "text-gray-400 hover:text-white hover:bg-[#262626]/50"
                }
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#3B82F6] rounded-r-full" />
              )}
              
              <item.icon 
                size={20} 
                className={isActive ? "text-[#3B82F6]" : "text-gray-400"} 
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
        <Link
          href="/add-bookmark"
          className={`
            relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
            ${pathname === "/add-bookmark"
              ? "text-white bg-[#262626]"
              : "text-gray-400 hover:text-white hover:bg-[#262626]/50"
            }
          `}
        >
          {pathname === "/add-bookmark" && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#3B82F6] rounded-r-full" />
          )}
          <PlusCircle size={20} className={pathname === "/add-bookmark" ? "text-[#3B82F6]" : "text-gray-400"} />
          <span className="font-medium">Add Bookmark</span>
        </Link>

        <Link
          href="/settings"
          className={`
            relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
            ${pathname === "/settings"
              ? "text-white bg-[#262626]"
              : "text-gray-400 hover:text-white hover:bg-[#262626]/50"
            }
          `}
        >
          {pathname === "/settings" && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#3B82F6] rounded-r-full" />
          )}
          <Settings size={20} className={pathname === "/settings" ? "text-[#3B82F6]" : "text-gray-400"} />
          <span className="font-medium">Settings</span>
        </Link>
      </nav>

      <div className="p-4 space-y-4">
        {/*footer*/}
        <div className="px-4 py-6 border-t border-[#262626]">
          <p className="text-xs text-gray-600">
            2025 Markflow.
            <br />
            <span className="underline cursor-pointer hover:text-gray-500">Anurag Shetty</span>
          </p>
        </div>
      </div>
    </aside>
  );
}