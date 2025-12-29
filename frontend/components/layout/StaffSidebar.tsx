'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, ClipboardList, Clock, User } from 'lucide-react'

export default function StaffSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/staff/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/staff/schedule', icon: Calendar, label: 'My Schedule' },
    { href: '/staff/bookings', icon: ClipboardList, label: 'Active Jobs' },
    { href: '/staff/availability', icon: Clock, label: 'Availability' },
    { href: '/staff/profile', icon: User, label: 'Profile' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-green-50 text-green-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
