import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { CreateVideoModal } from '@/components/common/CreateVideoModal';
import { CreateTweetModal } from '@/components/common/CreateTweetModal';
import { CreatePlaylistModal } from '@/components/common/CreatePlaylistModal';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';

export const MainLayout: React.FC = () => {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500/30">
      <Navbar />

      <div className="flex flex-1 relative">
        <Sidebar />

        <main
          className={cn(
            'flex-1 transition-all duration-300 min-w-0 px-4 sm:px-6 lg:px-8 py-6',
            sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
          )}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <CreateVideoModal />
      <CreateTweetModal />
      <CreatePlaylistModal />
    </div>
  );
};
