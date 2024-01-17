import store from "@/store"
import http from "@/http-common"
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Customer } from "@/types/customer/Customer.interface";

/* eslint-disable */
const SERVICE_API = "/sparrow"

@Module({ name: "CustomerModule", dynamic: true, store })
export default class CustomerModule extends VuexModule {
  customers: Customer[] = [];
  customer: Customer = {} as Customer;
  metaPagination: { next_cursor: string | null, prev_cursor: string | null } = {
    next_cursor: null,
    prev_cursor: null
  };

  get getCustomers() {
    return this.customers;
  }

  get getMetaPaginationCustomer() {
    return this.metaPagination;
  }

  get getCustomer() {
    return this.customer;
  }

  @Mutation
  SET_CUSTOMERS(payload: any) {
    this.customers = payload
  }

  @Mutation
  SET_META_PAGINATION(payload: any) {
    this.metaPagination.prev_cursor = payload.prev_cursor;
    this.metaPagination.next_cursor = payload.next_cursor;
  }

  @Mutation
  SET_CUSTOMER(payload: any) {
    this.customer = payload
  }

  @Mutation
  ADD_CUSTOMER(payload: any) {
    this.customers.push(payload);
  }

  @Mutation
  UPDATE_CUSTOMER(payload: any) {
    let itemWillUpdate = this.customers.find(item => item.uuid == payload.uuid);
    itemWillUpdate = payload;
  }

  @Mutation
  REMOVE_CUSTOMER(payload: any) {
    this.customers = this.customers.filter(item => item.uuid != payload);
  }

  @Action
  getCustomersAPI(payload: any) {
    return http.get(`${SERVICE_API}/v1/?search=${payload.search}&date=${payload.date}&perpage=${payload.perPage}&cursor=${payload.cursor}`)
    .then(res => {
      if (res.data.status) {
        this.context.commit("SET_CUSTOMERS", res.data.data);
        this.context.commit("SET_META_PAGINATION", res.data.meta);
      }
    })
    .catch(err => console.log(err));
  }

  @Action
  getDetailCustomer(payload: any): Promise<any> {
    return http.get(`${SERVICE_API}/v1/hawaii/${payload}`)
    .then(res => {
      if (res.data.status) {
        this.context.commit("SET_CUSTOMER", res.data.data);
      }
      return res.data;
    })
    .catch(err => console.log(err));
  }

  @Action
  addCustomer(payload: any): Promise<any> {
    return http.post(`${SERVICE_API}/v1/california`, payload)
    .then(res => {
      if (res.data.status) {
        this.context.commit("ADD_CUSTOMER", res.data.data);
      }
      return res;
    })
    .catch(err => console.log(err));
  }

  @Action
  updateCustomer(payload: any): Promise<any> {
    return http.put(`${SERVICE_API}/v1/oklahoma/${payload.uuid}`, payload.formData)
    .then(res => {
      if (res.data.status) {
        this.context.commit("UPDATE_CUSTOMER", res.data.data);
      }
      return res;
    })
    .catch(err => console.log(err));
  }

  @Action
  removeCustomer(payload: any): Promise<any> {
    return http.delete(`${SERVICE_API}/v1/nevada/${payload}`)
    .then(res => {
      if (res.data.status) {
        this.context.commit("REMOVE_CUSTOMER", payload);
      }
      return res;
    })
    .catch(err => console.log(err));
  }
}
