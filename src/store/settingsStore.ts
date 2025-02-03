import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  apiKeys: {
    replicate: string
    openai: string
  }
  ollamaEndpoint: string
  setApiKey: (provider: 'replicate' | 'openai', key: string) => void
  setOllamaEndpoint: (endpoint: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKeys: {
        replicate: '',
        openai: '',
      },
      ollamaEndpoint: 'http://localhost:11434',
      setApiKey: (provider, key) =>
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [provider]: key,
          },
        })),
      setOllamaEndpoint: (endpoint) =>
        set({ ollamaEndpoint: endpoint }),
    }),
    {
      name: 'synthai-settings',
    }
  )
)
