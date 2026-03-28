'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, ClipboardList, Clock, User, ClipboardCheck, MessageCircle, Ruler } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/staff/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/staff/schedule', icon: Calendar, label: 'My Schedule' },
  { href: '/staff/bookings', icon: ClipboardList, label: 'Active Jobs' },
  { href: '/staff/services', icon: ClipboardCheck, label: 'Service Requests' },
  { href: '/staff/availability', icon: Clock, label: 'Availability' },
  { href: '/staff/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/staff/measurement', icon: Ruler, label: 'AI Measurement' },
  { href: '/staff/profile', icon: User, label: 'Profile' },
]

export default function StaffSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card/50 backdrop-blur-xl border-r border-border/50 min-h-screen sticky top-16 flex-shrink-0">
      <div className="p-3">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Staff Portal
        </p>
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/staff/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 dark:text-emerald-300 shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                <item.icon
                  size={18}
                  className={cn(
                    'transition-transform duration-200 group-hover:scale-110',
                    isActive ? 'text-emerald-400 dark:text-emerald-300' : ''
                  )}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
