import { defineStore } from "pinia";
import MetaPagination from "@/types/MetaPagination.interface";

interface State {
  search: string;
  perpage: number;
  cursor: string;
  uuid:string;
  outletId: string;
  metaPagination: MetaPagination;
}

export interface Debit {
    uuid: string;
    id: number | null;
    name: string | null;
    number: number | null;
    outlet_id?: string;
  }

export const useDebit = defineStore("debit", {
  state: (): State => {
    return {
      search: "",
      perpage: 0,
      uuid:"",
      outletId:"",
      cursor: "",
      metaPagination: {} as MetaPagination,
    };
  },
});
