import { defineStore } from 'pinia'

export const useResponseStore = defineStore('response', {
  state: () => ({
    status: null, // initial status is null
    data: null // initial data is null
  }),
  actions: {
    setResponse(status: null, data: null) {
      this.status = status
      this.data = data
    }
  }
})