"use client";

import Link from "next/link";
import { Bell, User, LogOut, Briefcase, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";
import { useAuthContext } from "@/lib/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { conversations } from "@/data/mockData";

export default function StaffHeader() {
  const router = useRouter();
  const totalUnread = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);
    const {user, checkAuth } = useAuthContext()

  
   const handleLogout = async () => {
    try {
      // ✅ Call logout endpoint (clears cookie)
      await apiClient.post('/api/auth/logout')
      
      // ✅ Update context
      await checkAuth()
      
      // ✅ Redirect to home
      router.push('/')
      
      console.log('✅ Logged out successfully')
    } catch (error) {
      console.error('❌ Logout failed:', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/staff/dashboard"
            className="text-xl font-bold text-gray-900"
          >
            CleanService
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
            <Briefcase size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-600">
              Staff Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>


          <div className="flex items-center gap-3 pl-3 border-l">
          <Link href="/staff/messages">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <MessageCircle className="h-5 w-5" />
              {totalUnread > 0 && (
                <Badge 
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-semibold bg-primary text-primary-foreground border-2 border-card animate-pulse-soft"
                >
                  {totalUnread}
                </Badge>
              )}
            </Button>
          </Link>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-xs text-gray-500">Staff</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <User size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-full text-red-600"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
