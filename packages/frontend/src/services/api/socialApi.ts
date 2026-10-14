import type { SocialAccount, SocialPlatform, SocialPost } from '@/models/api'
import { del, get, post } from './http'

export const socialApi = {
  platforms: () => get<SocialPlatform[]>('/api/social/platforms'),
  accounts: () => get<SocialAccount[]>('/api/social/accounts'),
  connect: (platform: string) => post<{ url: string }>(`/api/social/accounts/connect/${platform}`),
  pendingFacebookPages: (ticket: string) => get<{ id: string; name: string; loginName: string | null }[]>(`/api/social/accounts/pending/${encodeURIComponent(ticket)}`),
  selectFacebookPages: (ticket: string, pageIds: string[]) => post<SocialAccount[]>(`/api/social/accounts/pending/${encodeURIComponent(ticket)}/select`, { pageIds }),
  disconnect: (id: number) => del(`/api/social/accounts/${id}`),
  posts: () => get<SocialPost[]>('/api/social/posts'),
  createPost: (data: {
    accountId: number
    projectId?: number
    caption?: string
    mediaUrl?: string
    scheduledAt?: string
    reviewerId?: number
  }) => post<SocialPost>('/api/social/posts', data),
  submit: (id: number) => post<SocialPost>(`/api/social/posts/${id}/submit`),
  review: (id: number, approve: boolean, feedback?: string) => post<SocialPost>(`/api/social/posts/${id}/review`, { approve, feedback }),
  publish: (id: number, at?: string) => post<SocialPost>(`/api/social/posts/${id}/publish`, { at }),
  deletePost: (id: number) => del(`/api/social/posts/${id}`),
}
