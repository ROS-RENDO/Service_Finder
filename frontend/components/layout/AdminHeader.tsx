'use client'

import Link from 'next/link'
import { Bell, User, LogOut, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAuthContext } from '@/lib/contexts/AuthContext'
import apiClient from '@/lib/api/client'

export default function AdminHeader() {
  const router = useRouter()
   const { checkAuth } = useAuthContext()

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
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-xl font-bold text-gray-900">
            CleanService
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full">
            <Shield size={16} className="text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Admin Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-3 border-l">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">System Administrator</p>
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
  )
}