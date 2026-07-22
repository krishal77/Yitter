import React from 'react';
import { cn } from '@/lib/utils';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-6 transition-all duration-200 border border-slate-800/80',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
