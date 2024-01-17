import { defineStore } from "pinia";
import MetaPagination from '@/types/MetaPagination.interface';

interface State {
  search: string,
  outlet: number,
  cursor: string,
  metaPagination: MetaPagination;
}

export const useDiscountStore = defineStore("discount", {
  state: (): State => {
    return {
      search: '',
      outlet: 0,
      cursor: '',
      metaPagination: {} as MetaPagination
    };
  }
});
