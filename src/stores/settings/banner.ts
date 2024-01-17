import { defineStore } from "pinia";
import { Datatable } from "@/types/Datatable.interface";

export const useBannerStore = defineStore("banner", {
  state: (): Datatable => {
    return {
      search: "",
      outlet: 0,
      cursor: "",
      perPage: 10,
      metaPagination: {
        next_cursor: "",
        prev_cursor: "",
      },
    };
  },
});
