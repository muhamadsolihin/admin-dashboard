// Generated by https://quicktype.io

export interface UserAccessRes {
  status:  boolean;
  message: string;
  data:    UserAccess[];
}

export interface UserAccess {
  code:            string;
  have_access:     number;
  amount?:         number;
  default_amount?: number;
  expired_date?:   number;
}
