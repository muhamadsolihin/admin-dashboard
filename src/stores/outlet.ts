import { defineStore } from "pinia";
import http from "@/http-common";
import { Datatable } from "@/types/Datatable.interface";
import { Outlet } from "@/types/outlet/Outlet.interface";

interface State extends Datatable {
  outlets: Outlet[];
}

export const useOutletStore = defineStore("outlet", {
  state: (): State => {
    return {
      outlets: [],
      search: "",
      cursor: "",
      perPage: 10,
      metaPagination: {
        prev_cursor: "",
        next_cursor: "",
      },
    };
  },
  getters: {
    outletsForFilter: (state) => {
      let selectedOutlets: Outlet[] = [];
      selectedOutlets = Object.assign([], state.outlets);

      if (selectedOutlets.findIndex((e) => e.id === 0) == -1) {
        selectedOutlets.unshift({
          id: 0,
          address: "",
          name: "Pilih Outlet",
          area_id: 0,
          is_active: 1,
          is_group_variant: 0,
          is_center: 0,
          uuid: "",
          village_name: "",
        });
      }

      return selectedOutlets.filter((item) => item.is_active == 1);
    },
    activeOutlet: (state) => {
      return state.outlets.filter((outlet) => outlet.is_active != 0);
    },
  },
  actions: {
    async getOutlets(payload: {
      search: string;
      cursor: string;
      perPage: string;
    }) {
      try {
        const response = await http.get(
          `/crow/v1/?perpage=${payload.perPage}&search=${payload.search}&cursor=${payload.cursor}`
        );
        const res = response.data;
        if (res.status) {
          this.outlets = res.data;
        }
        return response.data;
      } catch (error) {
        return error;
      }
    },
  },
});
