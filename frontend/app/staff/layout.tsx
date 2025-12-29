import StaffHeader from '@/components/layout/StaffHeader'
import StaffSidebar from '@/components/layout/StaffSidebar'

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <StaffHeader />
      
      <div className="flex">
        {/* Sidebar */}
        <StaffSidebar />
        
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