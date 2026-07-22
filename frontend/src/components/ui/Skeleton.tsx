import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-shimmer bg-slate-800/60 rounded-xl', className)}
      {...props}
    />
  );
}

export function VideoSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full aspect-video rounded-2xl" />
      <div className="flex gap-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function TweetSkeleton() {
  return (
    <div className="p-4 rounded-2xl glass-card flex gap-3.5">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <div className="flex gap-6 pt-2">
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
        </div>
      </div>
    </div>
  );
}
