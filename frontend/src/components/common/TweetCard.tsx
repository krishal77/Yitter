import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Trash2, Repeat2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tweet } from '@/types';
import { formatTimeAgo, formatCount } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { likeService } from '@/services/likeService';
import { tweetService } from '@/services/tweetService';

interface TweetCardProps {
  tweet: Tweet;
  onDelete?: (tweetId: string) => void;
}

export const TweetCard: React.FC<TweetCardProps> = ({ tweet, onDelete }) => {
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(tweet.isLiked || false);
  const [likesCount, setLikesCount] = useState(tweet.likesCount || 0);
  const [isDeleting, setIsDeleting] = useState(false);

  const owner = tweet.owner;
  const isOwner = user?._id === owner?._id;

  const handleToggleLike = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await likeService.toggleTweetLike(tweet._id);
    } catch {
      // Revert on error
      setIsLiked(!nextState);
      setLikesCount((prev) => (nextState ? Math.max(0, prev - 1) : prev + 1));
      toast.error('Failed to update like status');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tweet?')) return;
    setIsDeleting(true);
    try {
      const res = await tweetService.deleteTweet(tweet._id);
      if (res.success) {
        toast.success('Tweet deleted');
        if (onDelete) onDelete(tweet._id);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete tweet');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="p-4 rounded-2xl glass-card border border-slate-800/80 hover:border-slate-700/60 transition-all flex gap-3.5 group">
      <Link to={`/c/${owner?.username}`} className="shrink-0">
        <Avatar src={owner?.avatar} name={owner?.fullName || owner?.username} size="md" />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <Link
              to={`/c/${owner?.username}`}
              className="text-sm font-bold text-slate-100 hover:underline truncate"
            >
              {owner?.fullName || owner?.username}
            </Link>
            <span className="text-xs text-slate-500 truncate">@{owner?.username}</span>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-xs text-slate-500 whitespace-nowrap">
              {formatTimeAgo(tweet.createdAt)}
            </span>
          </div>

          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete tweet"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap break-words font-normal">
          {tweet.content}
        </p>

        {/* Action Bar */}
        <div className="flex items-center gap-6 pt-2 text-slate-500 text-xs font-semibold">
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 hover:text-rose-400 transition-colors ${
              isLiked ? 'text-rose-500' : ''
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{formatCount(likesCount)}</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin + `/c/${owner?.username}`);
              toast.success('Link copied to clipboard!');
            }}
            className="flex items-center gap-1.5 hover:text-sky-400 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </article>
  );
};
