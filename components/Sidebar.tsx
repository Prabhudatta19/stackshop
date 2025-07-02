'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LogoutButton } from './LogoutButton';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`glass-bg border-r h-screen p-4 transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
        <button
            onClick={() => setCollapsed(!collapsed)}
            className="mb-6 flex items-center justify-center w-full h-10 bg-black-100 border border-gray-300 rounded-md hover:bg-sky-950 transition"
            aria-label="Toggle Sidebar"
            >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

      <nav className="space-y-4 text-sm">
        <Link href="/dashboard" className="block hover:underline">
          🏠 {!collapsed && 'Dashboard'}
        </Link>
        <Link href="/dashboard/customers" className="block hover:underline">
          👥 {!collapsed && 'Customers'}
        </Link>
        <Link href="/dashboard/transactions" className="block hover:underline">
          📄 {!collapsed && 'Transactions'}
        </Link>
        <Link href="/dashboard/settings" className="block hover:underline">
          # {!collapsed && 'Settings'}
        </Link>
      </nav>

      <div className="mt-8">
        <LogoutButton />
      </div>
    </aside>
  );
}
