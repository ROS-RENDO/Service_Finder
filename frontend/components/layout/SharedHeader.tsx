'use client'

import Link from 'next/link'
import { Bell, LogOut, MessageCircle, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import apiClient from '@/lib/api/client'
import { useAuthContext } from '@/lib/contexts/AuthContext'
import { useConversations } from '@/lib/hooks/useChat'
import { cn } from '@/lib/utils'

interface SharedHeaderProps {
  homeHref: string
  portalLabel: string
  portalColor: string
  bgAccentClass: string
  profileHref: string
  messagesHref: string
}

export default function SharedHeader({
  homeHref,
  portalLabel,
  portalColor,
  bgAccentClass,
  profileHref,
  messagesHref,
}: SharedHeaderProps) {
  const router = useRouter()
  const { user, checkAuth } = useAuthContext()
  const { conversations } = useConversations()
  const unreadCount = conversations.length

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout')
      await checkAuth()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href={homeHref}
          className="flex items-center gap-2.5 font-bold text-lg shrink-0 group"
        >
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105', bgAccentClass)}>
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-heading tracking-tight">
            Service<span className="text-primary">Finder</span>
          </span>
        </Link>

        {/* Portal badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border/50">
          <div className={cn('w-1.5 h-1.5 rounded-full', `bg-${portalColor}-400`)} />
          <span className={cn('text-xs font-semibold', `text-${portalColor}-400 dark:text-${portalColor}-300`)}>
            {portalLabel}
          </span>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Messages */}
          <Link href={messagesHref}>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl">
              <MessageCircle size={18} />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-red-500 text-white border-0">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 pl-2 pr-3 rounded-xl gap-2 hover:bg-muted/70">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-xs font-semibold bg-primary/20 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium leading-none">{user?.fullName || 'User'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-none capitalize">
                    {user?.role?.replace('_', ' ')}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="font-normal">
                <p className="font-medium text-sm">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={profileHref}>Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
              >
                <LogOut size={14} className="mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
