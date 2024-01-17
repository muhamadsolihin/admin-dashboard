export interface BankListRes {
  status: boolean;
  message: string;
  data?: Bank[];
}
export interface Bank {
  name:              string;
  code:              string;
}
