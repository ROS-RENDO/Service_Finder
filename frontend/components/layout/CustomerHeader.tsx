'use client'
import SharedHeader from './SharedHeader'

export default function CustomerHeader() {
  return (
    <SharedHeader
      homeHref="/customer/dashboard"
      portalLabel="Customer"
      portalColor="sky"
      bgAccentClass="bg-sky-500"
      profileHref="/customer/profile"
      messagesHref="/customer/messages"
    />
  )
}
