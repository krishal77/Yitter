import React, { useState } from 'react';
import { MessageSquarePlus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useUIStore } from '@/store/useUIStore';
import { tweetService } from '@/services/tweetService';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

export const CreateTweetModal: React.FC = () => {
  const { isTweetModalOpen, setTweetModalOpen } = useUIStore();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Tweet content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await tweetService.createTweet(content.trim());
      if (res.success) {
        toast.success('Tweet posted successfully!');
        setContent('');
        setTweetModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to post tweet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isTweetModalOpen}
      onClose={() => setTweetModalOpen(false)}
      title="Create Tweet"
      description="Share your thoughts, updates, or code snippets with your followers"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Textarea
          placeholder="What's happening?"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
        />

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-500 font-medium">
            {280 - content.length} characters remaining
          </span>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setTweetModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              isLoading={isSubmitting}
              leftIcon={<MessageSquarePlus className="w-4 h-4" />}
            >
              Post Tweet
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
