'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Building2, Tag, BarChart3, Settings, ShieldCheck } from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/companies', icon: Building2, label: 'Companies' },
    { href: '/admin/categories', icon: Tag, label: 'Categories' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/verification', icon: ShieldCheck, label: 'Verification' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
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
                  ? 'bg-purple-50 text-purple-600 font-medium'
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