"use client";
import Image from "next/image";

import { Link2, BarChart3, Sparkles, Menu, X, Home, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-gradient-to-r from-[#450606] to-[#5a0a0a] shadow-2xl border-b border-[#FDE8E8]/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between">
          {/* Logo + Branding with Link to Home */}
          <Link
            href="/"
            className="flex items-center space-x-3 sm:space-x-4 group"
          >
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#fffcfc] rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                <Image
                  src="/logo1.png"
                  alt="TinyLink Logo"
                  width={40}
                  height={40}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
              </div>

              {/* Animated glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FDE8E8] to-[#f8d4d4] rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#FDE8E8] to-[#fffcfc] bg-clip-text text-transparent tracking-tight">
                TinyLink
              </h1>
              <div className="hidden sm:flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#fffcfc]" />
                <span className="text-sm text-[#fffcfc] font-medium tracking-wide">
                  Premium URL Shortener
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-[#FDE8E8]/10 to-[#f8d4d4]/10 rounded-2xl p-2 border border-[#FDE8E8]/20 shadow-lg">
            <Link
              href="/"
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                pathname === "/"
                  ? "bg-[#FDE8E8] text-[#450606] shadow-lg transform scale-105"
                  : "text-[#FDE8E8] hover:bg-[#FDE8E8]/20 hover:text-white hover:scale-105"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="tracking-wide">Home</span>
            </Link>
            <Link
              href="/analytics"
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                pathname === "/analytics"
                  ? "bg-[#FDE8E8] text-[#450606] shadow-lg transform scale-105"
                  : "text-[#FDE8E8] hover:bg-[#FDE8E8]/20 hover:text-white hover:scale-105"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="tracking-wide">Analytics</span>
            </Link>
            {/* Health Check Link */}
            <Link
              href="/healthz"
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                pathname === "/healthz"
                  ? "bg-[#FDE8E8] text-[#450606] shadow-lg transform scale-105"
                  : "text-[#FDE8E8] hover:bg-[#FDE8E8]/20 hover:text-white hover:scale-105"
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="tracking-wide">Health</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FDE8E8]/10 to-[#f8d4d4]/10 border border-[#FDE8E8]/20 text-[#FDE8E8] hover:bg-[#FDE8E8]/20 transition-all duration-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-gradient-to-r from-[#FDE8E8]/10 to-[#f8d4d4]/10 rounded-2xl p-4 border border-[#FDE8E8]/20 shadow-lg">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  pathname === "/"
                    ? "bg-[#FDE8E8] text-[#450606] shadow-lg"
                    : "text-[#FDE8E8] hover:bg-[#FDE8E8]/20 hover:text-white"
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="tracking-wide">Home</span>
              </Link>
              <Link
                href="/analytics"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  pathname === "/analytics"
                    ? "bg-[#FDE8E8] text-[#450606] shadow-lg"
                    : "text-[#FDE8E8] hover:bg-[#FDE8E8]/20 hover:text-white"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="tracking-wide">Analytics</span>
              </Link>
              {/* Health Check Mobile Link */}
              <Link
                href="/healthz"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  pathname === "/healthz"
                    ? "bg-[#FDE8E8] text-[#450606] shadow-lg"
                    : "text-[#FDE8E8] hover:bg-[#FDE8E8]/20 hover:text-white"
                }`}
              >
                <Heart className="w-5 h-5" />
                <span className="tracking-wide">Health Check</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
