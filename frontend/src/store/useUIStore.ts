import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  searchQuery: string;
  isUploadModalOpen: boolean;
  isTweetModalOpen: boolean;
  isPlaylistModalOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setSearchQuery: (query: string) => void;
  setUploadModalOpen: (open: boolean) => void;
  setTweetModalOpen: (open: boolean) => void;
  setPlaylistModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'dark',
  searchQuery: '',
  isUploadModalOpen: false,
  isTweetModalOpen: false,
  isPlaylistModalOpen: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: nextTheme };
  }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setUploadModalOpen: (open) => set({ isUploadModalOpen: open }),
  setTweetModalOpen: (open) => set({ isTweetModalOpen: open }),
  setPlaylistModalOpen: (open) => set({ isPlaylistModalOpen: open }),
}));
