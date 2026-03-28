'use client'
import SharedHeader from './SharedHeader'

export default function StaffHeader() {
  return (
    <SharedHeader
      homeHref="/staff/dashboard"
      portalLabel="Staff"
      portalColor="emerald"
      bgAccentClass="bg-emerald-500"
      profileHref="/staff/profile"
      messagesHref="/staff/messages"
    />
  )
}
