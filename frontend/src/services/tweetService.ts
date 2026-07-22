import axiosClient from '@/api/axiosClient';
import { ApiResponse, Tweet } from '@/types';

export const tweetService = {
  async createTweet(content: string): Promise<ApiResponse<Tweet>> {
    const res = await axiosClient.post<ApiResponse<Tweet>>('/tweet', { content });
    return res.data;
  },

  async getUserTweets(userId: string): Promise<ApiResponse<Tweet[]>> {
    const res = await axiosClient.get<ApiResponse<Tweet[]>>(`/tweet/user/${userId}`);
    return res.data;
  },

  async updateTweet(tweetId: string, content: string): Promise<ApiResponse<Tweet>> {
    const res = await axiosClient.patch<ApiResponse<Tweet>>(`/tweet/${tweetId}`, { content });
    return res.data;
  },

  async deleteTweet(tweetId: string): Promise<ApiResponse<null>> {
    const res = await axiosClient.delete<ApiResponse<null>>(`/tweet/${tweetId}`);
    return res.data;
  },
};
