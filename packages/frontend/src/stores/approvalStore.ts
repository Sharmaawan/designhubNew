import { create } from 'zustand'
import { approvalApi, type ApprovalState } from '@/services/api/approvalApi'

interface ApprovalStore {
  approval: ApprovalState | null
  loading: boolean
  error: string | null
  load: (projectId: number) => Promise<void>
  set: (a: ApprovalState) => void
  reset: () => void
}

export const useApprovalStore = create<ApprovalStore>((set) => ({
  approval: null,
  loading: false,
  error: null,
  load: async (projectId) => {
    set({ loading: true, error: null })
    try {
      set({ approval: await approvalApi.status(projectId), loading: false })
    } catch (error) {
      set({ approval: null, loading: false, error: error instanceof Error ? error.message : 'Could not load approval status.' })
      throw error
    }
  },
  set: (approval) => set({ approval, loading: false, error: null }),
  reset: () => set({ approval: null, loading: false, error: null }),
}))
