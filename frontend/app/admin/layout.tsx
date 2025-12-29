import AdminHeader from '@/components/layout/AdminHeader'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader />
      
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />
        
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