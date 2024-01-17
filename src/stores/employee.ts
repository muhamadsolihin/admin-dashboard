import { defineStore } from "pinia";
import MetaPagination from "@/types/MetaPagination.interface";
import { Action } from "vuex-module-decorators";
import http from "@/http-common";
interface State {
  search: string;
  outletId: string;
  cursor: string;
  perPage: number;
  metaPagination: MetaPagination;
}

export const useEmployeeStore = defineStore("employee", {
  state: (): State => {
    return {
      search: "",
      outletId: "",
      perPage: 10,
      cursor: "",
      metaPagination: {} as MetaPagination,
    };
  },
  actions: {
    async updateStatusEmployee(payload: {
      uuid: any;
      formData: any;
    }): Promise<any> {
      return http.post(
        `/owl/v1/user-access/oklahoma/active/${payload.uuid}`,
        payload.formData
      );
    },
  },
});
