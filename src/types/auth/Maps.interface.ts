import { defineStore } from 'pinia';
import axios  from 'axios';
export const useInputStore = defineStore({
  id: 'inputStore',
  state: () => ({
    inputValue: '',
    inputResult: ''
  }),
  actions: {
    async fetchResult() {
      const result = await axios.get(`https://example.com/result/${this.inputValue}`);
      this.inputResult = result.data;
    }
  }
});
