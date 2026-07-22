import React, { useState, useEffect } from 'react';
import { Send, Heart, Trash2, Edit2, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Comment } from '@/types';
import { commentService } from '@/services/commentService';
import { likeService } from '@/services/likeService';
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatTimeAgo } from '@/lib/utils';

interface CommentSectionProps {
  videoId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ videoId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await commentService.getVideoComments(videoId);
      if (res.success) {
        setComments(res.data || []);
      }
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await commentService.addComment(videoId, newComment.trim());
      if (res.success) {
        toast.success('Comment added');
        setNewComment('');
        fetchComments();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const res = await commentService.deleteComment(commentId);
      if (res.success) {
        toast.success('Comment deleted');
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;
    try {
      const res = await commentService.updateComment(commentId, editContent.trim());
      if (res.success) {
        toast.success('Comment updated');
        setEditingCommentId(null);
        fetchComments();
      }
    } catch {
      toast.error('Failed to update comment');
    }
  };

  const handleToggleLike = async (commentId: string) => {
    try {
      await likeService.toggleCommentLike(commentId);
      setComments((prev) =>
        prev.map((c) => {
          if (c._id === commentId) {
            const nextLiked = !c.isLiked;
            return {
              ...c,
              isLiked: nextLiked,
              likesCount: nextLiked ? (c.likesCount || 0) + 1 : Math.max(0, (c.likesCount || 0) - 1),
            };
          }
          return c;
        })
      );
    } catch {
      toast.error('Failed to update like');
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-8 pt-8 border-t border-slate-800/80">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-bold text-slate-100">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="flex gap-3">
          <Avatar src={user?.avatar} name={user?.fullName || user?.username} size="md" />
          <div className="flex-1 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Add a public comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                disabled={!newComment.trim()}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Comment
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-sm text-slate-400 bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center">
          Please log in to leave a comment.
        </p>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-6">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => {
            const isOwner = user?._id === comment.owner?._id;
            const isEditing = editingCommentId === comment._id;

            return (
              <div key={comment._id} className="flex gap-3 p-3 rounded-xl hover:bg-slate-900/40 transition-colors">
                <Avatar
                  src={comment.owner?.avatar}
                  name={comment.owner?.fullName || comment.owner?.username}
                  size="md"
                />

                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">
                        {comment.owner?.fullName || comment.owner?.username}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>

                    {isOwner && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setEditContent(comment.content);
                          }}
                          className="p-1 text-slate-500 hover:text-purple-400 rounded-md"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-slate-100"
                      />
                      <Button size="sm" onClick={() => handleUpdateComment(comment._id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingCommentId(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed">{comment.content}</p>
                  )}

                  <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
                    <button
                      onClick={() => handleToggleLike(comment._id)}
                      className={`flex items-center gap-1 hover:text-rose-400 ${
                        comment.isLiked ? 'text-rose-500 font-semibold' : ''
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likesCount || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
