'use client'

import Link from 'next/link'
import { Bell, LogOut, MessageCircle, Zap, Check } from 'lucide-react'
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
import { useAuthContext } from '@/lib/contexts/AuthContext'
import { useConversations } from '@/lib/hooks/useChat'
import { useNotifications } from '@/lib/hooks/useNotifications'
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
  const { user, logout } = useAuthContext()
  const { conversations } = useConversations()
  const { notifications, unreadCount: unreadNotifications, markAsRead } = useNotifications()
  const unreadCount = conversations.length

  const handleLogout = () => {
    logout()
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl">
                <Bell size={18} />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-red-500 text-white border-0 flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadNotifications > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                    onClick={() => markAsRead('all')}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={cn(
                        "p-4 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors cursor-pointer",
                        !notif.isRead ? "bg-primary/5 hover:bg-primary/10" : ""
                      )}
                      onClick={() => {
                        if (!notif.isRead) markAsRead(notif.id)
                        if (notif.link) window.location.href = notif.link
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-1">
                          <p className={cn("text-sm", !notif.isRead ? "font-semibold" : "font-medium")}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notif.body}
                          </p>
                          <p className="text-[10px] text-muted-foreground pt-1 opacity-70">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

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
