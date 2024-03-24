import { DoctorState, User, UsersResponse } from './../types/interfaces'
import { defineStore } from 'pinia'
import { userHttp } from '../services/userHttp'
import { Roles } from '../types/enums'

export const useDoctorStore = defineStore('doctorStore', {
  state: (): DoctorState => ({
    docs: null,
    loading: false,
    isFetched: false,
    error: false
  }),

  actions: {
    async fetchDoctors() {
      this.loading = true
      try {
        const res = await userHttp.get<UsersResponse<User>>(
          `/get-users?searchString=${Roles.DENTIST}`
        )
        this.docs = res.data.users
        this.isFetched = true
      } catch (e) {
        this.error = true
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    getDocs: (state) => state.docs
  }
})
