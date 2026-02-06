"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { storage } from "../../lib/storage";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  useEffect(() => {
    const token = storage.getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const init = async () => {
      await storage.initializeData();
    };
    init();
  }, [router]);

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