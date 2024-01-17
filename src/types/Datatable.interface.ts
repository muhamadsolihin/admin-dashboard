import MetaPagination from "./MetaPagination.interface";

export interface Datatable {
  search: string;
  outlet?: number;
  cursor: string;
  perPage?: number;
  metaPagination: MetaPagination;
}
