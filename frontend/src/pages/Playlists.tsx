import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ListVideo, Plus } from 'lucide-react';
import { playlistService } from '@/services/playlistService';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { Button } from '@/components/ui/Button';
import { Playlist } from '@/types';

export const Playlists: React.FC = () => {
  const { user } = useAuthStore();
  const { setPlaylistModalOpen } = useUIStore();

  const { data, isLoading } = useQuery({
    queryKey: ['playlists', user?._id],
    queryFn: async () => {
      if (!user?._id) return [];
      const res = await playlistService.getUserPlaylists(user._id);
      return res.data || [];
    },
    enabled: !!user?._id,
  });

  const playlists: Playlist[] = data || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <ListVideo className="w-6 h-6 text-indigo-400" />
            Your Playlists
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage your video collections</p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          onClick={() => setPlaylistModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Playlist
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-900 animate-shimmer" />
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <ListVideo className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-300">No playlists created yet</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">Organize your videos into collections.</p>
          <Button variant="primary" size="sm" onClick={() => setPlaylistModalOpen(true)}>
            Create Playlist Now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between gap-4 hover:border-purple-500/50 transition-all"
            >
              <div>
                <h3 className="font-bold text-slate-100 text-base">{playlist.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{playlist.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <span className="font-semibold text-purple-400">{playlist.videos?.length || 0} Videos</span>
                <span className="text-slate-500">Public</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
