import CompanyHeader from '@/components/layout/CompanyHeader'
import CompanySidebar from '@/components/layout/CompanySidebar'

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CompanyHeader />
      
      <div className="flex">
        {/* Sidebar */}
        <CompanySidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}