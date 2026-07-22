import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useAuthStore } from '@/store/useAuthStore';

// Pages
import { Home } from '@/pages/Home';
import { Explore } from '@/pages/Explore';
import { VideoDetail } from '@/pages/VideoDetail';
import { Channel } from '@/pages/Channel';
import { Dashboard } from '@/pages/Dashboard';
import { WatchHistory } from '@/pages/WatchHistory';
import { LikedVideos } from '@/pages/LikedVideos';
import { Playlists } from '@/pages/Playlists';
import { Subscriptions } from '@/pages/Subscriptions';
import { Settings } from '@/pages/Settings';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-purple-400">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Main Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/search" element={<Explore />} />
        <Route path="/video/:videoId" element={<VideoDetail />} />
        <Route path="/c/:username" element={<Channel />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <WatchHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/liked-videos"
          element={
            <ProtectedRoute>
              <LikedVideos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <Playlists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <Subscriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
