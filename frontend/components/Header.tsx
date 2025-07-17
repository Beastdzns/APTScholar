"use client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import { useState } from "react";
import ChatBot from "./ChatBot";
import { MessageCircle } from "lucide-react";
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar";

export function Header() {
  const [chatBot, setChatBot] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleChatClick = () => {
    setChatBot(!chatBot);
  };

  const navItems = [
    {
      name: "Create",
      link: "/create-scholarship",
    },
    {
      name: "Apply",
      link: "/apply",
    },
  ];

  return (
    <div className="relative w-full">
      <div className="relative z-50">
        <Navbar>
          {/* Desktop Navigation */}
          <NavBody>
          {/* Logo */}
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
          
          {/* Navigation Items */}
          <div className="hidden lg:flex items-center justify-center space-x-1">
            {navItems.map((item, idx) => (
              <Link
                key={`nav-link-${idx}`}
                to={item.link}
                className="relative px-6 py-3 text-gray-700 font-medium hover:text-blue-600 transition-all duration-300 rounded-xl hover:bg-blue-50 group"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Desktop ChatBot button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleChatClick}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
            >
              <MessageCircle size={18} />
              <span className="font-medium">ChatBot</span>
            </Button>
            
            {/* Desktop Wallet Selector */}
            <div className="relative">
              <WalletSelector />
            </div>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            {/* Mobile Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  className="h-8 w-auto object-contain max-h-8 transition-transform duration-300 group-hover:scale-105"
                  alt="Logo"
                />
                <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AptScholar
              </span>
            </Link>
            
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
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
                    <span className="text-lg">{item.name}</span>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="flex w-full flex-col gap-3 mt-6 pt-6 border-t border-gray-200">
              {/* Mobile ChatBot button */}
              <Button
                onClick={() => {
                  handleChatClick();
                  setIsMobileMenuOpen(false);
                }}
                variant="ghost"
                className="w-full flex items-center gap-3 justify-center py-3 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 rounded-xl"
              >
                <MessageCircle size={20} />
                <span className="font-medium">ChatBot</span>
              </Button>
              
              {/* Mobile Wallet Selector */}
              <div className="w-full">
                <WalletSelector />
              </div>
            </div>
          </MobileNavMenu>
        </MobileNav>
        </Navbar>
      </div>
      
      {/* ChatBot component */}
      {chatBot && <ChatBot />}
    </div>
  );
}