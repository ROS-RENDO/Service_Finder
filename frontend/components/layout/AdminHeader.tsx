'use client'
import SharedHeader from './SharedHeader'

export default function AdminHeader() {
  return (
    <SharedHeader
      homeHref="/admin/dashboard"
      portalLabel="Admin"
      portalColor="violet"
      bgAccentClass="bg-violet-500"
      profileHref="/admin/settings"
      messagesHref="/admin/messages"
    />
  )
}