import { Sidebar } from '@/components/sidebar';
import { DemoProvider } from '@/lib/demo-context';
import { Sofia } from '@/components/sofia';
import { GuidedTour } from '@/components/guided-tour';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoProvider>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {/* Mobile top padding for header */}
          <div className="lg:hidden h-14" />
          
          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            {children}
          </div>
        </main>
        
        {/* Sofia AI Assistant */}
        <Sofia />
        
        {/* Guided Tour for Accountants */}
        <GuidedTour />
      </div>
    </DemoProvider>
  );
}
