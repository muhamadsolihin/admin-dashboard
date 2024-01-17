import store from "@/store";
import http from "@/http-common";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

export interface BalanceRes {
  status: boolean;
  message: string;
  data?: Balance;
}

export interface Balance {
  total_balance: number;
  balance: number;
  hold_balance: number;
}

export interface RefundRes {
  status: boolean;
  message: string;
  data?: Refund[];
}

export interface DetailRefundRes {
  status: boolean;
  message: string;
  data?: Refund;
}

export interface Refund {
  signature_id: string;
  status: number;
  amount: number;
  description: string;
  fee: number;
  vat: number;
  unix_time: number;
  unix_time_finish: number | null;
  disbursement_id: string;
  bank_account_number: string;
  bank_name: string;
  bank_name_holder: string;
}

export default interface MetaPagination {
  next_cursor: string | null;
  prev_cursor: string | null;
}

export interface TxBalanceRes {
  status: boolean;
  message: string;
  data?: TxBalance[];
}

export interface TxBalance {
  id: number;
  uuid: string;
  trx_id: string;
  outlet_id: number;
  outlet_name: string;
  total: number;
  fee_trx: number;
  subsidy_fee: number;
  is_move: number;
  method_payment: string;
  created_at: string;
  move_time: number;
}

@Module({ name: "BalanceModule", dynamic: true, store })
export default class BalanceModule extends VuexModule {
  balance: Balance = {} as Balance;
  txList: TxBalance[] = [];
  refundList: Refund[] = [];
  metaPaginationTx: MetaPagination = {} as MetaPagination;
  metaPaginationRefunds: MetaPagination = {} as MetaPagination;
  refund: Refund = {} as Refund;

  get getBalance() {
    return this.balance;
  }

  get getTransactions() {
    return this.txList;
  }

  get getRefunds() {
    return this.refundList;
  }

  get getterMetaPaginationRefunds() {
    return this.metaPaginationRefunds;
  }

  get getterMetaPaginationTx() {
    return this.metaPaginationTx;
  }

  get getRefund() {
    return this.refund;
  }

  @Mutation
  SET_BALANCE(payload: any) {
    this.balance = payload;
  }

  @Mutation
  SET_TX_HISTORY_LIST(payload: any) {
    this.txList = payload;
  }

  @Mutation
  SET_META_PAGINATION_TX(payload: any) {
    this.metaPaginationTx = payload;
  }

  @Mutation
  SET_REFUND_HISTORY_LIST(payload: any) {
    this.refundList = payload;
  }

  @Mutation
  SET_META_PAGINATION_REFUNDS(payload: any) {
    this.metaPaginationRefunds = payload;
  }

  @Mutation
  SET_REFUND(payload: any) {
    this.refund = payload;
  }

  @Action
  getCurrentBalance(): Promise<BalanceRes> {
    return http.get("/owl/v1/balance/").then((res) => {
      if (res.data.status) {
        this.context.commit("SET_BALANCE", res.data.data);
      }
      return res.data;
    });
  }

  @Action
  getTxHistoryList(payload: {
    perPage: number;
    cursor?: string | null;
    dateFrom: string;
    dateTo: string;
    search: string;
  }): Promise<TxBalanceRes> {
    return http
      .get(
        `/pelican/v1/balance-history?perpage=${
          payload.perPage
        }&search=${payload.search}&date_from=${payload.dateFrom}&date_to=${
          payload.dateTo
        }&cursor=${payload.cursor ? payload.cursor : ""}`
      )
      .then((res) => {
        if (res.data.status) {
          this.context.commit("SET_TX_HISTORY_LIST", res.data.data);
          this.context.commit("SET_META_PAGINATION_TX", res.data.meta);
        }
        return res.data;
      });
  }

  @Action
  getRefundHistoryList(payload: {
    perPage: number;
    cursor?: string | null;
    dateFrom: string;
    dateTo: string;
  }): Promise<RefundRes> {
    return http
      .get(
        `/owl/v1/balance/disbursement/history?perpage=${
          payload.perPage
        }&search&date_from=${payload.dateFrom}&date_to=${
          payload.dateTo
        }&cursor=${payload.cursor ? payload.cursor : ""}`
      )
      .then((res) => {
        if (res.data.status) {
          this.context.commit("SET_REFUND_HISTORY_LIST", res.data.data);
          this.context.commit("SET_META_PAGINATION_REFUNDS", res.data.meta);
        }
        return res.data;
      });
  }

  @Action
  getDetailRefund(payload: any): Promise<DetailRefundRes> {
    return http
      .get(`/owl/v1/balance/disbursement/history/${payload}`)
      .then((res) => {
        if (res.data.status) {
          this.context.commit("SET_REFUND", res.data.data);
        }
        return res.data;
      })
      .catch((err) => console.log(err));
  }
}
