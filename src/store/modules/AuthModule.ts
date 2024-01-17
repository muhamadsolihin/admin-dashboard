import store from "@/store";
import http from "@/http-common";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { UserAccess, UserAccessRes } from "@/types/auth/UserAccess.interface";
import type { HistoryInvoice } from "@/types/auth/HistoryInvoice.interface";
import type { MetaPaginationNum } from "@/types/MetaPaginationNum.interface";
import type {
  BankAccount,
  BankAccountRes,
} from "@/types/auth/BankAccount.interface";
import { BankListRes } from "@/types/auth/Bank.interface";

/* eslint-disable */
export interface UserMe {
  uuid: string;
  signature_id: string | null;
  user_name: string | null;
  outlet_name: string | null;
  outlet_description: string | null;
  image: string | null;
  user_type: number;
  user_type_name: string | null;
  user_village_name: string | null;
  user_village_id: number | null;
  address: string | null;
  phone: string | number | null;
  account_phone: string | null;
  account_email: string | null;
  email: string | null;
  outlet_category: number | null;
  outlet_category_name: string | null;
  outlet_type: number | null;
  outlet_type_name: string | null;
  outlet_village_id: number | null;
  outlet_village_name: string | null;
  outlet_uuid: string | null;
  outlet_id: number | null;
  is_active_recap_cash: number /* boolean -> 0 or 1 */;
  auth_use: number;
  verified: number /* boolean -> 0 or 1 */;
  is_waiting_verified: number /* boolean -> 0 or 1 */;
  latitude: string | null;
  longitude: string | null;
  url_online_order: string | null;
  subscription: {
    expired_date: string | null;
    id: number | null;
    name: string | null;
  };
  balance_xendit: number;
  active_online_order: number;
}

@Module({ name: "AuthModule", dynamic: true, store })
export default class AuthModule extends VuexModule {
  me: UserMe = {} as UserMe;
  userAccess: UserAccess[] = [];
  errorPinStatus: boolean = false;
  historyInvoices: HistoryInvoice[] = [];
  metaPaginationInvoice: MetaPaginationNum = {} as MetaPaginationNum;
  bankAccount: BankAccount = {} as BankAccount;

  modalOutlet: boolean = false;

  get getModalOutlet() {
    return this.modalOutlet;
  }

  get getMe() {
    return this.me;
  }

  get getUserAccess(): UserAccess[] {
    return this.userAccess;
  }

  get getUserAccessByCode() {
    const userAccesses = this.userAccess;
    return function (code: string): UserAccess {
      const index = userAccesses.findIndex((e) => e.code == code);
      if (index != -1) {
        return userAccesses[index];
      } else {
        return {} as UserAccess;
      }
    };
  }

  get getOutletId() {
    return this.me.outlet_id
      ? this.me.outlet_id
      : window.sessionStorage.getItem("UNIQ_ID");
  }

  get getErrorPinStatus() {
    return this.errorPinStatus;
  }

  get getHistoryInvoices(): HistoryInvoice[] {
    return this.historyInvoices;
  }

  get getMetaPaginationHistoryInvoice(): MetaPaginationNum {
    return this.metaPaginationInvoice;
  }

  get getUserBankAccount(): BankAccount {
    return this.bankAccount;
  }

  @Mutation
  SET_ME(payload: any) {
    this.me = payload;
  }

  @Mutation
  SET_USER_ACCESS(payload: any) {
    this.userAccess = payload;
  }

  @Mutation
  SET_MODAL_OUTLET(payload: any) {
    this.modalOutlet = payload;
  }

  @Mutation
  UPDATE_PHOTO_PROFILE(payload: any) {
    this.me.image = payload;
  }

  @Mutation
  SET_ERROR_PIN_STATUS(payload: any) {
    this.errorPinStatus = payload;
  }

  @Mutation
  SET_HISTORY_INVOICES(payload: HistoryInvoice[]) {
    this.historyInvoices = payload;
  }

  @Mutation
  SET_META_PAGINATION_HISTORY_INVOICE(payload: MetaPaginationNum) {
    this.metaPaginationInvoice = payload;
  }

  @Mutation
  SET_BANK_ACCOUNT(payload: BankAccount) {
    this.bankAccount = payload;
  }

  @Action
  getUserMe(): Promise<any> {
    return http.get("/owl/v1/me").then((res) => {
      if (res.data.status) {
        this.context.commit("SET_ME", res.data.data);
      }
      return res.data;
    });
  }

  @Action
  updateProfile(payload: any): Promise<any> {
    return http.post("/owl/v1/profile", payload).then((res) => {
      if (res.data.status) {
        this.context.commit("SET_ME", res.data.data);
      }
      return res.data;
    });
  }

  @Action
  updatePhotoProfile(payload: any): Promise<any> {
    return http.post("/owl/v1/oklahoma/outlet/photo", payload).then((res) => {
      if (res.data.status) {
        this.context.commit("UPDATE_PHOTO_PROFILE", res.data.data.image);
      }
      return res.data;
    });
  }

  @Action
  fetchUserAccess(): Promise<UserAccessRes> {
    return http.get("/owl/v1/subscribe/access-user").then((res) => {
      if (res.data.status) {
        this.context.commit("SET_USER_ACCESS", res.data.data);
      }
      return res.data;
    });
  }

  @Action
  fetchHistoryInvoices(payload: any): Promise<HistoryInvoice> {
    return http
      .get(
        `/owl/v1/history-payment?perpage=${payload.perPage}&page=${payload.page}`
      )
      .then((res) => {
        if (res.data.status) {
          this.context.commit("SET_HISTORY_INVOICES", res.data.data);
          this.context.commit(
            "SET_META_PAGINATION_HISTORY_INVOICE",
            res.data.meta.pagination
          );
        }
        return res.data;
      });
  }

  @Action
  getBankAccount(): Promise<BankAccountRes> {
    return http.get("/owl/v1/balance/bank-account").then((res) => {
      if (res.data.status) {
        this.context.commit("SET_BANK_ACCOUNT", res.data.data);
      }
      return res.data;
    });
  }

  @Action
  getAvailableBank(): Promise<BankListRes> {
    return http.get("/owl/v1/xendit/available-bank").then((res) => {
      return res.data;
    });
  }

  @Action
  getDisbursementCost() {
    return http.get("/parrot/v1/variable/disbursement-cost").then((res) => {
      return res.data;
    });
  }

  @Action
  createRefund(payload: any): Promise<any> {
    return http.post("/owl/v1/balance/disbursement", payload).then((res) => {
      return res.data;
    });
  }

  @Action
  verifyAccount(payload: any) {
    return http
      .post("/owl/v1/oklahoma/update-personal-data", payload)
      .then((res) => {
        return res.data;
      });
  }

  @Action
  stepOneUpdateAccount(payload: any) {
    return http.post("/owl/v1/update-account/", payload).then((res) => {
      return res.data;
    });
  }

  @Action
  stepTwoUpdateAccount(payload: any) {
    return http
      .post("/owl/v1/update-account/check-otp", payload)
      .then((res) => {
        return res.data;
      });
  }

  @Action
  stepThreeUpdateAccount(payload: any) {
    return http.post("/owl/v1/update-account/oklahoma", payload).then((res) => {
      return res.data;
    });
  }

  @Action
  stepFourUpdateAccount(payload: any) {
    return http
      .post("/owl/v1/update-account/oklahoma/finish", payload)
      .then((res) => {
        return res.data;
      });
  }
}
