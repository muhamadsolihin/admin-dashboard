import store from "@/store";
import http from "@/http-common";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

/* eslint-disable */
export interface Wallet {
  uuid: string;
  id: number | null;
  name: string | null;
  number: number | null;
  outlet_id?: string;
}

@Module({ name: "WalletModule", dynamic: true, store })
export default class WalletModule extends VuexModule {
  wallets: Wallet[] = [
    {
      uuid: "",
      id: null,
      name: null,
      number: null,
    },
  ];
  wallet: Wallet = {
    uuid: "",
    id: null,
    name: null,
    number: null,
  };
  metaPagination: { next_cursor: string | null; prev_cursor: string | null } = {
    next_cursor: null,
    prev_cursor: null,
  };

  get getterLists() {
    return this.wallets;
  }

  get getterMetaPaginationWallet() {
    return this.metaPagination;
  }

  get getterDetail() {
    return this.wallet;
  }

  @Mutation
  SET_LISTS(payload: any) {
    this.wallets = payload;
  }

  @Mutation
  SET_META_PAGINATION(payload: any) {
    this.metaPagination.prev_cursor = payload.prev_cursor;
    this.metaPagination.next_cursor = payload.next_cursor;
  }

  @Mutation
  SET_DETAIL(payload: any) {
    this.wallet = payload;
  }

  @Mutation
  ADD_WALLET(payload: any) {
    this.wallets.push(payload);
  }

  @Mutation
  UPDATE_WALLET(payload: any) {
    let itemWillUpdate = this.wallets.find((item) => item.uuid == payload.uuid);
    itemWillUpdate = payload;
  }

  @Mutation
  REMOVE_WALLET(payload: any) {
    this.wallets = this.wallets.filter((item) => item.uuid != payload.uuid);
  }

  @Action
  getListWallet(payload: any) {
    return http
      .get(
        `/parrot/v1/e-wallet/index?search=${payload.search}&perpage=${payload.perPage}&cursor=${payload.cursor}&outlet_id=${payload.outletId}`
      )
      .then((res) => {
        if (res.data.status) {
          this.context.commit("SET_LISTS", res.data.data);
          this.context.commit("SET_META_PAGINATION", res.data.meta);
        }
      })
      .catch((err) => console.log(err));
  }

  @Action
  getDetail(payload: any): Promise<any> {
    return http
      .get(
        `/parrot/v1/e-wallet/hawaii/${payload.uuid}?outlet_id=${payload.outletId}`
      )
      .then((res) => {
        if (res.data.status) {
          this.context.commit("SET_DETAIL", res.data.data);
        }
        return res.data;
      })
      .catch((err) => console.log(err));
  }

  @Action
  addWallet(payload: any): Promise<any> {
    return http
      .post("/parrot/v1/e-wallet/california", payload)
      .then((res) => {
        if (res.data.status) {
          this.context.commit("ADD_WALLET", res.data.data);
        }
        return res;
      })
      .catch((err) => console.log(err));
  }

  @Action
  updateWallet(payload: any): Promise<any> {
    console.log(payload.outletId);
    return http
      .put(
        `/parrot/v1/e-wallet/oklahoma/${payload.uuid}?name=${payload.name}&number=${payload.number}&outlet_id=${payload.outletId}`
      )
      .then((res) => {
        if (res.data.status) {
          this.context.commit("UPDATE_WALLET", res.data.data);
        }
        return res;
      })
      .catch((err) => console.log(err));
  }

  @Action
  removeWallet(payload: any): Promise<any> {
    return http
      .delete(
        `/parrot/v1/e-wallet/nevada/${payload.uuid}?outlet_id=${payload.outletId}`
      )
      .then((res) => {
        if (res.data.status) {
          this.context.commit("REMOVE_WALLET", payload);
        }
        return res;
      })
      .catch((err) => console.log(err));
  }
}
