import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';

export default function DashboardLayout() {
  return (
    <div className='flex min-h-screen bg-background text-foreground'>
      <Sidebar />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <Navbar />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}
