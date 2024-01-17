import store from "@/store";
import http from "@/http-common";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

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

@Module({ name: "OutletModule", dynamic: true, store })
export default class OutletModule extends VuexModule {
  outlets: Outlet[] = [];
  outlet: Outlet = {} as Outlet;
  metaPagination: { next_cursor: string | null; prev_cursor: string | null } = {
    next_cursor: null,
    prev_cursor: null,
    
  };

  
  get getFilterOutlets() {
    let newObject: any[] = [];
    newObject = Object.assign([], this.outlets);

    if (newObject.findIndex(e => e.id === '') == -1) {
      newObject.unshift({
        id: '',
        address: '',
        name: 'Pilih Toko',
        area_id: 0,
        is_active: 1,
        is_group_variant: '',
        is_center: 0,
        uuid: '',
        village_name: '',
      });
    }

    return newObject.filter(item => item.is_active == 1);
  }

  get getFilterOutlet() {
    let newObject: any[] = [];
    newObject = Object.assign([], this.outlets);

    if (newObject.findIndex(e => e.id === '') == -1) {
      newObject.unshift({
        id: '',
        name: 'Semua Toko',
        address: '',
        area_id: 0,
        is_active: 1,
        is_group_variant: '',
        is_center: 0,
        uuid: '',
        village_name: '',
      });
    }

    return newObject.filter(item => item.is_active == 1);
  }

  get getOutlets() {
    return this.outlets;
  }

  get getMetaPaginationToko() {
    return this.metaPagination;
  }

  get getOutlet() {
    return this.outlet;
  }

  @Mutation
  SET_OUTLETS(payload: any) {
    this.outlets = payload;
  }
  
  @Mutation
  REMOVE_OUTLET(payload : any) {
    this.outlets = this.outlets.filter(item => item.uuid != payload);
  }
  @Mutation
  UPDATE_OUTLET(payload:any) {
    let itemWillUpdate = this.outlets.find(item => item.uuid == payload.uuid);
    itemWillUpdate = payload;
  }

  @Mutation
  ADD_OUTLET(payload: any) {
    this.outlets.push(payload);
  }
  @Mutation
  SET_OUTLET(payload: any) {
    this.outlet = payload;
  }

  @Mutation
  SET_META_PAGINATION(payload: any) {
    this.metaPagination.prev_cursor = payload.prev_cursor;
    this.metaPagination.next_cursor = payload.next_cursor;
  }

  @Action
  getOutletsAPI(payload?: any): Promise<OutletListRes> {
    return http
      .get(
        `/crow/v1/?perpage=10&search=${payload.search}&cursor=${payload.cursor}`
      )
      .then((res) => {
        if (res.data.status) {
          this.context.commit("SET_OUTLETS", res.data.data);
          this.context.commit("SET_META_PAGINATION", res.data.meta);
        }
        return res.data;
      })
      .catch((err) => console.log(err));
  }

  @Action
  getDetailOutlet(payload: any): Promise<any> {
    return http
      .get(`/crow/v1/hawaii/${payload}`)
      .then(res => {
        if (res.data.status) {
          this.context.commit('SET_OUTLET', res.data.data);
        }
        return res.data;
      })
      .catch(err => console.log(err));
  }
  @Action
  updateStatusActive(payload: {
    uuid: string;
    formData: { status: number };
  }): Promise<any> {
    return http
      .post(`/crow/v1/oklahoma/status/active/${payload.uuid}`, payload.formData)
      .then((res) => {
        if (res.data.status) {
          this.context.commit("UPDATE_STATUS_ACTIVE", res.data.data);
        }
        return res;
      })
      .catch((err) => console.log(err));
  }

  @Action
  addOutlet(payload: any): Promise<any> {
    return http
      .post("/crow/v1/california", payload)
      .then((res) => {
        if (res.data.status) {
          this.context.commit("ADD_OUTLET", res.data.data);
        }
        return res;
      })
      .catch((err) => console.log(err));
  }

  @Action
  UpdateOutlets(payload:any): Promise<any> {
    return http
      .post(`/crow/v1/oklahoma/${payload.uuid}`, payload.formData)
      .then(res => {
        if (res.data.status) {
          this.context.commit('UPDATE_OUTLET', res.data.data);
        }
        return res.data;
      })
      .catch(err => console.log(err));
  }


  @Action
  removeToko(payload: any): Promise<any> {
    return http
      .delete(`/crow/v1/nevada/${payload}`)
      .then(res => {
        if (res.data.status) {
          this.context.commit('REMOVE_OUTLET', payload);
        }
        return res;
      })
      .catch(err => console.log(err));
  }
}
