import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, MoreVertical, Clock, Eye, Share2, ListPlus } from 'lucide-react';
import { Video } from '@/types';
import { formatCount, formatDuration, formatTimeAgo } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

interface VideoCardProps {
  video: Video;
  horizontal?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, horizontal = false }) => {
  const navigate = useNavigate();
  const ownerObj = typeof video.owner === 'object' ? video.owner : null;
  const ownerName = ownerObj?.fullName || ownerObj?.username || 'Channel';
  const ownerAvatar = ownerObj?.avatar;
  const ownerUsername = ownerObj?.username || '';

  return (
    <div
      className={horizontal ? 'flex flex-col sm:flex-row gap-4 group' : 'flex flex-col gap-3 group'}
    >
      {/* Thumbnail Container */}
      <div
        onClick={() => navigate(`/video/${video._id}`)}
        className={
          horizontal
            ? 'relative aspect-video w-full sm:w-64 rounded-xl overflow-hidden bg-slate-900 shrink-0 cursor-pointer border border-slate-800/80 group-hover:border-purple-500/50 transition-all'
            : 'relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 cursor-pointer border border-slate-800/80 group-hover:border-purple-500/50 transition-all shadow-md group-hover:shadow-purple-500/10'
        }
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg shadow-purple-600/50 transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Duration Badge */}
        {video.duration > 0 && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-slate-100 rounded-md border border-slate-700/50 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="flex gap-3 flex-1">
        {!horizontal && ownerObj && (
          <Link to={`/c/${ownerUsername}`} className="shrink-0 pt-0.5">
            <Avatar src={ownerAvatar} name={ownerName} size="md" />
          </Link>
        )}

        <div className="flex flex-col flex-1 min-w-0">
          <h3
            onClick={() => navigate(`/video/${video._id}`)}
            className="text-sm font-bold text-slate-100 line-clamp-2 cursor-pointer hover:text-purple-400 transition-colors leading-snug"
          >
            {video.title}
          </h3>

          {ownerObj && (
            <Link
              to={`/c/${ownerUsername}`}
              className="text-xs text-slate-400 hover:text-slate-200 mt-1 flex items-center gap-1.5 font-medium truncate"
            >
              <span>{ownerName}</span>
            </Link>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-500" />
              {formatCount(video.views)} views
            </span>
            <span>•</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
          </div>

          {horizontal && video.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
