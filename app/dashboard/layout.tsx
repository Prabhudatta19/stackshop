'use client';

import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="p-6 border-b">
          <h1 className="text-2xl font-bold">StackShop</h1>
        </header>
        <main className="glass-bg flex-1 p-6">{children}</main>
      </div>
      
    </div>
  );
}
