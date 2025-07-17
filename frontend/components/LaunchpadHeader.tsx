import { FC, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { WalletSelector } from "@/components/WalletSelector";

interface LaunchpadHeaderProps {
  title: string;
}

export const LaunchpadHeader: FC<LaunchpadHeaderProps> = ({ title }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    location.pathname === "/apply" 
      ? { name: "Create", link: "/create-scholarship" }
      : { name: "Apply", link: "/apply" }
  ];

  return (
    <div className="relative w-full bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  className="h-10 w-auto object-contain max-h-10 transition-transform duration-300 group-hover:scale-105"
                  alt="Logo"
                />
                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
              </div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AptScholar
              </span>
            </Link>
            
            <div className="hidden md:block h-8 w-px bg-gray-300"></div>
            
            <h2 className="hidden md:block text-xl font-semibold text-gray-800">{title}</h2>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item, idx) => (
                <Link
                  key={`nav-link-${idx}`}
                  to={item.link}
                  className="relative px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-all duration-300 rounded-xl hover:bg-blue-50 group"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
                </Link>
              ))}
            </div>

            {/* Wallet Selector */}
            <div className="relative">
              <WalletSelector />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Title */}
        <div className="md:hidden mt-3 pb-1">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              {navItems.map((item, idx) => (
                <Link
                  key={`mobile-link-${idx}`}
                  to={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span>{item.name}</span>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Mobile Wallet Selector */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <WalletSelector />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
