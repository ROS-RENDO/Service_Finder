'use client'

import Link from 'next/link'
import { Bell, User, LogOut, Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CompanyHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Logo & Company Name */}
        <div className="flex items-center gap-4">
          <Link href="/company/dashboard" className="text-xl font-bold text-gray-900">
            CleanService
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
            <Building2 size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Company Portal</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-3 border-l">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Sparkle Clean</p>
              <p className="text-xs text-gray-500">Company Admin</p>
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