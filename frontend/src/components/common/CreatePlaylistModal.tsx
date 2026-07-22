import React, { useState } from 'react';
import { ListVideo } from 'lucide-react';
import { toast } from 'sonner';
import { useUIStore } from '@/store/useUIStore';
import { playlistService } from '@/services/playlistService';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

export const CreatePlaylistModal: React.FC = () => {
  const { isPlaylistModalOpen, setPlaylistModalOpen } = useUIStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Playlist name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await playlistService.createPlaylist(name.trim(), description.trim());
      if (res.success) {
        toast.success('Playlist created successfully!');
        setName('');
        setDescription('');
        setPlaylistModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create playlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isPlaylistModalOpen}
      onClose={() => setPlaylistModalOpen(false)}
      title="New Playlist"
      description="Organize your favorite videos into a curated collection"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Playlist Name"
          placeholder="e.g. Web Development Tutorials"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Textarea
          label="Description"
          placeholder="What is this playlist about?"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800/80">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setPlaylistModalOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<ListVideo className="w-4 h-4" />}
          >
            Create Playlist
          </Button>
        </div>
      </form>
    </Modal>
  );
};
