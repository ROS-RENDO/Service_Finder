'use client'
import SharedHeader from './SharedHeader'

export default function CompanyHeader() {
  return (
    <SharedHeader
      homeHref="/company/dashboard"
      portalLabel="Company Admin"
      portalColor="blue"
      bgAccentClass="bg-blue-500"
      profileHref="/company/settings"
      messagesHref="/company/messages"
    />
  )
}
