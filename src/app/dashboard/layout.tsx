import DashboardSidebar from '@/components/ui/Dashboardsidebar'
import { Toaster } from 'sonner' // 👈 Import sonner

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900 text-white p-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </header>

        <main className="flex-1 p-6">
          {children}
          <Toaster richColors position="top-right" /> {/* ✅ Add Toaster here */}
        </main>

        <footer className="bg-gray-100 text-center p-4 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} My Dashboard
        </footer>
      </div>
    </div>
  )
}
