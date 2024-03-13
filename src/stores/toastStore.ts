import { defineStore } from 'pinia'
import { Toast } from '../types/interfaces'
import { ToastHeader } from '../types/enums'

export const useToastStore = defineStore('toastStore', {
  state: (): Toast => ({
    show: false,
    message: '',
    duration: 4000,
    header: '',
    conclusion: '',
    timeoutId: null,
    headerColor: ''
  }),
  actions: {
    showToast(message: string, header: string, conclusion?: string, duration = 4500) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = null
      }

      this.resetToast()

      this.show = true
      this.message = message
      this.header = header
      this.conclusion = conclusion
      this.duration = duration
      switch (header) {
        case ToastHeader.ERROR:
          this.headerColor = 'bg-danger'
          break
        case ToastHeader.SUCCESS:
          this.headerColor = 'bg-success'
          break
        default:
          this.headerColor = 'bg-warning'
      }

      this.timeoutId = setTimeout(() => {
        this.resetToast()
      }, duration)
    },
    resetToast() {
      this.show = false
      this.message = ''
      this.header = ''
      this.conclusion = ''
      this.headerColor = ''
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = null
      }
    }
  }
})
