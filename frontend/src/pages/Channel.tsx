import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { UserPlus, UserCheck, Video as VideoIcon, MessageSquare, ListVideo, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { videoService } from '@/services/videoService';
import { tweetService } from '@/services/tweetService';
import { playlistService } from '@/services/playlistService';
import { subscriptionService } from '@/services/subscriptionService';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { VideoCard } from '@/components/common/VideoCard';
import { TweetCard } from '@/components/common/TweetCard';
import { formatCount } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { Video, Tweet, Playlist } from '@/types';

export const Channel: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('videos');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch Channel User Profile
  const { data: channel, isLoading: isChannelLoading } = useQuery({
    queryKey: ['channel', username],
    queryFn: async () => {
      if (!username) return null;
      const res = await authService.getChannelProfile(username);
      if (res.data) {
        setIsSubscribed(res.data.isSubscribed || false);
      }
      return res.data;
    },
    enabled: !!username,
  });

  const isOwner = currentUser?.username === channel?.username;

  // Fetch Channel Videos
  const { data: channelVideos } = useQuery({
    queryKey: ['channel-videos', channel?._id],
    queryFn: async () => {
      if (!channel?._id) return [];
      const res = await videoService.getAllVideos({ userId: channel._id });
      if (Array.isArray(res.data)) return res.data;
      return (res.data as any)?.videos || [];
    },
    enabled: !!channel?._id,
  });

  // Fetch Channel Tweets
  const { data: channelTweets } = useQuery({
    queryKey: ['channel-tweets', channel?._id],
    queryFn: async () => {
      if (!channel?._id) return [];
      const res = await tweetService.getUserTweets(channel._id);
      return res.data || [];
    },
    enabled: !!channel?._id,
  });

  // Fetch Channel Playlists
  const { data: channelPlaylists } = useQuery({
    queryKey: ['channel-playlists', channel?._id],
    queryFn: async () => {
      if (!channel?._id) return [];
      const res = await playlistService.getUserPlaylists(channel._id);
      return res.data || [];
    },
    enabled: !!channel?._id,
  });

  const handleToggleSubscribe = async () => {
    if (!channel?._id) return;
    const nextState = !isSubscribed;
    setIsSubscribed(nextState);
    try {
      await subscriptionService.toggleSubscription(channel._id);
      toast.success(nextState ? `Subscribed to ${channel.fullName}` : 'Unsubscribed');
    } catch {
      setIsSubscribed(!nextState);
      toast.error('Failed to update subscription');
    }
  };

  const tabs = [
    { id: 'videos', label: 'Videos', icon: <VideoIcon className="w-4 h-4" />, count: (channelVideos || []).length },
    { id: 'tweets', label: 'Tweets', icon: <MessageSquare className="w-4 h-4" />, count: (channelTweets || []).length },
    { id: 'playlists', label: 'Playlists', icon: <ListVideo className="w-4 h-4" />, count: (channelPlaylists || []).length },
  ];

  if (isChannelLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="w-full h-48 rounded-2xl bg-slate-900 animate-shimmer" />
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 rounded-full bg-slate-800 animate-shimmer" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-6 w-48 bg-slate-800 rounded animate-shimmer" />
            <div className="h-4 w-24 bg-slate-800 rounded animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="text-center py-16 glass-card rounded-2xl">
        <p className="text-base font-semibold text-slate-300">Channel not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Cover Image Banner */}
      <div className="relative w-full h-44 sm:h-56 rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border border-slate-800 shadow-xl">
        {channel.coverImage ? (
          <img src={channel.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full opacity-30 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px]" />
        )}
      </div>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 px-4 z-10">
        <div className="flex items-end gap-4">
          <Avatar
            src={channel.avatar}
            name={channel.fullName || channel.username}
            size="2xl"
            className="ring-4 ring-slate-950 shadow-2xl"
          />
          <div className="flex flex-col mb-1">
            <h1 className="text-2xl font-extrabold text-slate-100">{channel.fullName}</h1>
            <p className="text-sm font-semibold text-purple-400">@{channel.username}</p>
            <p className="text-xs text-slate-400 mt-1">
              <span className="font-bold text-slate-200">{formatCount(channel.subscribersCount || 0)}</span> Subscribers •{' '}
              <span className="font-bold text-slate-200">{formatCount(channel.channelsSubscribedToCount || 0)}</span> Subscribed
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="self-end sm:self-auto mb-1">
          {isOwner ? (
            <Link to="/settings">
              <Button variant="outline" size="sm" leftIcon={<Settings className="w-4 h-4" />}>
                Edit Channel
              </Button>
            </Link>
          ) : (
            isAuthenticated && (
              <Button
                variant={isSubscribed ? 'secondary' : 'primary'}
                size="md"
                onClick={handleToggleSubscribe}
                leftIcon={isSubscribed ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mt-4" />

      {/* Tab Panels */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(channelVideos || []).length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center col-span-full">No videos published yet.</p>
          ) : (
            (channelVideos || []).map((v: Video) => <VideoCard key={v._id} video={v} />)
          )}
        </div>
      )}

      {activeTab === 'tweets' && (
        <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
          {(channelTweets || []).length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No tweets posted yet.</p>
          ) : (
            (channelTweets || []).map((t: Tweet) => <TweetCard key={t._id} tweet={t} />)
          )}
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(channelPlaylists || []).length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center col-span-full">No playlists created yet.</p>
          ) : (
            (channelPlaylists || []).map((p: Playlist) => (
              <div key={p._id} className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col gap-2">
                <h3 className="font-bold text-slate-100">{p.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                <span className="text-xs text-purple-400 font-semibold mt-2">{p.videos?.length || 0} Videos</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
