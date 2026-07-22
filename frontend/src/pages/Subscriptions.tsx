import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, ExternalLink } from 'lucide-react';
import { subscriptionService } from '@/services/subscriptionService';
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar } from '@/components/ui/Avatar';
import { Subscription } from '@/types';

export const Subscriptions: React.FC = () => {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['subscribed-channels', user?._id],
    queryFn: async () => {
      if (!user?._id) return [];
      const res = await subscriptionService.getSubscribedChannels(user._id);
      return res.data || [];
    },
    enabled: !!user?._id,
  });

  const subscriptions: Subscription[] = data || [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
          <Users className="w-6 h-6 text-purple-400" />
          Subscribed Channels
        </h1>
        <p className="text-xs text-slate-400 mt-1">Channels you follow for new videos and tweets</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-900 animate-shimmer" />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-300">No subscriptions found</p>
          <p className="text-xs text-slate-500 mt-1">Explore videos and subscribe to creators!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subscriptions.map((sub) => {
            const channel = typeof sub.channel === 'object' ? sub.channel : null;
            if (!channel) return null;

            return (
              <div
                key={sub._id}
                className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between gap-3 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={channel.avatar} name={channel.fullName || channel.username} size="lg" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-100 text-sm truncate">{channel.fullName}</span>
                    <span className="text-xs text-purple-400 font-semibold truncate">@{channel.username}</span>
                  </div>
                </div>

                <Link
                  to={`/c/${channel.username}`}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
