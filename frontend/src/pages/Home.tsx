import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Video as VideoIcon, MessageSquare, TrendingUp } from 'lucide-react';
import { videoService } from '@/services/videoService';
import { tweetService } from '@/services/tweetService';
import { Video, Tweet } from '@/types';
import { VideoCard } from '@/components/common/VideoCard';
import { TweetCard } from '@/components/common/TweetCard';
import { Tabs } from '@/components/ui/Tabs';
import { VideoSkeleton, TweetSkeleton } from '@/components/ui/Skeleton';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { setTweetModalOpen, setUploadModalOpen } = useUIStore();
  const { isAuthenticated, user } = useAuthStore();

  const { data: videosData, isLoading: isVideosLoading } = useQuery({
    queryKey: ['videos', 'home'],
    queryFn: async () => {
      const res = await videoService.getAllVideos({ limit: 12 });
      if (Array.isArray(res.data)) return res.data;
      return (res.data as any)?.videos || [];
    },
  });

  const { data: tweetsData, isLoading: isTweetsLoading } = useQuery({
    queryKey: ['tweets', 'home'],
    queryFn: async () => {
      if (!user?._id) return [];
      const res = await tweetService.getUserTweets(user._id);
      return res.data || [];
    },
    enabled: !!user?._id,
  });

  const tabs = [
    { id: 'all', label: 'All Feed', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'videos', label: 'Videos', icon: <VideoIcon className="w-4 h-4" /> },
    { id: 'tweets', label: 'Tweets', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const videos: Video[] = videosData || [];
  const tweets: Tweet[] = tweetsData || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Quick Action Hero Banner for Auth Users */}
      {isAuthenticated && (
        <div className="p-5 rounded-2xl glass-card border border-purple-500/20 bg-gradient-to-r from-purple-900/30 via-slate-900/50 to-pink-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
              ✨
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Welcome back, {user?.fullName}!</h2>
              <p className="text-xs text-slate-400">Share your latest video or post a quick tweet.</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setTweetModalOpen(true)}>
              Post Tweet
            </Button>
            <Button variant="gradient" size="sm" onClick={() => setUploadModalOpen(true)}>
              Upload Video
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Feed Content */}
      {activeTab === 'all' && (
        <div className="flex flex-col gap-8">
          {/* Latest Videos Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <VideoIcon className="w-5 h-5 text-purple-400" />
                Latest Videos
              </h2>
            </div>

            {isVideosLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <VideoSkeleton key={i} />
                ))}
              </div>
            ) : videos.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No videos uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}
          </section>

          {/* Tweets Feed */}
          {isAuthenticated && (
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-sky-400" />
                Recent Tweets
              </h2>

              {isTweetsLoading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2].map((i) => (
                    <TweetSkeleton key={i} />
                  ))}
                </div>
              ) : tweets.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No tweets yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {tweets.map((tweet) => (
                    <TweetCard key={tweet._id} tweet={tweet} />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isVideosLoading ? (
            [1, 2, 3, 4, 5, 6].map((i) => <VideoSkeleton key={i} />)
          ) : videos.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center col-span-full">No videos found.</p>
          ) : (
            videos.map((video) => <VideoCard key={video._id} video={video} />)
          )}
        </div>
      )}

      {activeTab === 'tweets' && (
        <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
          {isTweetsLoading ? (
            [1, 2, 3].map((i) => <TweetSkeleton key={i} />)
          ) : tweets.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No tweets found.</p>
          ) : (
            tweets.map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
          )}
        </div>
      )}
    </div>
  );
};
