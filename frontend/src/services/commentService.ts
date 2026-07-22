import axiosClient from '@/api/axiosClient';
import { ApiResponse, Comment } from '@/types';

export const commentService = {
  async getVideoComments(videoId: string, page = 1, limit = 10): Promise<ApiResponse<Comment[]>> {
    const res = await axiosClient.get<ApiResponse<Comment[]>>(`/comment/${videoId}`, {
      params: { page, limit },
    });
    return res.data;
  },

  async addComment(videoId: string, content: string): Promise<ApiResponse<Comment>> {
    const res = await axiosClient.post<ApiResponse<Comment>>(`/comment/${videoId}`, { content });
    return res.data;
  },

  async updateComment(commentId: string, content: string): Promise<ApiResponse<Comment>> {
    const res = await axiosClient.patch<ApiResponse<Comment>>(`/comment/c/${commentId}`, { content });
    return res.data;
  },

  async deleteComment(commentId: string): Promise<ApiResponse<null>> {
    const res = await axiosClient.delete<ApiResponse<null>>(`/comment/c/${commentId}`);
    return res.data;
  },
};
