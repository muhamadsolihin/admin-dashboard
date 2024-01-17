import store from '@/store';
import http from '@/http-common';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

/* eslint-disable */
export interface Employee {
  uuid: string;
  signature_id: number | null;
  name: string | null;
  image: string | null;
  user_type: number | null;
  is_active: boolean;
}

@Module({ name: 'EmployeeModule', dynamic: true, store })
export default class EmployeeModule extends VuexModule {
  employees: Employee[] = [];
  employee: Employee = {} as Employee;
  metaPagination: { next_cursor: string | null; prev_cursor: string | null } = {
    next_cursor: null,
    prev_cursor: null,
  };

  get getEmployees() {
    return this.employees;
  }

  get getMetaPaginationEmployee() {
    return this.metaPagination;
  }

  get getEmployee() {
    return this.employee;
  }

  @Mutation
  SET_EMPLOYEES(payload: any) {
    this.employees = payload;
  }

  @Mutation
  SET_META_PAGINATION(payload: { prev_cursor: string | null; next_cursor: string | null; }) {
    this.metaPagination.prev_cursor = payload.prev_cursor;
    this.metaPagination.next_cursor = payload.next_cursor;
  }

  @Mutation
  SET_EMPLOYEE(payload: any) {
    this.employee = payload;
  }

  @Mutation
  ADD_EMPLOYEE(payload: any) {
    this.employees.push(payload);
  }

  @Mutation
  UPDATE_EMPLOYEE(payload: any) {
    let itemWillUpdate = this.employees.find(item => item.uuid == payload.uuid);
    itemWillUpdate = payload;
  }

  @Mutation
  UPDATE_STATUS_EMPLOYEE(payload: any) {
    const index = this.employees.findIndex(e => e.uuid == payload.uuid);
    if (index != -1) {
      this.employees[index].is_active = payload.is_active;
    }
  }

  @Mutation
  REMOVE_EMPLOYEE(payload: any) {
    this.employees = this.employees.filter(item => item.uuid != payload);
  }

  @Action
  getEmployeesAPI(payload: any) {
    return http
      .get(
        `/vulture/v1/?search=${payload.search}&perpage=${payload.perPage}&outlet_id=${payload.outletId}&cursor=${payload.cursor}`
      )
      .then(res => {
        if (res.data.status) {
          this.context.commit('SET_EMPLOYEES', res.data.data);
          this.context.commit('SET_META_PAGINATION', res.data.meta);
        }
      })
      .catch(err => console.log(err));
  }

  @Action
  getDetailEmployee(payload: any): Promise<any> {
    return http
      .get(`/vulture/v1/hawaii/${payload}`)
      .then(res => {
        if (res.data.status) {
          this.context.commit('SET_EMPLOYEE', res.data.data);
        }
        return res.data;
      })
      .catch(err => console.log(err));
  }

  @Action
  addEmployee(formData: any): Promise<any> {
    return http
      .post('/vulture/v1/california', formData)
      .then(res => {
        if (res.data.status) {
          this.context.commit('ADD_EMPLOYEE', res.data.data);
        }
        console.log(formData)
        return res;
      })
      .catch(err => console.log(err));
  }

  @Action
  updateEmployee(payload: { uuid: any; formData: any; }): Promise<any> {
    return http
      .put(`/vulture/v1/oklahoma/${payload.uuid}`, payload.formData)
      .then(res => {
        if (res.data.status) {
          this.context.commit('UPDATE_EMPLOYEE', res.data.data);
        }
        return res.data;
      })
      .catch(err => console.log(err));
  }

  @Action
  updateStatusEmployee(payload: { uuid: any; formData: any; }): Promise<any> {
    return http
      .post(
        `/owl/v1/user-access/oklahoma/active/${payload.uuid}`,
        payload.formData
      )
      .then(res => {
        if (res.data.status) {
          this.context.commit('UPDATE_STATUS_EMPLOYEE', res.data.data);
        }
        return res.data;
      })
      .catch(err => console.log(err));
  }

  @Action
  removeEmployee(payload: any): Promise<any> {
    return http
      .delete(`/vulture/v1/nevada/${payload}`)
      .then(res => {
        if (res.data.status) {
          this.context.commit('REMOVE_EMPLOYEE', payload);
        }
        return res;
      })
      .catch(err => console.log(err));
  }
}
