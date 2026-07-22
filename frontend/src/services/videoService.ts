import axiosClient from '@/api/axiosClient';
import { ApiResponse, Video } from '@/types';

export interface GetVideosParams {
  page?: number;
  limit?: number;
  query?: string;
  sortBy?: string;
  sortType?: 'asc' | 'desc';
  userId?: string;
}

export const videoService = {
  async getAllVideos(params?: GetVideosParams): Promise<ApiResponse<Video[] | { docs: Video[]; totalPages: number }>> {
    const res = await axiosClient.get<ApiResponse<Video[] | { docs: Video[]; totalPages: number }>>('/video', { params });
    return res.data;
  },

  async getVideoById(videoId: string): Promise<ApiResponse<Video>> {
    const res = await axiosClient.get<ApiResponse<Video>>(`/video/${videoId}`);
    return res.data;
  },

  async publishVideo(formData: FormData): Promise<ApiResponse<Video>> {
    const res = await axiosClient.post<ApiResponse<Video>>('/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async updateVideo(videoId: string, formData: FormData): Promise<ApiResponse<Video>> {
    const res = await axiosClient.patch<ApiResponse<Video>>(`/video/${videoId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async deleteVideo(videoId: string): Promise<ApiResponse<null>> {
    const res = await axiosClient.delete<ApiResponse<null>>(`/video/${videoId}`);
    return res.data;
  },

  async togglePublishStatus(videoId: string): Promise<ApiResponse<Video>> {
    const res = await axiosClient.patch<ApiResponse<Video>>(`/video/toggle/publish/${videoId}`);
    return res.data;
  },
};
