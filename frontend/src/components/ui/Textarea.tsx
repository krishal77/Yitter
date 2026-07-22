import React, { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            'w-full bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm p-3.5 transition-all duration-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 resize-y',
            error && 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
