'use client'

import Link from 'next/link'
import { Bell, User, LogOut, Briefcase } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function StaffHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/staff/dashboard" className="text-xl font-bold text-gray-900">
            CleanService
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
            <Briefcase size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-600">Staff Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-3 border-l">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Mike Johnson</p>
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
  )
}