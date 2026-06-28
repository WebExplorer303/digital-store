"use client";

import Link from 'next/link';
import { signOut } from "firebase/auth";
import { authClient } from "@/lib/firebase";
import SearchInput from './searchBar';
import '@tabler/icons-webfont/dist/tabler-icons.css';
import Image from "next/image"
import LoginForm from "@/components/loginForm"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

interface NavbarProps {
  isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        await signOut(authClient);
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("showLogin") === "true") {
      setShowLogin(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const closeMenu = () => setProfileMenuOpen(false);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [profileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="relative flex items-center px-4 md:px-6 py-4 md:py-6 bg-[#9cb3b8] border-b border-black/10">

        <div className="flex items-center gap-1 shrink-0">
          <Link href="/" className="flex items-center px-2 md:px-3 py-2.5 rounded-lg hover:bg-black/10 transition-colors">
            <Image src="/logo.svg" alt="Digital Store" width={160} height={50} style={{ height: '36px', width: 'auto' }} className="md:!h-10" />
          </Link>

          <Link href="/manage" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-stone-700 hover:bg-black/10 px-3 py-2.5 rounded-lg transition-colors">
            <i className="ti ti-package text-base" aria-hidden="true" />
            My Products
          </Link>
          <Link href="/cart" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-stone-700 hover:bg-black/10 px-3 py-2.5 rounded-lg transition-colors">
            <i className="ti ti-shopping-cart text-base" aria-hidden="true" />
            Cart
          </Link>
        </div>

        <div className="hidden md:block flex-1 w-[500px] absolute left-1/2 -translate-x-1/2">
          <SearchInput />
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto">
          {isLoggedIn ? (
            <button
              onClick={handleSignOut}
              className="text-sm font-bold text-slate-700 hover:text-slate-900 bg-white/40 hover:bg-white/60 px-4 py-2 rounded-lg transition-colors"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-slate-900 bg-white/40 hover:bg-white/60 px-4 py-2 rounded-lg transition-colors">
                Sign in
              </Link>
              <Link href="/sign-up" className="text-sm font-semibold text-white bg-stone-800 hover:bg-stone-700 px-5 py-2.5 rounded-lg transition-colors">
                Sign up
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-1.5 ml-auto">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileMenuOpen(!profileMenuOpen);
                }}
                className="flex items-center justify-center p-1.5 rounded-full hover:bg-black/10 transition-colors"
                aria-label="Account menu"
              >
                <i className="ti ti-user-circle text-3xl text-stone-700" aria-hidden="true" />
              </button>

              {profileMenuOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-2 w-40 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden z-20"
                >
                  <button
                    onClick={() => { setProfileMenuOpen(false); handleSignOut(); }}
                    className="w-full flex items-center gap-2 text-left text-sm font-semibold text-stone-700 px-4 py-3 hover:bg-stone-100 transition-colors"
                  >
                    <i className="ti ti-logout text-base" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white/40 hover:bg-white/60 px-3 py-1.5 rounded-lg transition-colors">
                Sign in
              </Link>
              <Link href="/sign-up" className="text-xs font-semibold text-white bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-lg transition-colors">
                Sign up
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-black/10 transition-colors"
            aria-label="Toggle menu"
          >
            <i className={`ti ${mobileMenuOpen ? 'ti-x' : 'ti-menu-2'} text-2xl text-stone-700`} aria-hidden="true" />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#9cb3b8] border-b border-black/10 px-4 py-4 space-y-3">
          <SearchInput />

          <div className="flex flex-col gap-1 pt-2">
            <Link
              href="/manage"
              onClick={closeMobileMenu}
              className="flex items-center gap-2 text-sm font-semibold text-stone-700 hover:bg-black/10 px-3 py-2.5 rounded-lg transition-colors"
            >
              <i className="ti ti-package text-base" aria-hidden="true" />
              My Products
            </Link>
            <Link
              href="/cart"
              onClick={closeMobileMenu}
              className="flex items-center gap-2 text-sm font-semibold text-stone-700 hover:bg-black/10 px-3 py-2.5 rounded-lg transition-colors"
            >
              <i className="ti ti-shopping-cart text-base" aria-hidden="true" />
              Cart
            </Link>
          </div>
        </div>
      )}

      {showLogin && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowLogin(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <LoginForm onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </>
  );
}