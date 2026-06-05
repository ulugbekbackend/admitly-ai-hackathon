import { create } from 'zustand'
import { TOKEN_KEY, REFRESH_KEY } from '@/lib/constants'

const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem(TOKEN_KEY) || null,
  refreshToken: localStorage.getItem(REFRESH_KEY) || null,
  user: null,

  setTokens: (access, refresh) => {
    localStorage.setItem(TOKEN_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
    set({ accessToken: access, refreshToken: refresh })
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    set({ accessToken: null, refreshToken: null, user: null })
  },
}))

export default useAuthStore
