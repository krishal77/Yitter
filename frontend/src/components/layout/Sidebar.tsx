import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Compass,
  Tv,
  History,
  ThumbsUp,
  ListVideo,
  LayoutDashboard,
  Settings,
  Flame,
  MessageSquare,
  Users,
} from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useUIStore();
  const { isAuthenticated } = useAuthStore();

  const mainNav = [
    { label: 'Home Feed', icon: Home, path: '/' },
    { label: 'Explore', icon: Compass, path: '/explore' },
    { label: 'Subscriptions', icon: Users, path: '/subscriptions', authRequired: true },
  ];

  const libraryNav = [
    { label: 'Watch History', icon: History, path: '/history', authRequired: true },
    { label: 'Liked Videos', icon: ThumbsUp, path: '/liked-videos', authRequired: true },
    { label: 'Playlists', icon: ListVideo, path: '/playlists', authRequired: true },
  ];

  const studioNav = [
    { label: 'Creator Studio', icon: LayoutDashboard, path: '/dashboard', authRequired: true },
    { label: 'Settings', icon: Settings, path: '/settings', authRequired: true },
  ];

  return (
    <aside
      className={cn(
        'fixed top-14 left-0 bottom-0 z-30 bg-slate-950/90 border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between overflow-y-auto no-scrollbar glass',
        sidebarOpen ? 'w-60 px-3 py-4' : 'w-16 px-2 py-4'
      )}
    >
      <div className="flex flex-col gap-6">
        {/* Main Section */}
        <div className="flex flex-col gap-1">
          {mainNav.map((item) => {
            if (item.authRequired && !isAuthenticated) return null;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 group',
                    isActive
                      ? 'bg-purple-600/15 text-purple-400 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  )
                }
              >
                <item.icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Library Section */}
        {isAuthenticated && (
          <div className="flex flex-col gap-1 border-t border-slate-800/60 pt-4">
            {sidebarOpen && (
              <span className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                Library
              </span>
            )}
            {libraryNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 group',
                    isActive
                      ? 'bg-purple-600/15 text-purple-400 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  )
                }
              >
                <item.icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        )}

        {/* Studio Section */}
        {isAuthenticated && (
          <div className="flex flex-col gap-1 border-t border-slate-800/60 pt-4">
            {sidebarOpen && (
              <span className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                Creator & Account
              </span>
            )}
            {studioNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 group',
                    isActive
                      ? 'bg-purple-600/15 text-purple-400 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  )
                }
              >
                <item.icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* Footer Branding */}
      {sidebarOpen && (
        <div className="px-3 pt-6 border-t border-slate-800/60 text-[11px] text-slate-500 flex flex-col gap-1">
          <p>© 2026 Yitter Platform</p>
          <p className="text-[10px] text-slate-600">YouTube + Twitter Hybrid</p>
        </div>
      )}
    </aside>
  );
};
