"use client";

import { Calendar, Images, User, CreditCard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Events",
    href: "/dashboard/event",
    icon: Calendar,
  },
  {
    label: "Albums",
    href: "/dashboard/album",
    icon: Images,
  },
  {
    label: "Account",
    href: "/dashboard/account",
    icon: User,
  },
  {
    label: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-neutral-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900 p-6 hidden md:flex flex-col">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold mb-10">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? "bg-indigo-500 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button className="flex items-center gap-3 text-neutral-400 hover:text-white transition mt-6">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
