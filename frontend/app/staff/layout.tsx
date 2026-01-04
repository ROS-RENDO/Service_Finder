import StaffHeader from "@/components/layout/StaffHeader";
import StaffSidebar from "@/components/layout/StaffSidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["staff"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <StaffHeader />

        <div className="flex">
          {/* Sidebar */}
          <StaffSidebar />

          {/* Main Content Area */}
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
