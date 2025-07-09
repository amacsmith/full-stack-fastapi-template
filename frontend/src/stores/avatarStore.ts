import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'
export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking'

interface AvatarSettings {
  name: string
  title: string
  voice: string
  personality: string
  renderQuality: 'low' | 'medium' | 'high'
}

interface AvatarStore {
  // State
  avatarState: AvatarState
  connectionStatus: ConnectionStatus
  isSpeaking: boolean
  isListening: boolean
  currentTranscript: string
  currentResponse: string
  avatarSettings: AvatarSettings
  error: string | null

  // Actions
  setAvatarState: (state: AvatarState) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  setIsSpeaking: (speaking: boolean) => void
  setIsListening: (listening: boolean) => void
  setCurrentTranscript: (transcript: string) => void
  setCurrentResponse: (response: string) => void
  updateAvatarSettings: (settings: Partial<AvatarSettings>) => void
  setError: (error: string | null) => void
  resetState: () => void
}

const defaultSettings: AvatarSettings = {
  name: 'Digital CEO',
  title: 'Chief Executive Officer',
  voice: 'professional',
  personality: 'executive',
  renderQuality: 'high'
}

export const useAvatarStore = create<AvatarStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        avatarState: 'idle',
        connectionStatus: 'disconnected',
        isSpeaking: false,
        isListening: false,
        currentTranscript: '',
        currentResponse: '',
        avatarSettings: defaultSettings,
        error: null,

        // Actions
        setAvatarState: (state) => set({ avatarState: state }),
        setConnectionStatus: (status) => set({ connectionStatus: status }),
        setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),
        setIsListening: (listening) => set({ isListening: listening }),
        setCurrentTranscript: (transcript) => set({ currentTranscript: transcript }),
        setCurrentResponse: (response) => set({ currentResponse: response }),
        updateAvatarSettings: (settings) => 
          set((state) => ({ 
            avatarSettings: { ...state.avatarSettings, ...settings } 
          })),
        setError: (error) => set({ error }),
        resetState: () => set({
          avatarState: 'idle',
          connectionStatus: 'disconnected',
          isSpeaking: false,
          isListening: false,
          currentTranscript: '',
          currentResponse: '',
          error: null
        })
      }),
      {
        name: 'avatar-store',
        partialize: (state) => ({ avatarSettings: state.avatarSettings })
      }
    ),
    {
      name: 'AvatarStore'
    }
  )
) 