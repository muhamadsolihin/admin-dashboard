import store from "@/store";
import http from "@/http-common";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

export interface TypeOrderRes {
  status: boolean;
  message: string;
  data?: TypeOrder[];
}

export interface TypeOrder {
  uuid: string;
  id: number;
  name: string;
  color: string;
  cant_deleted: number;
  color_substring: string;
}

export interface TypeOrderPrice {
  id: number;
  label: string;
  price: string;
  cant_deleted: number;
}

@Module({ name: "TypeOrderModule", dynamic: true, store })
export default class TypeOrderModule extends VuexModule {
  typeOrders: TypeOrder[] = [];
  typeOrder: TypeOrder = {} as TypeOrder;
  /* eslint-disable */
  metaPagination: { next_cursor: string | null; prev_cursor: string | null } = {
    next_cursor: null,
    prev_cursor: null,
  };

  get getTypeOrders() {
    return this.typeOrders;
  }

  get getMetaPagination() {
    return this.metaPagination;
  }

  get getTypeOrder() {
    return this.typeOrder;
  }

  @Mutation
  SET_TYPE_ORDERS(payload: any) {
    this.typeOrders = payload;
  }

  @Mutation
  SET_META_PAGINATION(payload: any) {
    this.metaPagination.prev_cursor = payload.prev_cursor;
    this.metaPagination.next_cursor = payload.next_cursor;
  }

  @Mutation
  SET_TYPE_ORDER(payload: any) {
    this.typeOrder = payload;
  }

  @Mutation
  ADD_TYPE_ORDER(payload: any) {
    this.typeOrders.push(payload);
  }

  @Mutation
  UPDATE_TYPE_ORDER(payload:any) {
    let itemWillUpdate = this.typeOrders.find(
      (item) => item.uuid == payload.uuid
    );
    itemWillUpdate = payload;
  }

  @Mutation
  REMOVE_TYPE_ORDER(payload:any) {
    this.typeOrders = this.typeOrders.filter(
      (item) => item.uuid != payload.uuid
    );
  }

  @Action
  getTypeOrdersAPI(payload: { perPage: any; cursor: any; search: any }) {
    return http
      .get(
        `/falcon/v1/type_order/index?perpage=${payload.perPage}&cursor=${payload.cursor}&search=${payload.search}`
      )
      .then((res) => {
        if (res.data.status) {
          this.context.commit("SET_TYPE_ORDERS", res.data.data);
          this.context.commit("SET_META_PAGINATION", res.data.meta);
        }
      })
      .catch((err) => console.log(err));
  }

  @Action
  getTypeOrdersForAddProduct(payload: string): Promise<TypeOrderRes> {
    return http
      .get(`/falcon/v1/type_order/?search=${payload.search}`)
      .then((res) => {
        if (res.data.status) {
          this.context.commit("SET_TYPE_ORDERS", res.data.data);
        }
        return res.data;
      });
  }

  @Action
  getDetailTypeOrder(payload: any) {
    return http
      .get(`/falcon/v1/type_order/hawaii/${payload}`)
      .then((res) => {
        if (res.data.status) {
          this.context.commit("SET_TYPE_ORDER", res.data.data);
        }
      })
      .catch((err) => console.log(err));
  }

  @Action
  addTypeOrder(payload: any): Promise<any> {
    return http
      .post("/falcon/v1/type_order/california", payload)
      .then((res) => {
        if (res.data.status) {
          this.context.commit("ADD_TYPE_ORDER", res.data.data);
        }
        return res;
      })
      .catch((err) => console.log(err));
  }

  @Action
  updateTypeOrder(payload: {
    typeOrderColor: string | number | boolean;
    uuid: any;
    typeOrderName: any;
  }): Promise<any> {
    const encoded = encodeURIComponent(payload.typeOrderColor);
    return http
      .put(
        `/falcon/v1/type_order/oklahoma/${payload.uuid}?name=${payload.typeOrderName}&color=${encoded}`
      )
      .then((res) => {
        if (res.data.status) {
          this.context.commit("UPDATE_TYPE_ORDER", res.data.data);
        }
        return res;
      })
      .catch((err) => console.log(err));
  }

  @Action
  removeTypeOrder(payload: { uuid: any }): Promise<any> {
    return http
      .delete(`/falcon/v1/type_order/nevada/${payload.uuid}`)
      .then((res) => {
        if (res.data.status) {
          this.context.commit("REMOVE_TYPE_ORDER", payload);
        }
        return res;
      })
      .catch((err) => console.log(err));
  }
}
