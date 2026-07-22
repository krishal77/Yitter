import axiosClient from '@/api/axiosClient';
import { ApiResponse, User, Subscription } from '@/types';

export const subscriptionService = {
  async toggleSubscription(channelId: string): Promise<ApiResponse<{ isSubscribed: boolean }>> {
    const res = await axiosClient.post<ApiResponse<{ isSubscribed: boolean }>>(`/subscriptions/c/${channelId}`);
    return res.data;
  },

  async getSubscribedChannels(channelId: string): Promise<ApiResponse<Subscription[]>> {
    const res = await axiosClient.get<ApiResponse<Subscription[]>>(`/subscriptions/c/${channelId}`);
    return res.data;
  },

  async getUserChannelSubscribers(subscriberId: string): Promise<ApiResponse<User[]>> {
    const res = await axiosClient.get<ApiResponse<User[]>>(`/subscriptions/u/${subscriberId}`);
    return res.data;
  },
};
