import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    secondary: 'bg-slate-800 text-slate-300 border border-slate-700/50',
    outline: 'border border-slate-700 text-slate-400',
    success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    danger: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold rounded-md',
    md: 'text-xs px-2.5 py-1 font-medium rounded-lg',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 shrink-0 transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
