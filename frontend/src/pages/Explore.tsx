import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Compass, Search, Flame } from 'lucide-react';
import { videoService } from '@/services/videoService';
import { VideoCard } from '@/components/common/VideoCard';
import { VideoSkeleton } from '@/components/ui/Skeleton';
import { Video } from '@/types';

export const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);

  const { data, isLoading } = useQuery({
    queryKey: ['videos', 'search', queryParam],
    queryFn: async () => {
      const res = await videoService.getAllVideos({ query: queryParam, limit: 18 });
      if (Array.isArray(res.data)) return res.data;
      return (res.data as any)?.videos || [];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const videos: Video[] = data || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Search Header */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800/80 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Explore & Search</h1>
            <p className="text-xs text-slate-400">Discover trending videos, creators, and content across Yitter</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, descriptions, tags..."
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-purple-600/20"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          {queryParam ? `Search results for "${queryParam}"` : 'Trending Content'}
        </h2>
        <span className="text-xs text-slate-500">{videos.length} videos found</span>
      </div>

      {/* Video Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-300">No results found</p>
          <p className="text-xs text-slate-500 mt-1">Try searching for different keywords or titles.</p>
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
