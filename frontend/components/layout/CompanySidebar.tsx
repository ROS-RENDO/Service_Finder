'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, Calendar, Users, Star, DollarSign, Settings, MapPin, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/company/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/company/services', icon: Briefcase, label: 'Services' },
  { href: '/company/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/company/staff', icon: Users, label: 'Staff' },
  { href: '/company/reviews', icon: Star, label: 'Reviews' },
  { href: '/company/payments', icon: DollarSign, label: 'Payments' },
  { href: '/company/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/company/areas', icon: MapPin, label: 'Service Areas' },
  { href: '/company/settings', icon: Settings, label: 'Settings' },
]

export default function CompanySidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card/50 backdrop-blur-xl border-r border-border/50 min-h-screen sticky top-16 flex-shrink-0">
      <div className="p-3">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Company Portal
        </p>
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/company/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-500/15 text-blue-400 dark:text-blue-300 shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                <item.icon
                  size={18}
                  className={cn(
                    'transition-transform duration-200 group-hover:scale-110',
                    isActive ? 'text-blue-400 dark:text-blue-300' : ''
                  )}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
