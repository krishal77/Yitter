import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-purple-500/30">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-600/15 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Logo */}
      <Link to="/" className="flex items-center gap-2.5 mb-8 group z-10">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/30 group-hover:scale-105 transition-transform">
          <Flame className="w-6 h-6 fill-current" />
        </div>
        <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-purple-400 via-indigo-200 to-pink-400 bg-clip-text text-transparent">
          Yitter
        </span>
      </Link>

      {/* Content Container */}
      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-800/80 shadow-2xl z-10 relative">
        <Outlet />
      </div>

      <footer className="mt-8 text-xs text-slate-500 z-10">
        © 2026 Yitter. YouTube + Twitter Hybrid Platform.
      </footer>
    </div>
  );
};
