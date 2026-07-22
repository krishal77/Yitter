import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Eye,
  Users,
  Video as VideoIcon,
  Heart,
  Plus,
  Trash2,
  Edit,
  EyeOff,
  CheckCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { toast } from 'sonner';
import { dashboardService } from '@/services/dashboardService';
import { videoService } from '@/services/videoService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useUIStore } from '@/store/useUIStore';
import { formatCount, formatDate } from '@/lib/utils';
import { Video } from '@/types';

const chartData = [
  { name: 'Jan', views: 1200, subscribers: 40 },
  { name: 'Feb', views: 2100, subscribers: 85 },
  { name: 'Mar', views: 3800, subscribers: 190 },
  { name: 'Apr', views: 5200, subscribers: 310 },
  { name: 'May', views: 8900, subscribers: 540 },
  { name: 'Jun', views: 14200, subscribers: 920 },
];

export const Dashboard: React.FC = () => {
  const { setUploadModalOpen } = useUIStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch Dashboard Stats
  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await dashboardService.getChannelStats();
      return res.data;
    },
  });

  // Fetch Creator Videos
  const { data: videosData, refetch: refetchVideos } = useQuery({
    queryKey: ['dashboard-videos'],
    queryFn: async () => {
      const res = await dashboardService.getChannelVideos();
      return res.data || [];
    },
  });

  const handleTogglePublish = async (videoId: string) => {
    try {
      const res = await videoService.togglePublishStatus(videoId);
      if (res.success) {
        toast.success('Publish status updated');
        refetchVideos();
      }
    } catch {
      toast.error('Failed to toggle publish status');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    setDeletingId(videoId);
    try {
      const res = await videoService.deleteVideo(videoId);
      if (res.success) {
        toast.success('Video deleted successfully');
        refetchVideos();
        refetchStats();
      }
    } catch {
      toast.error('Failed to delete video');
    } finally {
      setDeletingId(null);
    }
  };

  const videos: Video[] = videosData || [];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <LayoutDashboard className="w-6 h-6 text-purple-400" />
            Creator Studio Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your videos, view channel growth analytics, and track engagement
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={() => setUploadModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Upload New Video
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl glass-card border border-purple-500/20 flex flex-col gap-2">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Views</span>
            <Eye className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-100">
            {formatCount(statsData?.totalViews || 0)}
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold">+18.4% this month</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-sky-500/20 flex flex-col gap-2">
          <div className="flex items-center justify-between text-sky-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Subscribers</span>
            <Users className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-100">
            {formatCount(statsData?.totalSubscribers || 0)}
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold">+12.1% this month</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-pink-500/20 flex flex-col gap-2">
          <div className="flex items-center justify-between text-pink-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Likes</span>
            <Heart className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-100">
            {formatCount(statsData?.totalLikes || 0)}
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold">+24.5% this month</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-amber-500/20 flex flex-col gap-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Videos Published</span>
            <VideoIcon className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-slate-100">
            {statsData?.totalVideos || videos.length}
          </span>
          <span className="text-[11px] text-slate-400 font-semibold">Active content</span>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800/80 flex flex-col gap-4">
        <h2 className="text-base font-bold text-slate-100">Channel Performance Overview</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
              />
              <Area type="monotone" dataKey="views" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Videos Management Table */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-100">Content Management</h2>

        <div className="rounded-2xl glass-card border border-slate-800/80 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Video</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No videos published yet. Upload your first video!
                  </td>
                </tr>
              ) : (
                videos.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {v.isPublished ? (
                        <Badge variant="success" size="sm">
                          <CheckCircle className="w-3 h-3" /> Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary" size="sm">
                          <EyeOff className="w-3 h-3" /> Draft
                        </Badge>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          className="w-16 h-10 object-cover rounded-lg shrink-0 border border-slate-800"
                        />
                        <span className="font-bold text-slate-100 line-clamp-1 max-w-xs">{v.title}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-300">
                      {formatCount(v.views)}
                    </td>

                    <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                      {formatDate(v.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(v._id)}
                          title={v.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {v.isPublished ? <EyeOff className="w-4 h-4" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVideo(v._id)}
                          isLoading={deletingId === v._id}
                          className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
