import axiosClient from '@/api/axiosClient';
import { ApiResponse, Playlist } from '@/types';

export const playlistService = {
  async createPlaylist(name: string, description: string): Promise<ApiResponse<Playlist>> {
    const res = await axiosClient.post<ApiResponse<Playlist>>('/playlist', { name, description });
    return res.data;
  },

  async getUserPlaylists(userId: string): Promise<ApiResponse<Playlist[]>> {
    const res = await axiosClient.get<ApiResponse<Playlist[]>>(`/playlist/user/${userId}`);
    return res.data;
  },

  async getPlaylistById(playlistId: string): Promise<ApiResponse<Playlist>> {
    const res = await axiosClient.get<ApiResponse<Playlist>>(`/playlist/${playlistId}`);
    return res.data;
  },

  async updatePlaylist(playlistId: string, name: string, description: string): Promise<ApiResponse<Playlist>> {
    const res = await axiosClient.patch<ApiResponse<Playlist>>(`/playlist/${playlistId}`, { name, description });
    return res.data;
  },

  async deletePlaylist(playlistId: string): Promise<ApiResponse<null>> {
    const res = await axiosClient.delete<ApiResponse<null>>(`/playlist/${playlistId}`);
    return res.data;
  },

  async addVideoToPlaylist(videoId: string, playlistId: string): Promise<ApiResponse<Playlist>> {
    const res = await axiosClient.patch<ApiResponse<Playlist>>(`/playlist/add/${videoId}/${playlistId}`);
    return res.data;
  },

  async removeVideoFromPlaylist(videoId: string, playlistId: string): Promise<ApiResponse<Playlist>> {
    const res = await axiosClient.patch<ApiResponse<Playlist>>(`/playlist/remove/${videoId}/${playlistId}`);
    return res.data;
  },
};
