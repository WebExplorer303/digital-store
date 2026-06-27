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

  return (
    <>
    <nav className="relative flex items-center px-6 py-6 bg-[#9cb3b8] border-b border-black/10">
      <div className="flex items-center gap-1 shrink-0">
<Link href="/" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-black/10 transition-colors">
<Image src="/logo.svg" alt="Digital Store" width={160} height={50} style={{ height: '40px', width: 'auto' }} />
</Link>
        <Link href="/manage" className="flex items-center gap-1.5 text-sm font-semibold text-stone-700 hover:bg-black/10 px-3 py-2.5 rounded-lg transition-colors">
          <i className="ti ti-package text-base" aria-hidden="true" />
          My Products
        </Link>
        <Link href="/cart" className="flex items-center gap-1.5 text-sm font-semibold text-stone-700 hover:bg-black/10 px-3 py-2.5 rounded-lg transition-colors">
          <i className="ti ti-shopping-cart text-base" aria-hidden="true" />
          Cart
        </Link>
      </div>

      <div className="flex-1 w-[500px] absolute left-1/2 -translate-x-1/2">
        <SearchInput />
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {isLoggedIn ? (
          <div className="flex items-center gap-1 shrink-0">         
<button
  onClick={handleSignOut}
  className="text-sm font-bold text-slate-700 hover:text-slate-900 bg-white/40 hover:bg-white/60 px-4 py-2 rounded-lg transition-colors"
>
  Sign out
</button></div>
        ) : (
          <>
            <Link href="/login"  className="text-sm font-bold text-slate-700 hover:text-slate-900 bg-white/40 hover:bg-white/60 px-4 py-2 rounded-lg transition-colors">
              Sign in
            </Link>
            <Link href="/sign-up" className="text-sm font-semibold text-white bg-stone-800 hover:bg-stone-700 px-5 py-2.5 rounded-lg transition-colors">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
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

