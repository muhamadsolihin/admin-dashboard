import MetaPagination from '../MetaPagination.interface';

export interface HistoryInvoice {
  id: number;
  trx_id: string;
  unix_time: number;
  expired_date: number;
  period: number;
  payment_status: number;
  payment_method: string;
  price: number;
  total_price: number;
  name_subs: string;
  type_subs: number;
}
