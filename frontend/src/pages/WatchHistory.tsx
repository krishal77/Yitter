import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, Trash2 } from 'lucide-react';
import { authService } from '@/services/authService';
import { VideoCard } from '@/components/common/VideoCard';
import { VideoSkeleton } from '@/components/ui/Skeleton';
import { Video } from '@/types';

export const WatchHistory: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['watch-history'],
    queryFn: async () => {
      const res = await authService.getWatchHistory();
      return res.data || [];
    },
  });

  const videos: Video[] = data || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <History className="w-6 h-6 text-purple-400" />
            Watch History
          </h1>
          <p className="text-xs text-slate-400 mt-1">Videos you have recently watched</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-300">Your watch history is empty</p>
          <p className="text-xs text-slate-500 mt-1">Videos you watch will show up here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};
