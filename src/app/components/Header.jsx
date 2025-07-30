"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 md:hidden">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Link href="/dashboard">
            <h1 className="text-xl font-bold text-gray-900">Rustam Industry</h1>
          </Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={onMenuClick}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
