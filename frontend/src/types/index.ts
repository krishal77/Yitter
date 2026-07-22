export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  watchHistory?: string[] | Video[];
  subscribersCount?: number;
  channelsSubscribedToCount?: number;
  isSubscribed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Video {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: User | string;
  likesCount?: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tweet {
  _id: string;
  content: string;
  owner: User;
  likesCount?: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  video: string;
  owner: User;
  likesCount?: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  _id: string;
  video?: string;
  comment?: string;
  tweet?: string;
  likedBy: User | string;
  createdAt: string;
}

export interface Subscription {
  _id: string;
  subscriber: User | string;
  channel: User | string;
  createdAt: string;
}

export interface Playlist {
  _id: string;
  name: string;
  description: string;
  videos: Video[];
  owner: User | string;
  totalVideos?: number;
  totalViews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalViews: number;
  totalSubscribers: number;
  totalVideos: number;
  totalLikes: number;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
