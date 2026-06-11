"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/matches", label: "Matches" },
    { href: "/groups", label: "Groups" },
    { href: "/predictions", label: "My Predictions" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/results", label: "Results" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-border bg-blue-deep/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl text-gold-gradient">TRIVELA</span>
            <span className="font-display text-lg text-gold">2026</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg transition-all font-heading text-sm font-bold",
                  isActive(link.href)
                    ? "bg-blue-mid text-gold"
                    : "text-blue-border hover:text-white hover:bg-blue-mid/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {session?.user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-mid rounded-lg">
                  <span className="font-heading font-bold text-sm">{session.user.username}</span>
                  <span className="text-gold font-display text-sm">{session.user.totalPoints}</span>
                  {session.user.role === "ADMIN" && (
                    <Shield size={16} className="text-gold" />
                  )}
                </div>
                <Link
                  href={session.user.role === "ADMIN" ? "/admin" : "/profile"}
                  className={cn(
                    session.user.role === "ADMIN"
                      ? "btn-gold text-xs px-4 py-2"
                      : "text-blue-border hover:text-gold transition-colors text-sm font-heading"
                  )}
                >
                  {session.user.role === "ADMIN" ? "Admin Panel" : "Profile"}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-blue-border hover:text-gold transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-outline text-xs px-4 py-2">
                  Login
                </Link>
                <Link href="/auth/register" className="btn-gold text-xs px-4 py-2">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gold"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-blue-border py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-2 rounded-lg transition-all font-heading text-sm font-bold",
                  isActive(link.href)
                    ? "bg-blue-mid text-gold"
                    : "text-blue-border hover:text-white hover:bg-blue-mid/50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-blue-border pt-4 mt-4">
              {session?.user ? (
                <>
                  <div className="px-4 py-2 text-sm">
                    <p className="font-heading font-bold">{session.user.username}</p>
                    <p className="text-gold">{session.user.totalPoints} points</p>
                  </div>
                  <Link
                    href={session.user.role === "ADMIN" ? "/admin" : "/profile"}
                    className="block px-4 py-2 text-blue-border hover:text-gold text-sm font-heading"
                    onClick={() => setMobileOpen(false)}
                  >
                    {session.user.role === "ADMIN" ? "Admin Panel" : "Profile"}
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-blue-border hover:text-gold text-sm font-heading"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link href="/auth/login" className="btn-outline text-xs px-4 py-2 flex-1 text-center">
                    Login
                  </Link>
                  <Link href="/auth/register" className="btn-gold text-xs px-4 py-2 flex-1 text-center">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
