import type { AssetFile } from '@/models/api'
import type { VideoProject, VideoProjectSummary, VideoTimeline } from '@/models/video'
import { del, get, post, put } from './http'

export interface ExportStatus {
  status: 'queued' | 'rendering' | 'done' | 'error'
  progress: number
  error?: string
}

export const videoProjectApi = {
  list: () => get<VideoProjectSummary[]>('/api/video-projects'),
  get: (id: number) => get<VideoProject>(`/api/video-projects/${id}`),
  create: (data: { title: string; width?: number; height?: number; fps?: number }) =>
    post<VideoProjectSummary>('/api/video-projects', data),
  save: (id: number, data: { title?: string; timeline?: VideoTimeline; durationSeconds?: number; width?: number; height?: number }) =>
    put<void>(`/api/video-projects/${id}`, data),
  delete: (id: number) => del(`/api/video-projects/${id}`),

  startExport: (id: number) => post<{ jobId: string }>(`/api/video-projects/${id}/export`),
  exportStatus: (id: number, jobId: string) => get<ExportStatus>(`/api/video-projects/${id}/export/${jobId}`),
  exportDownload: (id: number, jobId: string) => get<AssetFile>(`/api/video-projects/${id}/export/${jobId}/download`),
}
