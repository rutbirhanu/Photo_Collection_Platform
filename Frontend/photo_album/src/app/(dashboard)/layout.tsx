"use client";

import { useState } from "react";
import {
  Calendar,
  Images,
  User,
  CreditCard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/redux/authSlice";

const navItems = [
  { label: "Events", href: "/event", icon: Calendar },
  { label: "Albums", href: "/album", icon: Images },
  // { label: "Account", href: "/account", icon: User },
  { label: "Billing", href: "/pricing", icon: CreditCard },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, error } = useAppSelector((state) => state.auth);
  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white">
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6 text-neutral-700" />
        </button>

        <Link href="/" className="font-bold text-lg">
          Event<span className="text-indigo-500">Gallery</span>
        </Link>
      </div>

      {/* Mobile Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 p-6
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:flex md:flex-col
        `}
      >
        {/* Mobile Close */}
        <div className="flex items-center justify-between mb-10 md:hidden">
          <span className="text-xl font-bold">
            Event<span className="text-indigo-500">Gallery</span>
          </span>
          <button onClick={() => setOpen(false)}>
            <X className="w-6 h-6 text-neutral-700" />
          </button>
        </div>

        {/* Desktop Logo */}
        <Link href="/" className="text-xl font-bold mb-10 hidden md:block">
          Event<span className="text-indigo-500">Gallery</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active
                  ? "bg-indigo-500 text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button  onClick={handleLogout} className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900 transition mt-6 cursor-pointer">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 px-6 py-8 min-h-screen bg-neutral-50">
        {children}
      </main>
    </div>
  );
}
