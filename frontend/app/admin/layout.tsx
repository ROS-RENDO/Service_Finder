import AdminHeader from "@/components/layout/AdminHeader";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <AdminHeader />

        <div className="flex">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
