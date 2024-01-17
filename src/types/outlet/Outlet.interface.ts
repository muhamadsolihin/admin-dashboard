export interface OutletListRes {
  status: boolean;
  message: string;
  data?: Outlet[];
}

export interface Outlet {
  address: string;
  area_id: number;
  id: number;
  is_active: number;
  is_group_variant: number;
  is_center: number;
  name: string;
  uuid: string;
  village_name: string;
}
