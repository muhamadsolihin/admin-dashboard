import { defineStore } from "pinia";
import MetaPagination from "@/types/MetaPagination.interface";

interface State {
  search: string;
  perpage: number;
  cursor: string;
  metaPagination: MetaPagination;
}

export interface TypeOrder {
    uuid: string;
    id: number;
    name: string;
    color: string;
    cant_deleted: number;
    color_substring: string;
  }

export const usetypeOrderStore = defineStore("typeorder", {
  state: (): State => {
    return {
      search: "",
      perpage: 0,
      cursor: "",
      metaPagination: {} as MetaPagination,
    };
  },
});
