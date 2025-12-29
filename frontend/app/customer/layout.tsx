import CustomerHeader from '@/components/layout/CustomerHeader'
import CustomerSidebar from '@/components/layout/CustomerSidebar'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CustomerHeader />
      
      <div className="flex">
        {/* Sidebar */}
        <CustomerSidebar />
        
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