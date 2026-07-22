import axiosClient from '@/api/axiosClient';
import { ApiResponse, User } from '@/types';

export const authService = {
  async register(formData: FormData): Promise<ApiResponse<User>> {
    const res = await axiosClient.post<ApiResponse<User>>('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async login(credentials: { email?: string; username?: string; password: string }): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> {
    const res = await axiosClient.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>('/users/login', credentials);
    return res.data;
  },

  async logout(): Promise<ApiResponse<null>> {
    const res = await axiosClient.post<ApiResponse<null>>('/users/logout');
    return res.data;
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const res = await axiosClient.get<ApiResponse<User>>('/users/current-user');
    return res.data;
  },

  async changePassword(data: { oldPassword: string; newPassword: string }): Promise<ApiResponse<null>> {
    const res = await axiosClient.post<ApiResponse<null>>('/users/changePassword', data);
    return res.data;
  },

  async updateAccount(data: { fullName: string; email: string }): Promise<ApiResponse<User>> {
    const res = await axiosClient.patch<ApiResponse<User>>('/users/update-account', data);
    return res.data;
  },

  async updateAvatar(formData: FormData): Promise<ApiResponse<User>> {
    const res = await axiosClient.patch<ApiResponse<User>>('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async updateCoverImage(formData: FormData): Promise<ApiResponse<User>> {
    const res = await axiosClient.patch<ApiResponse<User>>('/users/cover-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async getChannelProfile(username: string): Promise<ApiResponse<User>> {
    const res = await axiosClient.get<ApiResponse<User>>(`/users/c/${username}`);
    return res.data;
  },

  async getWatchHistory(): Promise<ApiResponse<Video[]>> {
    const res = await axiosClient.get<ApiResponse<Video[]>>('/users/history');
    return res.data;
  },
};
