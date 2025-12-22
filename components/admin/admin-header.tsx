"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useState } from "react";

export const AdminHeader = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const [searchFocus, setSearchFocus] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center flex-1 gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>

          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${
                searchFocus ? "text-blue-600" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white ${
                searchFocus ? "border-blue-600" : "border-gray-200"
              }`}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
            <Bell className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-8 w-px bg-gray-200"></div>

          <div className="flex items-center gap-3 pl-2">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:shadow-lg transition-shadow">
              AU
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
