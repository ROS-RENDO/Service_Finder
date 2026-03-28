'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Building2, Tag, BarChart3, Settings, ShieldCheck, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/companies', icon: Building2, label: 'Companies' },
  { href: '/admin/categories', icon: Tag, label: 'Categories' },
  { href: '/admin/service-types', icon: Layers, label: 'Service Types' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/verification', icon: ShieldCheck, label: 'Verification' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card/50 backdrop-blur-xl border-r border-border/50 min-h-screen sticky top-16 flex-shrink-0">
      <div className="p-3">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Admin Portal
        </p>
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-violet-500/15 text-violet-400 dark:text-violet-300 shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                <item.icon
                  size={18}
                  className={cn(
                    'transition-transform duration-200 group-hover:scale-110',
                    isActive ? 'text-violet-400 dark:text-violet-300' : ''
                  )}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}