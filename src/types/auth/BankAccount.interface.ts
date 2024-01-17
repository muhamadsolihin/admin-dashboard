export interface BankAccountRes {
  status: boolean;
  message: string;
  data?: BankAccount;
}

export interface BankAccount {
  id:                  number;
  bank_name_holder:    string;
  bank_name:           string;
  bank_code:           string;
  bank_account_number: string;
}
