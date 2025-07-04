'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LayoutDashboard, Users, FileText, Package, Settings, LogOut, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { LogoutButton } from './LogoutButton';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const linkClasses = (path) =>
    `flex items-center gap-3 text-gray-300 hover:text-white px-3 py-2 rounded-md transition ${
      pathname === path ? 'bg-blue-800 text-white' : ''
    }`;

  return (
    <div className="relative">
      {/* Mobile Hamburger */}
      { !isMobileOpen && (
        <button
          className="md:hidden fixed top-4 left-4 p-2 text-white bg-[#0B1D3A] rounded-md z-30"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full p-4 flex flex-col justify-between bg-[#0B1D3A] border-r transition-all duration-300 z-40
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} 
          ${isDesktopCollapsed ? 'md:w-16' : 'md:w-64'} 
          md:translate-x-0
        `}
      >
        <div>
          <div className="flex items-center justify-between mb-10 px-2">
            <h1 className={`text-2xl font-bold text-white ${isDesktopCollapsed ? 'hidden' : 'block'}`}>StackShop</h1>

            {/* Mobile close */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden text-white p-1 rounded hover:bg-blue-900"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
              className="hidden md:inline-flex text-white p-1 rounded hover:bg-blue-900"
            >
              {isDesktopCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <nav className="space-y-4 text-sm">
            <Link href="/dashboard" className={linkClasses('/dashboard')}>
              <LayoutDashboard className="w-5 h-5" />
              {!isDesktopCollapsed && <span>Dashboard</span>}
            </Link>

            <Link href="/dashboard/customers" className={linkClasses('/dashboard/customers')}>
              <Users className="w-5 h-5" />
              {!isDesktopCollapsed && <span>Customers</span>}
            </Link>

            <Link href="/dashboard/transactions" className={linkClasses('/dashboard/transactions')}>
              <FileText className="w-5 h-5" />
              {!isDesktopCollapsed && <span>Transactions</span>}
            </Link>

            <Link href="/dashboard/products" className={linkClasses('/dashboard/products')}>
              <Package className="w-5 h-5" />
              {!isDesktopCollapsed && <span>Products</span>}
            </Link>

            <Link href="/dashboard/settings" className={linkClasses('/dashboard/settings')}>
              <Settings className="w-5 h-5" />
              {!isDesktopCollapsed && <span>Settings</span>}
            </Link>
          </nav>
        </div>

        <div>
          <LogoutButton>
            <div className="flex items-center gap-3 text-gray-300 hover:text-white px-3 py-2 rounded-md cursor-pointer">
              <LogOut className="w-5 h-5" />
              {!isDesktopCollapsed && <span>Logout</span>}
            </div>
          </LogoutButton>
        </div>
      </aside>
    </div>
  );
}

