import { create } from 'zustand';
import { Video } from '@/types';

interface PlayerState {
  currentVideo: Video | null;
  isPlaying: boolean;
  isMinimized: boolean;
  setCurrentVideo: (video: Video | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setMinimized: (minimized: boolean) => void;
  closePlayer: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentVideo: null,
  isPlaying: false,
  isMinimized: false,
  setCurrentVideo: (video) => set({ currentVideo: video, isPlaying: true, isMinimized: false }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setMinimized: (minimized) => set({ isMinimized: minimized }),
  closePlayer: () => set({ currentVideo: null, isPlaying: false, isMinimized: false }),
}));
