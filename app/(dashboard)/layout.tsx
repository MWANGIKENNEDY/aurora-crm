"use client";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-64 flex-shrink-0" />
        <Sidebar />
        <main className="flex-1 p-8 transition-all">
          {children}
        </main>
      </div>
    </div>
  );
}
