import axiosClient from '@/api/axiosClient';
import { ApiResponse, DashboardStats, Video } from '@/types';

export const dashboardService = {
  async getChannelStats(): Promise<ApiResponse<DashboardStats>> {
    const res = await axiosClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return res.data;
  },

  async getChannelVideos(): Promise<ApiResponse<Video[]>> {
    const res = await axiosClient.get<ApiResponse<Video[]>>('/dashboard/videos');
    return res.data;
  },
};
