import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import { useState } from "react";
import ChatBot from "./ChatBot";
import { Menu, X, MessageCircle } from "lucide-react";

const navLinks = [
  { title: 'Create', link: '/create-scholarship' },
  { title: 'Apply', link: '/apply' },
]

export function Header() {
  const [chatBot, setChatBot] = useState<boolean>(false);
  const [showNav, setShowNav] = useState<boolean>(false);

  const handleChatClick = () => {
    setChatBot(!chatBot);
  };

  const handleShowNav = () => {
    setShowNav(!showNav);
  };

  return (
    <nav className="relative z-20 backdrop-blur-lg bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-4 sm:gap-10">
          {/* hamburger menu or cross icon */}
          <button onClick={handleShowNav} aria-label="Toggle Menu" className="md:hidden">
            {showNav ? (
              <X color="#202020" strokeWidth={2} size={24} />
            ) : (
              <Menu color="#202020" strokeWidth={2} size={24} />
            )}
          </button>
          
          {/* logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              className="h-26 w-auto object-contain max-h-28"
              alt="Logo"
            />
          </Link>
          
          {/* nav links */}
          <div
            className={`absolute right-0 left-0 -z-10 flex w-full flex-col gap-3 bg-white/95 backdrop-blur-lg p-3 shadow transition-all duration-300 ease-in-out md:relative md:top-auto md:right-auto md:left-0 md:z-auto md:flex-row md:shadow-none md:bg-transparent ${showNav ? 'top-[64px]' : 'top-[-165px]'}`}
          >
            {navLinks.map(({ title, link }, index) => (
              <Link
                key={index}
                to={link}
                className="rounded-md text-[18px] px-3 py-2 text-slate-600 transition-colors duration-100 ease-linear hover:bg-gray-100 hover:text-gray-900 md:hover:bg-gray-700 md:hover:text-white"
                onClick={() => setShowNav(false)}
              >
                {title}
              </Link>
            ))}
            
            {/* Mobile ChatBot button */}
            <button
              onClick={handleChatClick}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-600 transition-colors duration-100 ease-linear hover:bg-gray-100 hover:text-gray-900 md:hidden"
            >
              <MessageCircle size={18} />
              ChatBot
            </button>
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Desktop ChatBot button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleChatClick}
            className="hidden md:flex items-center gap-2 text-slate-600 hover:text-gray-900"
          >
            <MessageCircle size={18} />
            ChatBot
          </Button>
          
          <WalletSelector />
        </div>
      </div>
      
      {/* ChatBot component */}
      {chatBot && <ChatBot />}
    </nav>
  );
}
