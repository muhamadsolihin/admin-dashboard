import store from "@/store"
import http from "@/http-common"
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

/* eslint-disable */
export interface Banner {
  id: number
  uuid: string
  name: string
  description: string
  image: string
  url: string
}

const CORE_URL = "/parrot/v1/banner/"

@Module({ name: "BannerModule", dynamic: true, store })
export default class BannerModule extends VuexModule {
  banners: Banner[] = []
  banner: Banner = {} as Banner;
  metaPagination: { next_cursor: string | null, prev_cursor: string | null } = {
    next_cursor: null,
    prev_cursor: null
  };

  get getterLists() {
    return this.banners;
  }

  get getterMetaPaginationBanner() {
    return this.metaPagination;
  }

  get getterDetail() {
    return this.banner;
  }

  @Mutation
  SET_LISTS(payload: any) {
    this.banners = payload
  }

  @Mutation
  SET_META_PAGINATION(payload: any) {
    this.metaPagination.prev_cursor = payload.prev_cursor;
    this.metaPagination.next_cursor = payload.next_cursor;
  }

  @Mutation
  SET_DETAIL(payload: any) {
    this.banner = payload
  }

  @Mutation
  ADD_BANNER(payload: any) {
    this.banners.push(payload);
  }

  @Mutation
  UPDATE_BANNER(payload: any) {
    let itemWillUpdate = this.banners.find(item => item.uuid == payload.uuid);
    itemWillUpdate = payload;
  }

  @Mutation
  REMOVE_BANNER(payload: any) {
    this.banners = this.banners.filter(item => item.uuid != payload.uuid);
  }

  @Action
  getListBanner(payload: any) {
    return http.get(`${CORE_URL}index?search=${payload.search}&perpage=${payload.perPage}&cursor=${payload.cursor}&outlet_id=${payload.outletId}`)
    .then(res => {
      if (res.data.status) {
        this.context.commit("SET_LISTS", res.data.data);
        this.context.commit("SET_META_PAGINATION", res.data.meta);
      }
    })
    .catch(err => console.log(err));
  }

  @Action
  getDetail(payload: any): Promise<any> {
    return http.get(`${CORE_URL}hawaii/${payload.uuid}?outlet_id=${payload.outletId}`)
    .then(res => {
      if (res.data.status) {
        this.context.commit("SET_DETAIL", res.data.data);
      }
      return res.data;
    })
    .catch(err => console.log(err));
  }

  @Action
  addBanner(payload: any): Promise<any> {
    return http.post(`${CORE_URL}california`, payload)
    .then(res => {
      if (res.data.status) {
        this.context.commit("ADD_BANNER", res.data.data);
      }
      return res.data;
    })
    .catch(err => console.log(err));
  }

  @Action
  updateBanner(payload: any): Promise<any> {
    return http.post(`${CORE_URL}oklahoma/${payload.get('uuid')}`, payload)
    .then(res => {
      if (res.data.status) {
        this.context.commit("UPDATE_BANNER", res.data.data);
      }
      return res;
    })
    .catch(err => console.log(err));
  }

  @Action
  removeBanner(payload: any): Promise<any> {
    return http.delete(`${CORE_URL}nevada/${payload.uuid}?outlet_id=${payload.outletId}`)
    .then(res => {
      if (res.data.status) {
        this.context.commit("REMOVE_BANNER", payload);
      }
      return res.data;
    })
    .catch(err => console.log(err));
  }
}
