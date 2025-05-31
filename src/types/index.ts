 // User types
export interface User {
  _id: string;
  username: string;
}

// Authentication types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
}

// Content types
export type ContentType = 'text' | 'tweet' | 'video' | 'document' | 'link';

export interface Tag {
  _id: string;
  title: string;
}

export interface TweetMetadata {
  author_name: string;
  author_url: string;
  html: string;
  provider_name: string;
  provider_url: string;
  cache_age: string;
  tweet_url: string;
}

export interface VideoMetadata {
  html: string;
  title: string;
  author_name: string;
  author_url: string;
  provider_name: string;
  provider_url: string;
  thumbnail_url: string;
  video_url: string;
}

export interface Content {
  _id: string;
  title: string;
  body?: string;
  link?: string;
  type: ContentType;
  tweetMetadata?: TweetMetadata;
  videoMetadata?: VideoMetadata;
  tags: Tag[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentFormData {
  title: string;
  body?: string;
  link?: string;
  type: ContentType;
  tags: string[];
}

// Share types
export interface ShareLink {
  _id: string;
  hash: string;
  userId: string;
  createdAt: string;
}

// Search types
export interface SearchQuery {
  query: string;
  type?: ContentType;
  tags?: string[];
}
