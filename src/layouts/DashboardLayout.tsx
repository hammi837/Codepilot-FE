import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import PageContainer, { FullBleedContainer } from '@/components/layout/PageContainer';

// Routes that manage their own layout / scrolling — no padding wrapper needed
const FULL_BLEED_ROUTES = ['/chat', '/repositories/'];

function isFullBleed(pathname: string) {
  return FULL_BLEED_ROUTES.some((prefix) => pathname.startsWith(prefix));
}

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const fullBleed = isFullBleed(pathname);

  return (
    <div className='flex h-screen bg-background text-foreground overflow-hidden'>
      <Sidebar />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <Navbar />
        {fullBleed ? (
          <FullBleedContainer>
            <Outlet />
          </FullBleedContainer>
        ) : (
          <PageContainer>
            <Outlet />
          </PageContainer>
        )}
      </div>
    </div>
  );
}
