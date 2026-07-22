import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Video, Image, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useUIStore } from '@/store/useUIStore';
import { videoService } from '@/services/videoService';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const uploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(5, 'Description must be at least 5 characters').max(1000),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export const CreateVideoModal: React.FC = () => {
  const { isUploadModalOpen, setUploadModalOpen } = useUIStore();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
  });

  const onSubmit = async (data: UploadFormValues) => {
    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }
    if (!thumbnailFile) {
      toast.error('Please select a thumbnail image');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('video', videoFile);
    formData.append('thumbnail', thumbnailFile);

    try {
      const res = await videoService.publishVideo(formData);
      if (res.success) {
        toast.success('Video uploaded successfully!');
        reset();
        setVideoFile(null);
        setThumbnailFile(null);
        setUploadModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isUploadModalOpen}
      onClose={() => setUploadModalOpen(false)}
      title="Upload Video"
      description="Publish a high quality video to your channel feed"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="Video Title"
          placeholder="Give your video a catchy title..."
          error={errors.title?.message}
          {...register('title')}
        />

        <Textarea
          label="Description"
          placeholder="Tell viewers what your video is about..."
          rows={3}
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Video Upload Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Video File (.mp4, .webm)
          </label>
          <div className="relative border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950/40 flex flex-col items-center justify-center gap-2">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Video className="w-8 h-8 text-purple-400" />
            <p className="text-xs text-slate-300 font-medium">
              {videoFile ? videoFile.name : 'Click or drag video file here'}
            </p>
          </div>
        </div>

        {/* Thumbnail Upload Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Thumbnail Image (.png, .jpg)
          </label>
          <div className="relative border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950/40 flex flex-col items-center justify-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Image className="w-8 h-8 text-pink-400" />
            <p className="text-xs text-slate-300 font-medium">
              {thumbnailFile ? thumbnailFile.name : 'Click or drag thumbnail image here'}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/80">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setUploadModalOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="gradient" isLoading={isUploading}>
            Publish Video
          </Button>
        </div>
      </form>
    </Modal>
  );
};
