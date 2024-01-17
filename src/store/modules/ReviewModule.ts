import store from '@/store';
import httpClient from '@/http-common';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

export const CORE_URL = '/penguin';

export interface Reviewed {
    id: number;
    uuid: string;
    name: string;
    outlet_id: number;
    product_image: string;
    product_uuid: string;
    files: File[];
    review: string;
    star: number;
    trx_id: string;
    unix_time: number;
    user_customer_id: number;
  }
  
  export interface File {
    name: string;
    url: string;
  }

  
@Module({ name: 'ReviewModule', dynamic: true, store })
export default class ReviewModule extends VuexModule {
  reviews: Reviewed[] = [];
  metaPagination: { next_cursor: string | null; prev_cursor: string | null } = {
    next_cursor: null,
    prev_cursor: null,
  };

  get getterReviews(): Reviewed[] {
    return this.reviews;
  }

  get getterMetaPagination() {
    return this.metaPagination;
  }

  @Mutation
  SET_REVIEWS(payload: any) {
    this.reviews = payload;
  }

  @Mutation
  SET_META_PAGINATION(payload: any) {
    this.metaPagination = payload;
  }

  @Action
  getReviewedProduct(payload: {
    perPage: number;
    search: string;
    outletId: string;
    cursor: string;
  }): Promise<any> {
    return httpClient
      .get(
        `${CORE_URL}/v1/dash-reviewed?perpage=${payload.perPage}&search=${payload.search}&outlet_id=${payload.outletId}&cursor=${payload.cursor}`
      )
      .then(res => {
        const { data, status, meta } = res.data;
        const { next_cursor, prev_cursor } = meta;
        if (status) {
          this.context.commit('SET_REVIEWS', data);
          this.context.commit('SET_META_PAGINATION', {
            next_cursor,
            prev_cursor,
          });
        }
        return { data, status };
      })
      .catch(err => err);
  }
}
