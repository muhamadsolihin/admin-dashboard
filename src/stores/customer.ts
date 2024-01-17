import { defineStore } from "pinia";
import MetaPagination from "@/types/MetaPagination.interface";

interface State {
  search: string;
  date: string;
  cursor: string;
  perPage: number;
  metaPagination: MetaPagination;
}

export const useCustomerStore = defineStore("customer", {
  state: (): State => {
    return {
      search: "",
      date: "",
      perPage: 10,
      cursor: "",
      metaPagination: {} as MetaPagination,
    };
  },
});
