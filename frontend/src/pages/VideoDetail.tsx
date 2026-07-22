import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, Share2, Eye, UserPlus, UserCheck, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { videoService } from '@/services/videoService';
import { likeService } from '@/services/likeService';
import { subscriptionService } from '@/services/subscriptionService';
import { Video } from '@/types';
import { formatCount, formatTimeAgo, formatDate } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { CommentSection } from '@/components/common/CommentSection';
import { VideoCard } from '@/components/common/VideoCard';
import { VideoSkeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/useAuthStore';

export const VideoDetail: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { isAuthenticated, user } = useAuthStore();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch video details
  const { data: video, isLoading, error } = useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => {
      if (!videoId) return null;
      const res = await videoService.getVideoById(videoId);
      return res.data;
    },
    enabled: !!videoId,
  });

  // Fetch suggested videos
  const { data: suggestedData } = useQuery({
    queryKey: ['suggested-videos', videoId],
    queryFn: async () => {
      const res = await videoService.getAllVideos({ limit: 6 });
      if (Array.isArray(res.data)) return res.data.filter((v) => v._id !== videoId);
      return ((res.data as any)?.videos || []).filter((v: any) => v._id !== videoId);
    },
    enabled: !!videoId,
  });

  const ownerObj = typeof video?.owner === 'object' ? video.owner : null;
  const isOwner = user?._id === ownerObj?._id;

  const handleToggleLike = async () => {
    if (!videoId) return;
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await likeService.toggleVideoLike(videoId);
    } catch {
      setIsLiked(!nextState);
      setLikesCount((prev) => (nextState ? Math.max(0, prev - 1) : prev + 1));
      toast.error('Failed to update video like');
    }
  };

  const handleToggleSubscribe = async () => {
    if (!ownerObj?._id) return;
    const nextState = !isSubscribed;
    setIsSubscribed(nextState);

    try {
      await subscriptionService.toggleSubscription(ownerObj._id);
      toast.success(nextState ? `Subscribed to ${ownerObj.fullName}` : 'Unsubscribed');
    } catch {
      setIsSubscribed(!nextState);
      toast.error('Failed to update subscription');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Video link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="w-full aspect-video bg-slate-900 rounded-2xl animate-shimmer" />
          <div className="h-6 w-3/4 bg-slate-800 rounded-md animate-shimmer" />
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-16 glass-card rounded-2xl">
        <p className="text-base font-semibold text-slate-300">Video not found</p>
        <Link to="/" className="text-purple-400 text-sm hover:underline mt-2 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Video Column */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        {/* Player */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl relative">
          <video
            src={video.videoFile}
            poster={video.thumbnail}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        </div>

        {/* Video Title */}
        <h1 className="text-xl font-extrabold text-slate-100 leading-snug">{video.title}</h1>

        {/* Channel & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-800/80">
          {/* Creator Info */}
          {ownerObj && (
            <div className="flex items-center gap-3">
              <Link to={`/c/${ownerObj.username}`}>
                <Avatar src={ownerObj.avatar} name={ownerObj.fullName || ownerObj.username} size="lg" />
              </Link>
              <div className="flex flex-col">
                <Link
                  to={`/c/${ownerObj.username}`}
                  className="text-sm font-bold text-slate-100 hover:text-purple-400 transition-colors"
                >
                  {ownerObj.fullName || ownerObj.username}
                </Link>
                <span className="text-xs text-slate-400">
                  {formatCount(ownerObj.subscribersCount || 0)} subscribers
                </span>
              </div>

              {!isOwner && isAuthenticated && (
                <Button
                  variant={isSubscribed ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={handleToggleSubscribe}
                  leftIcon={isSubscribed ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  className="ml-3"
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </Button>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={isLiked ? 'secondary' : 'ghost'}
              size="sm"
              onClick={handleToggleLike}
              leftIcon={<Heart className={`w-4 h-4 ${isLiked ? 'text-rose-500 fill-current' : ''}`} />}
              className={isLiked ? 'text-rose-400 border-rose-500/30' : ''}
            >
              {formatCount(likesCount)} Likes
            </Button>

            <Button variant="ghost" size="sm" onClick={handleShare} leftIcon={<Share2 className="w-4 h-4" />}>
              Share
            </Button>
          </div>
        </div>

        {/* Description Box */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              {formatCount(video.views)} views
            </span>
            <span>•</span>
            <span>{formatDate(video.createdAt)}</span>
          </div>

          <p
            className={`text-xs text-slate-300 leading-relaxed whitespace-pre-wrap ${
              showFullDescription ? '' : 'line-clamp-3'
            }`}
          >
            {video.description || 'No description provided.'}
          </p>

          {video.description && video.description.length > 150 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-xs font-bold text-purple-400 hover:underline self-start flex items-center gap-1 mt-1"
            >
              {showFullDescription ? (
                <>
                  Show Less <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  Show More <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Comments */}
        <CommentSection videoId={video._id} />
      </div>

      {/* Suggested Videos Column */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-slate-200">Suggested Videos</h2>
        <div className="flex flex-col gap-4">
          {(suggestedData || []).map((v: Video) => (
            <VideoCard key={v._id} video={v} horizontal />
          ))}
        </div>
      </div>
    </div>
  );
};
