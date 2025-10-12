"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  BarChart3, 
  Link2, 
  User,
  LogOut 
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Generate Link",
    href: "/dashboard/generate-survey",
    icon: Link2,
  },
  {
    name: "Insights",
    href: "/dashboard/insights",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-black" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white">Insight</h1>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <motion.button
                key={item.name}
                onClick={() => router.push(item.href)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </motion.button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="border-t border-slate-800 pt-4">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-300" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {session?.user?.email || "user@example.com"}
                  </p>
                </div>
              )}
            </div>

            {/* Sign Out Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span className="text-sm">Sign Out</span>}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
