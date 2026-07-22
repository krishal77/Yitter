import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Video,
  MessageSquarePlus,
  Sun,
  Moon,
  Menu,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Settings,
  Flame,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const {
    toggleSidebar,
    theme,
    toggleTheme,
    setUploadModalOpen,
    setTweetModalOpen,
  } = useUIStore();

  const [search, setSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Section: Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded-xl transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-400 via-indigo-200 to-pink-400 bg-clip-text text-transparent">
                Yitter
              </span>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-lg items-center relative"
        >
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos, tweets, or channels..."
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-purple-500/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </form>

        {/* Right Section: Actions + Theme + Profile */}
        <div className="flex items-center gap-2.5">
          {/* Create Button Dropdown */}
          {isAuthenticated && (
            <div className="relative">
              <Button
                variant="gradient"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setIsCreateOpen(!isCreateOpen)}
              >
                <span className="hidden sm:inline">Create</span>
              </Button>

              {isCreateOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 glass"
                  onMouseLeave={() => setIsCreateOpen(false)}
                >
                  <button
                    onClick={() => {
                      setIsCreateOpen(false);
                      setUploadModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                  >
                    <Video className="w-4 h-4 text-purple-400" />
                    <span>Upload Video</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCreateOpen(false);
                      setTweetModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                  >
                    <MessageSquarePlus className="w-4 h-4 text-sky-400" />
                    <span>Post a Tweet</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded-xl transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Authentication State */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-purple-500/50 transition-all"
              >
                <Avatar src={user.avatar} name={user.fullName || user.username} size="md" />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 glass"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-800/80">
                    <p className="text-sm font-bold text-slate-100 truncate">{user.fullName}</p>
                    <p className="text-xs text-slate-400 truncate">@{user.username}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to={`/c/${user.username}`}
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-purple-400" />
                      <span>Your Channel</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-pink-400" />
                      <span>Creator Studio</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-800/80 pt-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
