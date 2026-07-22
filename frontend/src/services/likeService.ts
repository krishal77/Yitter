import axiosClient from '@/api/axiosClient';
import { ApiResponse, Video } from '@/types';

export const likeService = {
  async toggleVideoLike(videoId: string): Promise<ApiResponse<{ isLiked: boolean }>> {
    const res = await axiosClient.post<ApiResponse<{ isLiked: boolean }>>(`/likes/toggle/v/${videoId}`);
    return res.data;
  },

  async toggleCommentLike(commentId: string): Promise<ApiResponse<{ isLiked: boolean }>> {
    const res = await axiosClient.post<ApiResponse<{ isLiked: boolean }>>(`/likes/toggle/c/${commentId}`);
    return res.data;
  },

  async toggleTweetLike(tweetId: string): Promise<ApiResponse<{ isLiked: boolean }>> {
    const res = await axiosClient.post<ApiResponse<{ isLiked: boolean }>>(`/likes/toggle/t/${tweetId}`);
    return res.data;
  },

  async getLikedVideos(): Promise<ApiResponse<Video[]>> {
    const res = await axiosClient.get<ApiResponse<Video[]>>('/likes/videos');
    return res.data;
  },
};
