import store from '@/store';
import http from '@/http-common';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

/* eslint-disable */
export interface Debit {
  uuid: string;
  id: number | null;
  name: string | null;
  number: number | null;
  outlet_id?: string;
}

@Module({ name: 'DebitModule', dynamic: true, store })
export default class DebitModule extends VuexModule {
  debits: Debit[] = [
    {
      uuid: '',
      id: null,
      name: null,
      number: null,
    },
  ];
  debit: Debit = {
    uuid: '',
    id: null,
    name: null,
    number: null,
  };
  metaPagination: { next_cursor: string | null; prev_cursor: string | null } = {
    next_cursor: null,
    prev_cursor: null,
  };

  get getLists() {
    return this.debits;
  }

  get getMetaPaginationDebit() {
    return this.metaPagination;
  }

  get getDebit() {
    return this.debit;
  }

  @Mutation
  SET_LISTS(payload: any) {
    this.debits = payload;
  }

  @Mutation
  SET_META_PAGINATION(payload: any) {
    this.metaPagination.prev_cursor = payload.prev_cursor;
    this.metaPagination.next_cursor = payload.next_cursor;
  }

  @Mutation
  SET_DEBIT(payload: any) {
    this.debit = payload;
  }

  @Mutation
  ADD_DEBIT(payload: any) {
    this.debits.push(payload);
  }

  @Mutation
  UPDATE_DEBIT(payload: any) {
    let itemWillUpdate = this.debits.find(item => item.uuid == payload.uuid);
    itemWillUpdate = payload;
  }

  @Mutation
  REMOVE_DEBIT(payload: any) {
    this.debits = this.debits.filter(item => item.uuid != payload.uuid);
  }

  @Action
  getListDebit(payload: any) {
    return http
      .get(
        `/parrot/v1/edc-machine/index?search=${payload.search}&perpage=${payload.perPage}&cursor=${payload.cursor}&outlet_id=${payload.outletId}`
      )
      .then(res => {
        if (res.data.status) {
          this.context.commit('SET_LISTS', res.data.data);
          this.context.commit('SET_META_PAGINATION', res.data.meta);
        }
      })
      .catch(err => console.log(err));
  }

  @Action
  getDetailDebit(payload: any): Promise<any> {
    return http
      .get(
        `/parrot/v1/edc-machine/hawaii/${payload.uuid}?outlet_id=${payload.outletId}`
      )
      .then(res => {
        if (res.data.status) {
          this.context.commit('SET_DEBIT', res.data.data);
        }
        return res.data;
      })
      .catch(err => console.log(err));
  }

  @Action
  addDebit(payload: any): Promise<any> {
    return http
      .post('/parrot/v1/edc-machine/california', payload)
      .then(res => {
        if (res.data.status) {
          this.context.commit('ADD_DEBIT', res.data.data);
        }
        return res;
      })
      .catch(err => console.log(err));
  }

  @Action
  updateDebit(payload: any): Promise<any> {
    return http
      .put(
        `/parrot/v1/edc-machine/oklahoma/${payload.uuid}?name=${payload.name}&number=${payload.number}&outlet_id=${payload.outletId}`
      )
      .then(res => {
        if (res.data.status) {
          this.context.commit('UPDATE_DEBIT', res.data.data);
        }
        return res;
      })
      .catch(err => console.log(err));
  }

  @Action
  removeDebit(payload: any): Promise<any> {
    return http
      .delete(
        `/parrot/v1/edc-machine/nevada/${payload.uuid}?outlet_id=${payload.outletId}`
      )
      .then(res => {
        if (res.data.status) {
          this.context.commit('REMOVE_DEBIT', payload);
        }
        return res;
      })
      .catch(err => console.log(err));
  }
}
