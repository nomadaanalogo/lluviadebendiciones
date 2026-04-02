import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin | Lluvia de Bendiciones',
  description: 'Panel de administración',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      {/* Main content with sidebar offset */}
      <div className="lg:pl-64 pt-14 lg:pt-0">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
