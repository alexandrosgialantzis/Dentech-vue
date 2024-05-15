import { defineStore } from 'pinia'
import { userHttp } from '../services/userHttp'
import { CurrentUser, UserState } from '../types/interfaces'

export const useUserStore = defineStore('userStore', {
  state: (): UserState => ({
    user: {
      userId: null,
      fullName: null,
      email: null,
      role: null,
      cellPhone: null,
      telephone: null
    },
    sessionChecked: false,
    isLoading: false
  }),

  actions: {
    setUser(userData: CurrentUser) {
      this.user = userData
    },
    logout() {
      localStorage.clear()
      this.user = {
        userId: null,
        fullName: null,
        email: null,
        role: null,
        cellPhone: null,
        telephone: null
      }
    },
    setSessionChecked(checked: boolean) {
      this.sessionChecked = checked
    },
    async validateSession() {
      this.isLoading = true
      try {
        const response = await userHttp.get('/get-current-user')
        this.setUser(response.data.user)
      } catch (error) {
        this.logout()
      } finally {
        this.setSessionChecked(true)
        this.isLoading = false
      }
    }
  },

  getters: {
    isLoggedIn: (state) => state.user.userId !== null
  }
})
