'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Building2, Calendar, CreditCard, Star, User, MessageCircle, Map } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/customer/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/customer/services', icon: Building2, label: 'Find Services' },
  { href: '/customer/bookings', icon: Calendar, label: 'My Bookings' },
  { href: '/customer/payments', icon: CreditCard, label: 'Payments' },
  { href: '/customer/reviews', icon: Star, label: 'My Reviews' },
  { href: '/customer/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/customer/map', icon: Map, label: 'Map View' },
  { href: '/customer/profile', icon: User, label: 'Profile' },
]

export default function CustomerSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card/50 backdrop-blur-xl border-r border-border/50 min-h-screen sticky top-16 flex-shrink-0">
      <div className="p-3">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Navigation
        </p>
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/customer/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/15 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                <item.icon
                  size={18}
                  className={cn(
                    'transition-transform duration-200 group-hover:scale-110',
                    isActive ? 'text-primary' : ''
                  )}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}