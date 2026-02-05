"use client";

import { useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { storage } from "../../lib/storage";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // Initialize data engine on app load
  useEffect(() => {
    const init = async () => {
      await storage.initializeData();
    };
    init();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#1E1E1E]">
      <Sidebar />

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        
        <Topbar />
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}