import { create } from 'zustand'

export type VideoLeftPanel = 'uploads' | 'text'

interface VideoEditorUiState {
  leftPanel: VideoLeftPanel
  setLeftPanel: (panel: VideoLeftPanel) => void
  pixelsPerSecond: number
  setPixelsPerSecond: (v: number) => void
  /** Which track new clips from the media library land on. Set by clicking a track's label. */
  activeTrackId: string | null
  setActiveTrack: (id: string | null) => void
}

export const useVideoEditorUiStore = create<VideoEditorUiState>((set) => ({
  leftPanel: 'uploads',
  setLeftPanel: (panel) => set({ leftPanel: panel }),
  pixelsPerSecond: 60,
  setPixelsPerSecond: (v) => set({ pixelsPerSecond: Math.max(10, Math.min(300, v)) }),
  activeTrackId: null,
  setActiveTrack: (id) => set({ activeTrackId: id }),
}))
