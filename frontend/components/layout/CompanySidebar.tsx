'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, Calendar, Users, Star, DollarSign, Settings, MapPin } from 'lucide-react'

export default function CompanySidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/company/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/company/services', icon: Briefcase, label: 'Services' },
    { href: '/company/bookings', icon: Calendar, label: 'Bookings' },
    { href: '/company/staff', icon: Users, label: 'Staff' },
    { href: '/company/reviews', icon: Star, label: 'Reviews' },
    { href: '/company/payments', icon: DollarSign, label: 'Payments' },
    { href: '/company/areas', icon: MapPin, label: 'Service Areas' },
    { href: '/company/settings', icon: Settings, label: 'Settings' },
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
                  ? 'bg-blue-50 text-blue-600 font-medium'
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
